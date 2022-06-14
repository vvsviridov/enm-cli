const inquirer = require('inquirer')


function createNext(filter) {
  const separator = new inquirer.Separator()
  const commands = this.commands.filter(cmd => cmd.toLowerCase().includes(filter.toLowerCase()))
  const choices = this.choices.filter(choice => choice.toLowerCase().includes(filter.toLowerCase()))
  let result = [
    ...choices,
    separator,
    ...commands.map(cmd => `[${cmd}]`),
    separator,
  ]
  if (result.includes([`${filter}`])) {
    result = result.filter(item => item !== [`${filter}`])
    result.unshift([`${filter}`])
  }
  return result
}


module.exports = createNext