const wait = require('node:timers/promises').setTimeout;
const { inspect } = require("util")

module.exports = {
  name: "interactionCreate",
  async execute (interaction) {
    if (!interaction.isModalSubmit()) return;
    
	  if (interaction.customId === 'evalCommand') {
      
      await interaction.deferReply()
      await wait(1000)
      
      const toEval = interaction.fields.getTextInputValue("evalInput")
      
      try {
        let evaluated = inspect(eval(toEval, { depth: 0 } ))
        let hrStart = process.hrtime()
        let hrDiff = process.hrtime(hrStart)
        
        return interaction.editReply(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`javascript\n${evaluated}\n\`\`\``, { maxLength: 1900 })
      } catch(err) {
        return interaction.editReply(`Error whilst evaluating: \`${err}\``)
      }
	  }
  }
}
