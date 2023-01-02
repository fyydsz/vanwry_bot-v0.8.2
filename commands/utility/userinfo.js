
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const moment = require("moment")

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription(
			"Give some information about the user info."
		)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The specific user to see the info of.")
				.setRequired(false)
		),
  category: "utility",
  
	async execute(client, interaction, args) {
    
    
    let embed = new EmbedBuilder()
    .setColor("#ffd500")
    let user = interaction.options.getUser("user")
    
    if (!user) {
      let roleMap = interaction.member.roles.cache.map(role => role.id).length
      embed.setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL({ format: "png" })}`
      })
      embed.addFields({
        name: "ID", value: interaction.user.id, inline:true
      })
      embed.addFields({
        name: "Nickname", value: interaction.guild.members.cache.get(interaction.user.id).nickname || "No nickname", inline: true,
      })
      embed.addFields({ 
        name: "Account di buat", value: `<t:${moment(interaction.user.createdAt).format("X")}>`,
      })
      embed.addFields({ name: "Join di server ini", value: `<t:${moment(interaction.guild.members.cache.get(interaction.user.id).joinedTimestamp).format("X")}>`,
      })
      embed.addFields({
        name: `Roles [${roleMap}]`, value: `Untuk mengetahui roles ketik \`/roleinfo <user>\``, inline: true
      })
      embed.setThumbnail(interaction.user.displayAvatarURL({ format: "png" }))
      embed.setFooter({
        text: `Developed from Fyy#2195 ❤️`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      interaction.reply({ embeds: [embed] })
    } else if (user) {
      
      let roleMap = interaction.guild.members.cache.get(user.id)
      roleMap = roleMap.roles.cache.map(role => role.id).length - 1
      
      
      embed.setAuthor({
        name: `${user.tag}`,
        iconURL: `${user.displayAvatarURL({ format: "png" })}`
      })
      embed.addFields({
        name: "ID", value: user.id, inline:true
      })
      embed.addFields({
        name: "Nickname", value: interaction.guild.members.cache.get(user.id).nickname || "No nickname", inline: true,
      })
      embed.addFields({ 
        name: "Account di buat", value: `<t:${moment(user.createdAt).format("X")}>`,
      })
      embed.addFields({ name: "Join di server ini", value: `<t:${moment(interaction.guild.members.cache.get(user.id).joinedTimestamp).format("X")}>`,
      })
      embed.addFields({
        name: `Roles [${roleMap}]`, value: `Untuk mengetahui roles ketik \`/roleinfo <user>\``, inline: true
      })
      embed.setThumbnail(user.displayAvatarURL({ format: "png" }))
      embed.setFooter({
        text: `Developed from Fyy#2195 ❤️`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      interaction.reply({ embeds: [embed] })
    }
	}
};
