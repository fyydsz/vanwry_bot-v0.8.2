
const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util")
const moment = require("moment")

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName("morse")
    .setDescription("It's about morse code")
    .addStringOption(option =>
      option
        .setName("encode")
        .setDescription("Type any of text you want to encode.")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("decode")
        .setDescription("Type any of morse code you want to decode.")
        .setRequired(false)
    ),
  category: "fun",
  usage: "/morse <encode> or <decode>",

  async execute(client, interaction, args) {
    
    let encodeString = interaction.options.getString("encode")
    let decodeString = interaction.options.getString("decode")
    
    if (encodeString) {
      function encode(morseCode) {
        const ref = {
          "A": ".-",
          "B": "-...",
          "C": "-.-.",
          "D": "-..",
          "E": ".",
          "F": "..-.",
          "G": "--.",
          "H": "....",
          "I": "..",
          "J": ".---",
          "K": "-.-",
          "L": ".-..",
          "M": "--",
          "N": "-.",
          "O": "---",
          "P": ".--.",
          "Q": "--.-",
          "R": ".-.",
          "S": "...",
          "T": "-",
          "U": "..-",
          "V": "...-",
          "W": ".--",
          "X": "-..-",
          "Y": "-.--",
          "Z": "--..",
          "1": ".----",
          "2": "..---",
          "3": "...--",
          "4": "....-",
          "5": ".....",
          "6": "-....",
          "7": "--...",
          "8": "---..",
          "9": "----.",
          "10": "-----",
          " ": "/"
        }
        return morseCode.toUpperCase().split("").map(el => {
          return ref[el] ? ref[el] : el;
         }).join(" ");
      }
      interaction.reply(`Kamu telah mengubah teks menjadi morse code \`${encodeString}\` menjadi\n${encode(encodeString)}`)
  
    } else if (decodeString) {
      function decode(morseCode) {
        var ref = { 
          '.-':     'A',
          '-...':   'B',
          '-.-.':   'C',
          '-..':    'D',
          '.':      'E',
          '..-.':   'F',
          '--.':    'G',
          '....':   'H',
          '..':     'I',
          '.---':   'J',
          '-.-':    'K',
          '.-..':   'L',
          '--':     'M',
          '-.':     'N',
          '---':    'O',
          '.--.':   'P',
          '--.-':   'Q',
          '.-.':    'R',
          '...':    'S',
          '-':      'T',
          '..-':    'U',
          '...-':   'V',
          '.--':    'W',
          '-..-':   'X',
          '-.--':   'Y',
          '--..':   'Z',
          '.----':  '1',
          '..---':  '2',
          '...--':  '3',
          '....-':  '4',
          '.....':  '5',
          '-....':  '6',
          '--...':  '7',
          '---..':  '8',
          '----.':  '9',
          '-----':  '0',
          "/"    :  ' '
          
        };
        return morseCode.toUpperCase().split(" ").map(el => {
          return ref[el] ? ref[el] : el;
         }).join("");
      }
      if (decodeString.includes("-- . . - / -- . / .- - / - --- .-- -. / .... .- .-.. .-..")) return interaction.reply("This morse was used in interactive story, you can't use it right now.\nNO CHEATING!!")
      interaction.reply(`Kamu telah mengubah morse code \`${decodeString}\` menjadi\n${decode(decodeString)}`)
      
    } else if (!encodeString && !decodeString) {
      interaction.reply({ content: "Kamu harus memilih salah satu option", ephemeral: true })
    }
  }
};


