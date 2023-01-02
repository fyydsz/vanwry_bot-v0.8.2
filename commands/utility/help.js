/**
 * @file Sample help command with slash command.
 * @author Fyyy
 * @since 3.0.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"List all commands of bot or info about a specific command."
		)
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("The specific command to see the info of.")
				.setRequired(false)
		),
  category: "utility",
  usage: "/help || /help (commands)",
  
	async execute(client, interaction, args) {

    const embed = new EmbedBuilder()
    .setColor("BLUE")
    
    const command = interaction.options.getString("command")
    let commands;
    
    if (client.slashCommands.has(command)) commands = client.slashCommands.get(command)
    
    
    if (!command) {
      embed.setColor("#ffd500")
      embed.setAuthor({ 
        name: `${client.user.username}'s' Help`, 
        iconURL: client.user.displayAvatarURL({ format: 'png' })
      })
      embed.setDescription([`The bot prefix is **${prefix}** or @mention. \nDo ${prefix}help (command) for more info.`].join("\n "));
      
      const categories = fs.readdirSync("./commands/");
      categories.forEach(category => {
			
        const dir = client.slashCommands.filter(c => c.category === category.toLowerCase())
	  		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
        
		  	if (dir.size === 0) return;
			  embed.addFields({
          name: `❯ ${capitalise}`,
          value: dir.map(c => `\`${c.data.name}\``).join(", "),
          inline: false });
      })
      embed.setFooter({
        text: `Developed from Fyy#2195 ❤️`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      embed.setTimestamp();
      return interaction.reply({ embeds: [embed] })
    } else if (commands == undefined) {
      
      embed.setTitle("Invalid Command")
      embed.setDescription(`Do /help for the list of the commands.`)
      embed.setColor(null)
      
      return interaction.reply({ embeds: [embed] })
      
    } else if (command === commands.data.name) {
      embed.setColor("#ffd500")
      embed.setTitle(null)
      embed.setAuthor({ 
      name: `${client.user.username}'s' Help`, 
      iconURL: client.user.displayAvatarURL({ format: 'png' })
      })
      embed.setFooter({
        text: `Deployed from Fyy#2195 ❤️`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      embed.setThumbnail(client.user.displayAvatarURL({ format: "png" }))

      embed.setDescription(`❯ **Command:** ${prefix}${commands.data.name}\n❯ **Description:** ${commands.data.description || "No Description provided."}\n❯ **Usage:** ${commands.usage || "No Usage provided."}`)
      return interaction.reply({ embeds: [embed] })
    }   
	},
};
