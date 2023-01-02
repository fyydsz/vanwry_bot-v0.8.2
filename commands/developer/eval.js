const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util")
const moment = require("moment")

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate the codes"),
  ownerOnly: true,
  category: "developer",
  usage: "/eval <code>",
  

  async execute(client, interaction, args) {
    

    const modal = new ModalBuilder()
			.setCustomId('evalCommand')
			.setTitle('Evaluate Javascript Codes');
    
    const evalInput = new TextInputBuilder()
			.setCustomId('evalInput')
			.setLabel("Enter the javascript codes")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);
    
    const firstActionRow = new ActionRowBuilder().addComponents(evalInput);
    
    modal.addComponents(firstActionRow)
    await interaction.showModal(modal)
  }
};
