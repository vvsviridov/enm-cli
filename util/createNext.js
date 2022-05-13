const inquirer = require('inquirer')


function createNext(filter) {
  const separator = new inquirer.Separator()
  const commands = this.commands.filter(cmd => cmd.toLowerCase().includes(filter.toLowerCase()))
  const choices = this.choices.filter(choice => choice.toLowerCase().includes(filter.toLowerCase()))
  return [
    separator,
    ...commands.map(cmd => `[${cmd}]`),
    separator,
    ...choices,
  ]
}


module.exports = createNext