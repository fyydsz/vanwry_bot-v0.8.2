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
		.setName("ping")
		.setDescription(
			"Pong (client ping)"
		),
  category: "utility",
  usage: "/ping",
  
	async execute(client, interaction) {
    let ping = Date.now() - interaction.createdTimestamp
    await interaction.reply(`**Pinging...**`)
    await interaction.followUp(`:ping_pong: **__Pong!__**\n**Respon: \`${ping}\`** ms. | **Web Socket: \`${Math.round(client.ws.ping)}\`** ms.`)
	}
};
