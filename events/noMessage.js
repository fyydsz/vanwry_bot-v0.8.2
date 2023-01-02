module.exports = {
  name: "messageCreate",
  async execute (message) {
    let confessChannel = "1053514067601530991"
    if (message.author.bot) return
    
    if (message.channel.id === confessChannel) {
      if (message.content) return setTimeout(() => message.delete(), 200) + message.reply("Tidak boleh mengirim teks disini. Hanya gunakan command </confess:1053516211532615800>.").then(m => setTimeout(() => m.delete(), 5000))
    }
  }
}
