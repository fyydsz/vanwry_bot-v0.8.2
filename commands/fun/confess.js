const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {

	data: new SlashCommandBuilder()
		.setName("confess")
		.setDescription(
			"Confess your feelings."
		)
		.addBooleanOption((option) =>
			option
				.setName("visible")
				.setDescription("True for visible to everyone or False to make it anonymous.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("confession")
				.setDescription("Submit the confession.")
				.setRequired(true)
		)
    .addUserOption((option) =>
			option
				.setName("mention")
				.setDescription("Mention the user that you want to confess.")
				.setRequired(false)
		),
	category: "fun",
  usage: "/confess <visible: true or false> <confession> (mention)",

	async execute(client, interaction, args) {
		if (interaction.channel.id !== "1053514067601530991") return interaction.reply("Maaf command ini hanya berlaku di channel <#1053514067601530991>.")
    
		let dataTable = db.table("Confess");
		let data = await dataTable.get("Confession")
    
		let confession = interaction.options.getString("confession")
    if (confession.length < 5) return interaction.reply({ content: "Minimal alphabet huruf untuk confess yaitu 5.", ephemeral: true })
    
    let mention = interaction.options.getUser("mention")
    if (mention) mention = mention.id
    if (!mention) mention = null

		let visible = interaction.options.getBoolean("visible")
    let visibled
    
    if (visible === true) visibled = true
    if (visible === false) visibled = false
		
		const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('confirmConfess')
				.setLabel('Ya')
				.setStyle(ButtonStyle.Primary),
		).addComponents(
			new ButtonBuilder()
				.setCustomId("cancelConfess")
				.setLabel("Tidak")
				.setStyle(ButtonStyle.Danger)
		)

		let embed = new EmbedBuilder()
		embed.setColor("Purple")
		embed.setDescription(`${confession}`)
		embed.setFooter({ text: "Confess your feelings using /confess command."})

		if (!data) {
			let number = 1

			if (visible === true) visible = embed.setAuthor({ name: `${interaction.user.tag} Confession (#${number})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
			if (visible === false) visible = embed.setAuthor({ name: `Anonymous Confession (#${number})`})

			interaction.reply({ content: "Apakah kamu yakin ingin mengirim confess?", embeds: [embed], components: [row], ephemeral: true })
			.then(i => {
        const filter = i => i.user.id === `${interaction.user.id}`
				const collector = i.createMessageComponentCollector(filter, { time: 30000 })

				collector.on("collect", async collected => {
					if (collected.customId === "confirmConfess") {
						collected.deferUpdate();
						if (mention) {
              interaction.channel.send({ content: `<@${mention}>`, embeds: [embed] })
            } else if (!mention) {
              interaction.channel.send({ embeds: [embed] })
            }
          
						dataTable.push("Confession", { name: `${interaction.user.tag}`, id: `${interaction.user.id}`, content: `${confession}`, mentionedID: mention, visible: visibled, globalID: number })
						
						interaction.deleteReply()
						return collector.stop()
					} else if (collected.customId === "cancelConfess") {
						collected.deferUpdate();
            
            interaction.deleteReply()
						return collector.stop()
					}
				})

				collector.on("end", async collected => {
					if (collected.size === 0) return interaction.channel.send("Tidak ada respon.").then(i => setTimeout(() => i.delete(), 5000))
				})
			})
		} else if (data) {
			let number = Math.max(...data.map(x => x.globalID))
			number = number += 1
			if (visible === true) visible = embed.setAuthor({ name: `${interaction.user.tag} Confession (#${number})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
			if (visible === false) visible = embed.setAuthor({ name: `Anonymous Confession (#${number})`})

			interaction.reply({ content: "apakah kamu yakin ingin mengirim confess?", embeds: [embed], components: [row], ephemeral: true })
			.then(i => {
        const filter = i => i.user.id === `${interaction.user.id}`
				const collector = i.createMessageComponentCollector({ filter, time: 30000 })

				collector.on("collect", async collected => {
					if (collected.customId === "confirmConfess") {
						collected.deferUpdate();
						if (mention) {
              interaction.channel.send({ content: `<@${mention}>`, embeds: [embed] })
            } else if (!mention) {
              interaction.channel.send({ embeds: [embed] })
            }
            
						dataTable.push("Confession", { name: `${interaction.user.tag}`, id: `${interaction.user.id}`, content: `${confession}`, mentionedID: mention, visible: visibled, globalID: number })
						
						interaction.deleteReply()
						return collector.stop()
					} else if (collected.customId === "cancelConfess") {
						collected.deferUpdate();
            
						interaction.deleteReply()
						return collector.stop()
					}
				})

				collector.on("end", async collected => {
					if (collected.size === 0) return interaction.channel.send("Tidak ada respon.").then(i => setTimeout(() => i.delete(), 5000))
				})
			})
		}
	}
};
