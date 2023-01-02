const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util")

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload the commands")
    .addStringOption(option =>
      option
        .setName("command")
        .setDescription("Enter the command to reload")
        .setRequired(true)
    ),
  category: "developer",
  usage: "/reload <command name>",
  ownerOnly: true,

  async execute(client, interaction, args) {
    
    const value = interaction.options.getString("command")
    let command;
    
    if (client.slashCommands.has(value)) {
      command = client.slashCommands.get(value).data.name
    }
    
    if (command !== value) return interaction.reply(`Invalid command sir.`)
    
    const commandFolders = fs.readdirSync("./commands");
    const folderName = commandFolders.find((folder) =>
			fs.readdirSync(`./commands/${folder}`).includes(`${command}.js`)
		);
    
    console.log(`${command}.js`)
    delete require.cache[
			require.resolve(`../${folderName}/${command}.js`)
		];
    
		const newCommand = require(`../${folderName}/${command}.js`);
    interaction.client.slashCommands.set(newCommand.data.name, newCommand)
    
    interaction.reply({ content: `Command \`${newCommand.data.name}\` telah di reload.`, ephemeral: true })
  }
};
