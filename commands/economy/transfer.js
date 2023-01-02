const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");
const { QuickDB } = require("quick.db")
const db = new QuickDB()


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("transfer")
		.setDescription("Transfer your dabloons")
    .addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The specific user to transfer the dabloons")
				.setRequired(true)
		).addNumberOption((option) =>
      option
				.setName("amount")
				.setDescription("Min 5 - Max 1000")
				.setRequired(true)
    ),
  category: "economy",
  usage: "/transfer <user> <amount>",
  
	async execute(client, interaction) {
    let dabloons = db.table("Dabloons")
    let user = interaction.options.getUser("user")
    if (user.bot) return interaction.reply("bot tidak diperbolehkan menerima dabloons.")
    let amount = interaction.options.getNumber("amount")
    
    let member = interaction.guild.members.cache.get(user.id)
    let channelTransfer = client.channels.cache.get("1050759384466210867")
    
    let data = await dabloons.get(`${interaction.guild.id}.${interaction.user.id}`)
    if (data == undefined) return interaction.reply("Sepertinya kamu belum memulai chat teman, cobalah untuk mengirim sesuatu agar kamu mendapatkan **dabloons**.")
    
    if (data < 5) return interaction.reply(`Maaf, kamu tidak memenuhi syarat untuk transfer.\n**Dabloons** mu ${data} dan minimal untuk transfer adalah 5 dabloons.`)
    if (amount < 5) return interaction.reply(`Minimal untuk mentransfer dabloons adalah \`5\` dabloons.`)
    if (amount > 1000) return interaction.reply(`Maksimal untuk mentransfer dabloons adalah \`1000\` dabloons.`)
    
    await dabloons.add(`${interaction.guild.id}.${user.id}`, amount)
    await dabloons.sub(`${interaction.guild.id}.${interaction.user.id}`, amount)
    
    interaction.reply(`Berhasil transfer \`${amount}\` dabloons kepada ${member}`)
    
    const embed = new EmbedBuilder()
    .setColor("#ffd500")
    .setAuthor({ name: `Dabloons transfer.`, iconURL: client.user.displayAvatarURL({ format: 'png' }) })
    .setDescription(`${interaction.user} telah transfer \`${amount} dabloons\` kepada ${member}.`)
    .setTimestamp()
    
    channelTransfer.send({ embeds: [embed] })
    
	}
};
