/**
 * @file Sample help command with slash command.
 * @author Fyyy
 * @since 3.0.0
 */

// Deconstructed the constants we need in this file.
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("sendmenu")
		.setDescription(
			"Send menu"
		),
  category: "utility",
  usage: "/sendmenu",
  ownerOnly: true,
  
	async execute(client, interaction) {
    const embed = new EmbedBuilder()
    .setTitle("Mengalami kesulitan?")
    .setDescription("Halo, jika kamu mengalami kesulitan karena bolak-balik ke channel yang ingin kamu pecahkan kodenya, kamu bisa memilih menu di bawah.")
    .setColor("Blue")
    .setFooter({ text: "Bot & Story created by Fyy#2195 ❤️"})
    
    const row = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('morse_book')
        .setPlaceholder("Pilih channelnya disini.")
        .setMinValues(1)
        .setMaxValues(1)
				.addOptions(
					{
						label: 'chapter-1_c2',
						description: 'Kode yang akan dipecahkan di channel #chapter-1_c2.',
						value: 'chapter-1_c2',
            emoji: "1️⃣"
					}
				),
		);
    
    await interaction.deferReply()
    await interaction.editReply("Sent!")
    await interaction.channel.send({ embeds: [embed], components: [row] })
    
	}
};
