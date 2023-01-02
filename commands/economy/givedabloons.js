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
		.setName("givedabloons")
		.setDescription("Give dabloons")
    .addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The specific user to give the dabloons")
				.setRequired(true)
		).addNumberOption((option) =>
      option
				.setName("amount")
				.setDescription("Minimal 1 dabloons")
				.setRequired(true)
    ),
  category: "economy",
  usage: "/givedabloons <user> <dabloons>",
  ownerOnly: true,
  
	async execute(client, interaction) {
    let dabloons = db.table("Dabloons")
    let user = interaction.options.getUser("user")
    let amount = interaction.options.getNumber("amount")
    
    let member = interaction.guild.members.cache.get(user.id)
    let channelTransfer = client.channels.cache.get("1050759384466210867")
  
    if (amount < 1) return interaction.reply(`Minimal untuk give dabloons adalah \`1\` dabloons.`)
    await dabloons.add(`${interaction.guild.id}.${user.id}`, amount)
    
    interaction.reply(`Berhasil give \`${amount}\` dabloons kepada ${member}`)
    
    const embed = new EmbedBuilder()
    .setColor("#ffd500")
    .setAuthor({ name: `Dabloons give.`, iconURL: client.user.displayAvatarURL({ format: 'png' }) })
    .setDescription(`${interaction.user} telah give \`${amount} dabloons\` kepada ${member}.`)
    .setTimestamp()
    
    channelTransfer.send({ embeds: [embed] })
    
	}
};
