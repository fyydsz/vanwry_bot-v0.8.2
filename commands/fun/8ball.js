
const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util")
const moment = require("moment")

module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("This bot will answer you something ??")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Enter the question")
        .setRequired(true)
    ),
  category: "fun",
  usage: "/8ball <question>",

  async execute(client, interaction, args) {
    let question = interaction.options.getString("question")
    
    if (question) {
      let eightball = [
				'Sudah pasti',
				'Itu sudah pasti.',
				'Tanpa ragu, ya.',
				'Iya, tentu saja.',
				'Kamu mungkin bergantung padanya.',
				'Seperti yang saya lihat, ya.',
				'Yang paling disukai.',
				'Pandangan baik.',
				'Ya.',
				'Tanda-tanda menunjukkan iya.',
				'Lagi males, coba lagi nanti.',
				'Maaf? Tanya lagi.',
				'Sebaiknya ga ku kasih tau sekarang.',
				'Aku gatau.',
				'Jangan mengandalkannya.',
				'Gak.',
				'Kataku sih enggak',
				'Pandangan baik.',
				'Sangat diragukan.',
				'Ga mungkin.',
				'Mungkin?',
				'Jawabannya tersembunyi didalam hatimu.',
				'Hah apa?',
				'Tergantung mood tuhan.',
				'Ini adalah akhir.',
				'Ini adalah awal.',
				'Semoga beruntung.',
        ]
      let index = Math.floor(Math.random() * Math.floor(eightball.length));
      interaction.reply(`**The question:** ${question}\n**${eightball[index]}**`)
    }
  }
};


