const { prefix, guild_id } = require("../config.json")


module.exports = {
  name: "messageCreate",
  async execute (message) {
    const { client } = message
    
    if (!message.guild) return
    if (message.guild.id !== guild_id) return
    
    let channel_verify = "1046264214966243389"
    let channel_logs = client.channels.cache.get("1046264549277450321")
    
    if (message.channel.id !== channel_verify) return
    
    const owners = ["497748439770333184"]
    
    console.log(message.content)
    
    if (message.content.toLowerCase() != "saya mengerti") {
      if (message.author.bot) return
      if (message.content.toLowerCase() == "kata kunci") {
        setTimeout(() => message.delete(), 5000)
        return message.reply({ content: "Hey bukan \`kata kunci\` yang ini.\nsepertinya kamu belum membaca rulesnya, tolong di baca dulu dengan teliti." }).then(m => {
          setTimeout(() => m.delete(), 5000)
        })
      }
      setTimeout(() => message.delete(), 5000)
      return message.reply({ content: "Maaf sepertinya kamu belum membaca rulesnya, tolong di baca dulu dengan teliti." }).then(m => {
        setTimeout(() => m.delete(), 5000)
      })
    } else if (message.content.toLowerCase() == "saya mengerti") {
      setTimeout(() => message.delete(), 5000)
      message.member.roles.add("1046265745350344816").then(() => {
        setTimeout(function() {
          message.reply({ content: "Terima kasih sudah membaca rules.\n\n<#1047452678063656991> untuk memulai chat.\n<#1046264214966243389> untuk membaca rules.\n<#1046264214966243390> untuk melihat announcement.\n\nPesan ini akan dihapus dalam 30 detik.\n\nServer ini sedang dalam work in progress, jadi jika kamu mempunyai saran, bisa ajukan ke <#1048909431196368946>.\nBot developed by owner of this server (<@497748439770333184>)."}).then(m => setTimeout(() => m.delete(), 30000))
        }, 500)
      })
    
      client.channels.cache.get("1047452678063656991").send(`**Verify System: ** ${message.author.tag}, Selamat datang di server!.`)
      message.member.roles.remove("1047447567354581063")
    }
  }
}