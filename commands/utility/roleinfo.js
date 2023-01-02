
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const moment = require("moment")

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("roleinfo")
		.setDescription(
			"Give some information about the roles info."
		)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The specific user to see the roles of.")
				.setRequired(false)
		),
  category: "utility",
  usage: "/roleinfo || /roleinfo (user)",
  
	async execute(client, interaction, args) {
    
    let embed = new EmbedBuilder()
    .setColor("#ffd500")
    
    const user = interaction.options.getUser("user")
    if (!user) {
      let role = interaction.member.roles.cache.map(role => role)
      embed.setTitle(`${interaction.user.tag}'s Roles [${role.length}]`)
      embed.setDescription(`${role.join(", ")}`)
      embed.setFooter({
        text: `Developed from Fyy#2195 ❤️`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      interaction.reply({ embeds: [embed] })
    } else if (user) {
      let role = interaction.guild.members.cache.get(user.id)
      role = role.roles.cache.map(role => role)
      embed.setTitle(`${user.tag}'s Roles [${role.length}]`)
      embed.setDescription(`${role.join(", ")}`)
      embed.setFooter({
        text: `Developed from Fyy#2195 ❤️`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      interaction.reply({ embeds: [embed] })
    }
	}
};
