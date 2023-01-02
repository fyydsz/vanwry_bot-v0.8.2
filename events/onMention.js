const { prefix } = require("../config.json")
const { client } = require("discord.js")

module.exports = {
  name: "messageCreate",
  async execute (message) {
    if (message.author.bot || message.channel.type === "dm") return;
  
    const mentionRegex = RegExp(`^<@!?${message.client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${message.client.user.id}> `);
  
    if (message.content.match(mentionRegex)) {
        return message.channel.send(`**Hello ${message.author} !**\n**Prefix ku** \`${prefix}\`(*slash*).\n**Ketik \`${prefix}help\` untuk melihat list commands.**`);
    }
  }
}