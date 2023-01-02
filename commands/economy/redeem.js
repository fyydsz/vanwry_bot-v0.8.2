const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const fs = require("fs");
const { title } = require("process");
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const wait = require('node:timers/promises').setTimeout;


module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("redeem")
		.setDescription("Reedem code to get reward")
    .addStringOption((option) =>
			option
				.setName("code")
				.setDescription("The specific code")
				.setRequired(true)
    ),
  category: "economy",
  usage: "/redeem <code>",
  
	async execute(client, interaction) {    
    const codes = [
      "Interactive",
      "NewYear2023"
    ]
    
    const stringCode = interaction.options.getString("code")
    let checkCodes = codes.includes(stringCode)
    if (checkCodes === false) {
      await interaction.deferReply()
      await wait(3000)
      return interaction.editReply("Maaf, kamu memasukkan kode yang salah")
    }

    let redeem = db.table("Reedem")
    let redeemData = await redeem.get("Redeemed")
    console.log(redeemData)
    
    let dabloons = db.table("Dabloons")
   
    if (!redeemData) {
      let number = 1
      if (stringCode === "Interactive") {
        await interaction.deferReply()
        await wait(3000)
        redeem.push("Redeemed", { userID: `${interaction.user.id}`, redeemCode: `${stringCode}`, status: true, globalID: 1})
        await interaction.editReply("Successfully redeemed, Kamu mendapatkan 1000 Dabloons.")
        return dabloons.add(`${interaction.guild.id}.${interaction.user.id}`, 1000)
      } else if (stringCode === "NewYear2023") {
        await interaction.deferReply()
        await wait(3000)
        redeem.push("Redeemed", { userID: `${interaction.user.id}`, redeemCode: `${stringCode}`, status: true, globalID: 1})
        await interaction.editReply("Successfully redeemed, Kamu mendapatkan 2500 Dabloons.")
        return dabloons.add(`${interaction.guild.id}.${interaction.user.id}`, 2500)
      }
    } else if (redeemData) {
      
      let number = Math.max(...redeemData.map(x => x.globalID))
			number = number += 1
      
      if (stringCode === "Interactive") {
        let checkRedeem = redeemData.find(x => x.redeemCode === "Interactive" && x.userID === `${interaction.user.id}`)
        
        if (checkRedeem == undefined) {
          await interaction.deferReply()
          await wait(3000)
          redeem.push("Redeemed", { userID: `${interaction.user.id}`, redeemCode: `${stringCode}`, status: true, globalID: number})
          await interaction.editReply("**Successfully redeemed**. Kamu mendapatkan 1000 Dabloons.")
          return dabloons.add(`${interaction.guild.id}.${interaction.user.id}`, 1000)
        } else {
          await interaction.deferReply()
          await wait(1000)
          return interaction.editReply("**Already redeemed**. Maaf sepertinya kamu telah meredeem code tersebut.")
        }
      } else if (stringCode === "NewYear2023") {
        let checkRedeem = redeemData.find(x => x.redeemCode === "NewYear2023" && x.userID === `${interaction.user.id}`)
        
        if (checkRedeem == undefined) {
          await interaction.deferReply()
          await wait(3000)
          redeem.push("Redeemed", { userID: `${interaction.user.id}`, redeemCode: `${stringCode}`, status: true, globalID: number})
          await interaction.editReply("**Successfully redeemed**. Kamu mendapatkan 2500 Dabloons.")
          return dabloons.add(`${interaction.guild.id}.${interaction.user.id}`, 2500)
        } else {
          await interaction.deferReply()
          await wait(1000)
          return interaction.editReply("**Already redeemed**. Maaf sepertinya kamu telah meredeem code tersebut.")
        }
      }
    }
	}
};
