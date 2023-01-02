const { prefix } = require("../config.json")
const { client, EmbedBuilder } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()


module.exports = {
  name: "messageCreate",
  async execute (message) {
    if (message.author.bot || message.channel.type === "dm") return;
    const randomDabloons = Math.floor(Math.random() * (0 - 5 + 0) + 6)
    
    let dabloons = db.table("Dabloons")
    
    let cooldown = db.table("DabloonsCooldown")
    let dataCooldown = await cooldown.get(`${message.author.id}`)
    let timeout = 30000
    
    if (dataCooldown !== null && timeout - (Date.now() - dataCooldown) > 0) {
      return 
    } else {
      if (message.member.roles.cache.has("1046638592426004611")) {
        return dabloons.add(`${message.guild.id}.${message.author.id}`, randomDabloons)
      } else {
        cooldown.set(`${message.author.id}`, Date.now())
        return dabloons.add(`${message.guild.id}.${message.author.id}`, randomDabloons)
      }
    }
  }
}