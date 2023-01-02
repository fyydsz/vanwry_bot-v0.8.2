
const { prefix } = require("../config.json")
const wait = require('node:timers/promises').setTimeout;
const { client } = require("discord.js")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "messageCreate",
  async execute (message) {
    
    if (message.author.bot || message.channel.type === "dm") return;
    const { client } = message
     
    let cooldownTable = db.table("DabloonsDropCooldown")
    
    const randomDabloons = Math.floor(Math.random() * (10 - 5 + 1) + 5)
    const cooldown = Math.floor(Math.random() * (300000 - 180000 + 1) + 180000)
    
    let dataCooldown = await cooldownTable.get(`${message.guild.id}`)
    let timeout = cooldown
    
    if (dataCooldown !== null && timeout - (Date.now() - dataCooldown) > 0) return
    const channel = client.channels.cache.get("1047452678063656991")
    const activityChannel = client.channels.cache.get("1050310256330276904")
    
    let dabloons = db.table("Dabloons")
    
    let responses = [
			`Seseorang menawarkanmu \`${randomDabloons} dabloons\` <:dabloons:1056741512215535687>.`,
			`\`${randomDabloons} dabloons\` <:dabloons:1056741512215535687> sedang menggelinding.`,
			`\`${randomDabloons} dabloons\` <:dabloons:1056741512215535687> terjatuh dari langit.`,
			`Seseorang melempar \`${randomDabloons} dabloons\` <:dabloons:1056741512215535687>.`,
    ]
    
    let response = Math.floor(Math.random() * Math.floor(responses.length));
    
    const embed = new EmbedBuilder()
    .setColor("#ffd500")
    .setAuthor({ name: `Dabloons drop.`, iconURL: client.user.displayAvatarURL({ format: 'png' }) })
    .setDescription(`${responses[response]}\nCepat ambil sebelum ada yang mengambilnya.`)
    .setTimestamp()
    
    const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('dabloons')
					.setLabel('Ambil')
					.setStyle(ButtonStyle.Primary),
			);
    
    let msg = await channel.send({
        embeds: [embed],
        components: [row]
    }).then(async(m)  => {
        const collector = await m.createMessageComponentCollector({time: 30000})
        collector.on('collect', async collected => {
	        if (collected.customId === 'dabloons') {
            collected.deferUpdate();
            
            embed.setDescription(`${collected.user} telah mendapatkan \`${randomDabloons} dabloons\` <:dabloons:1056741512215535687>.`)
            m.edit({ embeds: [embed], components: [] }).then(m => setTimeout(() => m.delete(), 10000))
            
            cooldownTable.set(`${message.guild.id}`, Date.now())
            dabloons.add(`${message.guild.id}.${message.author.id}`, randomDabloons)
            
            embed.setDescription(`${collected.user} telah mendapatkan \`${randomDabloons} dabloons\` <:dabloons:1056741512215535687>.\ndari **interaction drop**.`)
            activityChannel.send({ embeds: [embed] })
            return collector.stop()
          }
        });
    
        collector.on('end', async collected => {
          cooldownTable.set(`${message.guild.id}`, Date.now())
          embed.setDescription(`Sayang sekali, tidak ada yang mengambil dabloonsnya.`)
          if (collected.size === 0) return m.edit({ embeds: [embed], components: [] }).then(m => setTimeout(() => m.delete(), 5000))
        });
        cooldownTable.set(`${message.guild.id}`, Date.now())
    })
    
//     const collector = await message.channel.createMessageComponentCollector({time: 30000});
    
//     collector.on('collect', async collected => {
// 	    if (collected.customId === 'dabloons') {
//         collected.deferUpdate();
        
//         embed.setDescription(`${collected.user} telah mendapatkan \`${randomDabloons} dabloons\`.`)
// 		    msg.delete()
//         message.channel.send({ embeds: [embed], components: [] }).then(m => setTimeout(() => m.delete(), 10000))
        
//         cooldownTable.set(`${message.guild.id}`, Date.now())
//         dabloons.add(`${message.guild.id}.${message.author.id}`, randomDabloons)
        
//         embed.setDescription(`${collected.user} telah mendapatkan \`${randomDabloons} dabloons\`.\ndari **interaction drop**.`)
//         activityChannel.send({ embeds: [embed] })
//         return collector.stop()
//       }
//     });
    
//     collector.on('end', async collected => {
//       cooldownTable.set(`${message.guild.id}`, Date.now())
//       embed.setDescription(`\`${randomDabloons} dabloons\` terjatuh dari langit.\ncepat ambil sebelum ada yang mengambilnya.\n\nsayang sekali, tidak ada yang mengambil dabloonsnya.`)
//       if (collected.size === 0) return msg.edit({ embeds: [embed], components: [] }).then(m => setTimeout(() => m.delete(), 5000))
//     });
//     cooldownTable.set(`${message.guild.id}`, Date.now())
  }
}