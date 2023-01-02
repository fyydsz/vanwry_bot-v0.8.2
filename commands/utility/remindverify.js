const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");
const { QuickDB } = require("quick.db");
const db = new QuickDB()
const moment = require("moment")
const ms = require("ms")


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("remindverify")
		.setDescription(
			"Remind the user who hasn't verify"
		)
    .addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The specific user for send the reminder")
				.setRequired(true)
		),
  category: "utility",
  ownerOnly: true,
  
	async execute(client, interaction) {
    
    let user = interaction.options.getUser("user");
    let memberJoined = moment(interaction.guild.members.cache.get(user.id).joinedTimestamp).format("x")
    let now = Date.now()
    
    let timestamp = moment(now - memberJoined).format("x")
    let days = moment.duration(604800000 - timestamp, "milliseconds").days()
    let hours = moment.duration(604800000 - timestamp, "milliseconds").hours()
    
    let embed = new EmbedBuilder();
    embed.setThumbnail(user.displayAvatarURL({ dynamic: true }))
    embed.setColor("#ffd500")
    embed.setAuthor({ name: "Verification Reminder.", iconURL: client.user.displayAvatarURL({ format: "png" })})
    embed.setDescription(`Hallo ${user}\nSepertinya kamu belum verifikasi di server **木・meows**.\n\nHarap verifikasi di server **木 meows** agar tidak terkena kick, karena server menggunakan sistem anti bot, jika butuh bantuan harap hubungi server moderator.\n\nVerifikasi dirimu disini <#1046264214966243389>\nKamu masih ada \`${days} hari ${hours} jam\` untuk verifikasi.`)
    embed.setFooter({ text: "Pesan ini dikirim dari server 木・meows."})
    
    if (user) {
      user.send({ embeds: [embed] })
      interaction.reply({ content: "Telah mengingatkan user.", embeds: [embed] })
    }
  }
};
