
const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util")
const moment = require("moment")

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName("binary")
    .setDescription("It's about binary code")
    .addStringOption(option =>
      option
        .setName("encode")
        .setDescription("Type any of text you want to encode.")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("decode")
        .setDescription("Type any of binary code you want to decode.")
        .setRequired(false)
    ),
  category: "fun",
  usage: "/binary <encode> or <decode>",

  async execute(client, interaction, args) {
    
    let encodeString = interaction.options.getString("encode")
    let decodeString = interaction.options.getString("decode")
    
    if (encodeString) {
      function encode(char) {
        return char.split("").map(str => {
          const converted = str.charCodeAt(0).toString(2);
          return converted.padStart(8, "0");
        }).join(" ")
      }
      interaction.reply(`Kamu telah mengubah teks menjadi binary code!\n${encode(encodeString)}`)
    } else if (decodeString) {
      
      function decode(char) {
        return char.split(" ").map(str => String.fromCharCode(Number.parseInt(str, 2))).join("");
      }
      interaction.reply(`Kamu telah mengubah binary code menjadi teks!\n${decode(decodeString)}`)
    } else if (!encodeString && !decodeString) {
      interaction.reply({ content: "Kamu harus memilih salah satu option", ephemeral: true })
    }
  }
};


