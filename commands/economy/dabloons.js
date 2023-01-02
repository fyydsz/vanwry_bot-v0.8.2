const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");
const { QuickDB } = require("quick.db")
const db = new QuickDB()


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("dabloons")
		.setDescription("Dabloons!, show how many you get de dabloons!")
    .addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The specific user to see the dabloons of.")
				.setRequired(false)
		),
  category: "economy",
  usage: "/dabloons (user)",
  
	async execute(client, interaction) {
    let dabloons = db.table("Dabloons")
    let user = interaction.options.getUser("user")
    
    let embed = new EmbedBuilder()
    
    if (!user) {
      let data = await dabloons.get(`${interaction.guild.id}.${interaction.user.id}`)
      if (data == undefined) return interaction.reply("Sepertinya kamu belum memulai chat teman, cobalah untuk mengirim sesuatu agar kamu mendapatkan **dabloons**.")
      
      embed.setColor("Yellow")
      embed.setAuthor({ name: `${interaction.user.tag} Currency`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
      embed.setDescription(`**${interaction.user}** mempunyai \`${data}\` **dabloons** <:dabloons:1056741512215535687>.
      Kumpulkan dabloons dengan cara aktif diserver ini.
      `)
        
      interaction.reply({ embeds: [embed] })
      
    } else if (user) {
      if (user.bot && user.id === "1046274919350149141") {
        let member = interaction.guild.members.cache.get(user.id)
        let data = await dabloons.get(`${interaction.guild.id}.${member.id}`)
        if (data == undefined) return interaction.reply("Sepertinya dia belum memulai chat teman, cobalah beritahu dia untuk mengirim sesuatu agar dia mendapatkan **dabloons**.")
        
        embed.setColor("Yellow")
        embed.setAuthor({ name: `${member.user.tag} Currency`, iconURL: member.user.displayAvatarURL({ dynamic: true })})
        embed.setDescription(`**${member.user.tag}** mempunyai \`${data}\` **dabloons** <:dabloons:1056741512215535687>.\nTunggu sebentar, kamu telah menemukan Easter Egg \`(bot pertama yang memiliki dabloons)\`.`)
        
      
        await interaction.reply(`${interaction.user} menggunakan \`/dabloons\` ke ${user}`)
        await interaction.followUp({ embeds: [embed] })
      } else if (user.bot) { 
        await interaction.reply(`${interaction.user} menggunakan \`/dabloons\` ke ${user}`)
        return await interaction.followUp("Dabloons hanya berlaku untuk user.") 
      } else if (user.bot === false) {
        let member = interaction.guild.members.cache.get(user.id)
        let data = await dabloons.get(`${interaction.guild.id}.${member.id}`)
        if (data == undefined) return interaction.reply("Sepertinya dia belum memulai chat teman, cobalah beritahu dia untuk mengirim sesuatu agar dia mendapatkan **dabloons**.")
        
        embed.setColor("Yellow")
        embed.setAuthor({ name: `${member.user.tag} Currency`, iconURL: member.user.displayAvatarURL({ dynamic: true })})
        embed.setDescription(`**${member.user.tag}** mempunyai \`${data}\` **dabloons** <:dabloons:1056741512215535687>.`)
        
      
        await interaction.reply(`${interaction.user} menggunakan \`/dabloons\` ke ${user}`)
        await interaction.followUp({ embeds: [embed] }) 
      }
    }
	}
};
