
const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util")
const moment = require("moment")

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice.")
    .addNumberOption(option =>
      option
        .setName("value")
        .setDescription("Enter the value")
        .setRequired(false)
    ),
  category: "fun",
  usage: "/roll (value)",

  async execute(client, interaction, args) {
    let value = interaction.options.getNumber("value")
    const diceFunction = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (!value) {
      let defaultDice = diceFunction(1, 6)
      interaction.reply(`Kamu mengocok dadu, dan mendapatkan angka **${defaultDice}**`)
    } else if (value) {
      let customDice = diceFunction(1, value)
      interaction.reply(`Kamu memilih angka di antara 1 sampai ${value} dan mendapatkan angka **${customDice}**`)
    }
  }
};


