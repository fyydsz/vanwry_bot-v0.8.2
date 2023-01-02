const wait = require('node:timers/promises').setTimeout;
const { inspect } = require("util")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require("discord.js")
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');


module.exports = {
  name: "interactionCreate",
  async execute (interaction) {
    
    const { client } = interaction
    const embed = new EmbedBuilder()
    
    const logEmbed = new EmbedBuilder()
    logEmbed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    
    const adventureRoles = interaction.guild.roles.cache.get("1056818956796698674")
    const chapter1_c1Roles = interaction.guild.roles.cache.get("1057347702351990794")
    const chapter1_c2Roles = interaction.guild.roles.cache.get("1057353539128668161")
    const chapter1_c3Roles = interaction.guild.roles.cache.get("1057359008744357958")
    
    const logChannel = client.channels.cache.get("1058703456535318588")
    
    // Kalau interactionnya itu tombol
    // Button Interaction
    if (interaction.isButton()) {
      if (interaction.customId === "chapter1_c1Secondary") {
        const modal = new ModalBuilder()
          .setCustomId('chapter1_code')
          .setTitle('Interaction');
        
        const codeInput = new TextInputBuilder()
          .setCustomId('chapter1_codeInput')
          .setStyle(TextInputStyle.Short)
          .setMinLength(0)
          .setMaxLength(20)
          .setLabel("Code:")
          .setPlaceholder('Pecahkan kodenya disini!')
          .setRequired(true)
        
        const firstActionRow = new ActionRowBuilder().addComponents(codeInput);
        
        modal.addComponents(firstActionRow) 
        await interaction.showModal(modal)
      }
    } 
    
    // Kalau interactionnya itu form
    // Modal Submit Interaction
    else if (interaction.isModalSubmit()) {
      if (interaction.customId === "chapter1_code") {
        const response = interaction.fields.getTextInputValue('chapter1_codeInput')
        const embedAdventure = new EmbedBuilder()
        
        interaction.member.roles.add(chapter1_c1Roles)
        setTimeout(() => interaction.member.roles.remove(adventureRoles), 10000)
        setTimeout(() => interaction.member.roles.remove(chapter1_c2Roles), 10000)
        
         if (response.toLowerCase() !== "meet me at town hall") {
           await interaction.deferReply()
           await wait(1000)
           return interaction.editReply(`${interaction.user} Maaf, sepertinya kamu salah menjawab, silahkan coba lagi.`).then(() => setTimeout(() => interaction.deleteReply(), 3000))
         }
        
        embedAdventure.setTitle("Continue to next story.")
        embedAdventure.setDescription("Kamu telah berhasil menebak isi kode dari surat yang dikirimkan entah dari siapa.\nKamu membuka __plot baru!__ di channel <#1057349004838572123>.")
        embedAdventure.setColor("Blue")
        embedAdventure.setFooter(null)
        
        logEmbed.setTitle(`Plot Chosen`)
        logEmbed.setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        
        if (interaction.member.roles.cache.has("1056818956796698674")) {
          logEmbed.setDescription(`${interaction.user} telah **Menebak kodenya** di channel <#1056828991119564881>.\nRole ${chapter1_c1Roles} telah di tambahkan.\nRole ${adventureRoles} telah di remove.`)
        } else if (interaction.member.roles.cache.has("1057353539128668161")) {
          logEmbed.setDescription(`${interaction.user} telah **Menebak kodenya** di channel <#1057356567688794183>.\nRole ${chapter1_c1Roles} telah di tambahkan.\nRole ${chapter1_c2Roles} telah di remove.`)
        }
        logEmbed.setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        logEmbed.setColor("Purple")
        
        logChannel.send({ embeds: [logEmbed] })
        
        await interaction.deferReply()
        await wait(1000)
        
        return interaction.editReply({ content: `${interaction.user}`, embeds: [embedAdventure] }).then(() => setTimeout(() => interaction.deleteReply(), 9000))
      }
    } 
    
    // Kalau interactionnya itu pilihan menu
    // Select menu
    else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "morse_book") {
        const selected = interaction.values[0]
        if (selected === "chapter-1_c2") {
          embed.setTitle("Kode yang harus dipecahkan")
          embed.setColor("Blue")
          embed.setDescription(`\`-- . . - / -- . / .- - / - --- .-- -. / .... .- .-.. .-..\``)
          
          await interaction.reply({ embeds: [embed], ephemeral: true })
        }
      }
    }
  }
}
