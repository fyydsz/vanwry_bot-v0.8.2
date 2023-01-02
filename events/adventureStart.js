const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require("discord.js")
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  name: "messageCreate",
  async execute (message) {
    if (message.author.bot) return
    const { client } = message
    
    // List of variables
    // Roles and channel ID
    const guild = client.guilds.cache.get("1046264214341304390")
    const userID = message.author.id
    const userTag = message.author.tag
    const user = message.author
    
    const adventureRoles = guild.roles.cache.get("1056818956796698674")
    const chapter1_c1Roles = guild.roles.cache.get("1057347702351990794")
    const chapter1_c2Roles = guild.roles.cache.get("1057353539128668161")
    const chapter1_c3Roles = guild.roles.cache.get("1057359008744357958")
    
    const adventureChannelID = "1056822923618422934"
    const chapter1_1ChannelID = "1056828991119564881"
    const chapter1_c1ChannelID = "1057349004838572123"
    const chapter1_c2ChannelID = "1057356567688794183"
    const chapter1_c3ChannelID = "1057359579249389720"
    
    // Embed Adventure
    // This apply for adventure
    const embedAdventure = new EmbedBuilder()
    embedAdventure.setTitle("Sebelum melanjutkan")
    embedAdventure.setDescription("Kami akan mengumpulkan informasi data untuk menganalisa dan improve cerita agar lebih baik lagi.\n\nData yang akan dikumpulkan berupa:\n• User ID.\n• Roles.\n• Chosen plot.\n\nDengan menekan **Iya** berarti kamu setuju dan memulai petualangan ini.")
    embedAdventure.setColor("Blue")
    embedAdventure.setFooter({ text: "We keep your data safe.", iconURL: message.guild.iconURL({ dynamic: true }) })
    embedAdventure.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
     
    
    // Embed Logs of Adventure
    // This will logs to Log channel
    const logChannel = client.channels.cache.get("1058703456535318588")
    
    const logEmbed = new EmbedBuilder()
    logEmbed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    
    // Execute kalau channelnya Adventure
    // Sebelum memulai Adventure
    if (message.channel.id === adventureChannelID) {
      if (message.content.toLowerCase() === "saya bersedia") {
        setTimeout(() => message.delete(), 5000)
        
        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("primary")
            .setLabel("Iya")
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("danger")
            .setLabel("Tidak")
            .setStyle(ButtonStyle.Danger)
        )
        
        message.channel.send({ embeds: [embedAdventure], components: [row] }).then(msg => {
          const filter = i => i.user.id === `${message.author.id}`
          const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
          
          collector.on("collect", async collected => {
            const yes = collected.customId === "primary"
            const no = collected.customId === "danger"
            
            if (yes) {
              message.member.roles.add(adventureRoles)
              
              embedAdventure.setTitle("Selamat Berpetualang")
              embedAdventure.setDescription(`${message.author} Selamat berpetualang!\nKamu akan memasuki chapter 1 di channel <#1056828991119564881>`)
              embedAdventure.setFooter({ text: "Remember, choices have consequences", iconURL: message.guild.iconURL({ dynamic: true }) })
              
              collected.deferUpdate()
              message.channel.send({ embeds: [embedAdventure] }).then(m => setTimeout(() => m.delete(), 10000))
              
              logEmbed.setTitle(`Adventure Started!`)
              logEmbed.setAuthor({ name: `${userTag} (${userID})`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
              logEmbed.setDescription(`${user} telah mengikuti petualangan.\nRole ${adventureRoles} telah ditambahkan.`)
              logEmbed.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
              logEmbed.setColor("Green")
              
              logChannel.send({ embeds: [logEmbed] })
              
              msg.delete()
              return collector.stop()
            } else if (no) {
              msg.delete()
              return collector.stop()
            }
          })
          
          collector.on("end", async collected => {
            if (collected.size === 0) {
              msg.delete()
              return message.channel.send("Tidak ada respon").then(m => setTimeout(() => m.delete(), 5000))
            }
          })
        })
      } else if (message.content.toLowerCase() !== "saya bersedia") {
        return message.delete()
      }
    }
    
    // Execute kalau channelnya Chapter 1 dan interact
    // Channel = chapter1_1
    if (message.channel.id === chapter1_1ChannelID) {
      // Interact check
      if (message.content.toLowerCase() === "interact") {
        message.delete()
        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("chapter1_c2Primary")
            .setLabel("Bertanya kepada Denny")
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("chapter1_c3Danger")
            .setLabel("Hiraukan kertas itu")
            .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("chapter1_c1Secondary")
            .setLabel("Pecahkan kodenya")
            .setStyle(ButtonStyle.Secondary)
        )
        
        embedAdventure.setTitle("Interaction Tutorial")
        embedAdventure.setDescription(`Haloo, ini adalah interaksi pertamamu bukan?\nKamu bisa berinteraksi dengan\n\n**Memilih pilihan dibawah**\n\nSelamat berpetualang!`)
        embedAdventure.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        embedAdventure.setFooter(null)
        
        message.channel.send({ embeds: [embedAdventure], components: [row] }).then(msg => {
          const filter = i => i.user.id === `${message.author.id}`
          const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
          
          collector.on("collect", async collected => {
            const button1 = collected.customId === "chapter1_c2Primary"
            const button2 = collected.customId === "chapter1_c3Danger"
            const button3 = collected.customId === "chapter1_c1Secondary"
            
            if (button1) {
              msg.delete()
              
              if (message.member.roles.cache.some(role => role.id === "1057347702351990794")) {
                message.channel.send("Error, kamu telah berhasil menebak isi dari **code / teka-teki** tersebut.")
                .then(m => setTimeout(() => m.delete(), 5000))
                return collector.stop()
              }
              
              message.member.roles.add(chapter1_c2Roles)
              setTimeout(() => message.member.roles.remove(adventureRoles), 10000)
              
              embedAdventure.setTitle("Interaction")
              embedAdventure.setDescription(`${message.author} Kamu telah memilih untuk **Bertanya kepada Denny**.\nKamu membuka __plot baru!__ di channel <#1057356567688794183>.`)
              
              collected.deferUpdate()
              setTimeout(() => message.channel.send({ content: `${message.author}`, embeds: [embedAdventure] }).then(m => setTimeout(() => m.delete(), 10000)), 200)
              
              logEmbed.setTitle(`Plot Chosen`)
              logEmbed.setAuthor({ name: `${userTag} (${userID})`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
              logEmbed.setDescription(`${user} telah memilih untuk **Bertanya kepada Denny**.\nRole ${chapter1_c2Roles} telah di tambahkan.\nRole ${adventureRoles} telah di remove.`)
              logEmbed.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
              logEmbed.setColor("Purple")
              
              logChannel.send({ embeds: [logEmbed] })
              
              return collector.stop()
            } else if (button2) {
              msg.delete()
              
              if (message.member.roles.cache.some(role => role.id === "1057347702351990794")) {
                message.channel.send("Error, kamu telah berhasil menebak isi dari **code / teka-teki** tersebut.")
                .then(m => setTimeout(() => m.delete(), 5000))
                return collector.stop()
              }
              
              message.member.roles.add(chapter1_c3Roles)
              setTimeout(() => message.member.roles.remove(adventureRoles), 10000)
              
              embedAdventure.setTitle("Interaction")
              embedAdventure.setDescription(`${message.author} Kamu telah memilih untuk **Menghiraukan kertas itu**.\nKamu membuka __plot baru!__ di channel <#1057359579249389720>.`)
              
              collected.deferUpdate()
              setTimeout(() => message.channel.send({ content: `${message.author}`, embeds: [embedAdventure] }).then(m => setTimeout(() => m.delete(), 10000)), 200)
              
              logEmbed.setTitle(`Plot Chosen`)
              logEmbed.setAuthor({ name: `${userTag} (${userID})`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
              logEmbed.setDescription(`${user} telah memilih untuk **Menghiraukan kertas itu**.\nRole ${chapter1_c3Roles} telah di tambahkan.\nRole ${adventureRoles} telah di remove.`)
              logEmbed.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
              logEmbed.setColor("Purple")
              
              logChannel.send({ embeds: [logEmbed] })
              
              return collector.stop()
            } else if (button3) {
              msg.delete()
              return collector.stop()
            }
          })
          
          collector.on("end", async collected => {
             if (collected.size === 0) {
               msg.delete()
               return message.channel.send("Tidak ada respon").then(m => setTimeout(() => m.delete(), 5000))
             }
          })
        })
      } else if (message.content.toLowerCase() !== "interact") {
        return message.delete()
      }
    }
    
    // Execute kalau channelnya Chapter 1 dan interact
    // Channel = chapter1_c2
    if (message.channel.id === chapter1_c2ChannelID) {
      if (message.content.toLowerCase() === "interact") {
        message.delete()
        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("morse_book")
            .setLabel("Buka buku nya")
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("chapter1_c1Secondary")
            .setLabel("Pecahkan kodenya")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        )
        
        const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("morse_book")
            .setLabel("Buka buku nya")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("chapter1_c1Secondary")
            .setLabel("Pecahkan kodenya")
            .setStyle(ButtonStyle.Primary)
        )
        
        let morseBookRoles = guild.roles.cache.get("1059003061688860703")
        
        if (!message.member.roles.cache.has("1059003061688860703")) {
          
          embedAdventure.setTitle("Interaction")
          embedAdventure.setDescription(`Harry sepertinya ingin memecahkan kode tersebut. Kamu mendapatkan **Buku Panduan** untuk memecahkan kode itu.`)
          embedAdventure.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          embedAdventure.setFooter(null)
          
          message.channel.send({ embeds: [embedAdventure], components: [row] }).then(msg => {
            const filter = i => i.user.id === `${message.author.id}`
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
            
            collector.on("collect", async collected => {
              const button1 = collected.customId === "morse_book"
              
              if (button1) {
                msg.delete()
                message.member.roles.add(morseBookRoles)
                
                embedAdventure.setDescription(`Bagus!\nAyo kita baca **Buku Panduannya** di channel <#1059077185882828891>\n\nJika sudah menemukan kodenya, ketik \`interact\` lagi di sini.`)
                setTimeout(() => message.channel.send({ content: `${message.author}`, embeds: [embedAdventure] }).then(m => setTimeout(() => m.delete(), 30000)), 200)
                
                logEmbed.setTitle(`Ability rewarded!`)
                logEmbed.setAuthor({ name: `${userTag} (${userID})`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                logEmbed.setDescription(`${user} mendapatkan **Buku panduan morse**.\nRole ${morseBookRoles} telah ditambahkan.`)
                logEmbed.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                logEmbed.setColor("Purple")
                
                logChannel.send({ embeds: [logEmbed] })
                
                return collector.stop()
              }
            })
          
            collector.on("end", async collected => {
              if (collected.size === 0) {
                 msg.delete()
               return message.channel.send("Tidak ada respon").then(m => setTimeout(() => m.delete(), 5000))
              }
            })
            
          })
        } else if (message.member.roles.cache.has("1059003061688860703")) {
          embedAdventure.setTitle("Interaction")
          embedAdventure.setDescription(`Ayo pecahkan kodenya!\nJika lupa kata kuncinya, baca **buku panduannya** di\nchannel <#1059077185882828891>`)
          embedAdventure.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          embedAdventure.setFooter(null)
          
          message.channel.send({ embeds: [embedAdventure], components: [row2] }).then(msg => {
            const filter = i => i.user.id === `${message.author.id}`
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
            
            collector.on("collect", async collected => {
              const button2 = collected.customId === "chapter1_c1Secondary"
              
              if (button2) {
                msg.delete()
                return collector.stop()
              }
            })
          
            collector.on("end", async collected => {
              if (collected.size === 0) {
                 msg.delete()
               return message.channel.send("Tidak ada respon").then(m => setTimeout(() => m.delete(), 5000))
              }
            })
            
          })
          
        }
      } else if (message.content.toLowerCase() !== "interact") {
        return message.delete()
      }
    }
    
  }
}

