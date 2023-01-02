const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const moment = require("moment")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("nick")
		.setDescription(
			"Set your nickame in this server"
		)
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The spesific nickname do you want to change")
        .setRequired(false)
    ),
  category: "utility",
  usage: "/nick (new nickname)",
  
	async execute(client, interaction) {
    
    const primaryButton = new ButtonBuilder()
		  .setCustomId('confirmNick')
		  .setLabel('Ya')
		  .setStyle(ButtonStyle.Primary)
    
    const secondaryButton = new ButtonBuilder()
			.setCustomId("cancelNick")
			.setLabel("Tidak")
			.setStyle(ButtonStyle.Secondary)
    
    const dangerButton = new ButtonBuilder()
			.setCustomId("resetNick")
			.setLabel("Reset")
			.setStyle(ButtonStyle.Danger)
		
    
    const row = new ActionRowBuilder()
		.addComponents(primaryButton).addComponents(secondaryButton).addComponents(dangerButton)
    
    let string = interaction.options.getString("nickname")
    
    
    
    let cooldown = db.table("SetnickCooldown")
    let dataCooldown = await cooldown.get(`${interaction.user.id}`)
    let timeout = 10800000
    
    
    if (string) {
      let member = interaction.guild.members.cache.get(interaction.user.id)
      
      if (member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply("Oops kamu adalah server admin.")
      
      interaction.reply({ content: `Apakah kamu ingin mengganti nickname mu menjadi **\`${string}\`**.\nKamu bisa mengganti nickname mu lagi dalam 3 jam.`, components: [row],   })
      .then(i => {
        const filter = i => i.user.id === `${interaction.user.id}`
				const collector = i.createMessageComponentCollector({ filter, time: 15000 })
        
        collector.on("collect", async collected => {
          if (collected.customId === "confirmNick") {
            collected.deferUpdate();
            wait(4000)
            
            primaryButton.setDisabled(true)
            secondaryButton.setDisabled(true)
            dangerButton.setDisabled(true)
            
            if (dataCooldown !== null && timeout - (Date.now() - dataCooldown) > 0) {
              return interaction.editReply({ content :"Oops kamu sedang cooldown, cobalah beberapa saat lagi!", components: [row],   }).then(i => setTimeout(() => interaction.deleteReply(), 5000))
            }
            
            member.setNickname(`${string}`)
            cooldown.set(`${interaction.user.id}`, Date.now())
            
            interaction.editReply({ content :"Berhasil mengubah nickname!", components: [row],   }).then(i => setTimeout(() => interaction.deleteReply(), 5000))
            
            return collector.stop()
            
          } else if (collected.customId === "cancelNick") {
            collected.deferUpdate();
            wait(4000)
            
            interaction.deleteReply()
            return collector.stop()
            
          } else if (collected.customId === "resetNick") {
            collected.deferUpdate();
            wait(4000)
            member.setNickname(null)
            
            primaryButton.setDisabled(true)
            secondaryButton.setDisabled(true)
            dangerButton.setDisabled(true)
            
            interaction.editReply({ content :"Berhasil me-reset nickname!", components: [row],   }).then(i => setTimeout(() => interaction.deleteReply(), 5000))
            
            return collector.stop()
            
          }
        })
        
        collector.on('end', collected => {
          primaryButton.setDisabled(true)
          secondaryButton.setDisabled(true)
          dangerButton.setDisabled(true)
          
          if (collected.size === 0) return interaction.editReply({ content :"Tidak ada respon", components: [row],  }).then(i => setTimeout(() => interaction.deleteReply(), 5000))
        });
    
      })
    }
	}
};
