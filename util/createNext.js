const chalk = require('chalk')
const inquirer = require('inquirer')


function createNext(filter) {
  const separator = new inquirer.Separator()
  const commands = this.commands.filter(cmd => cmd.toLowerCase().includes(filter.toLowerCase()))
  const choices = this.choices.filter(choice => choice.name.toLowerCase().includes(filter.toLowerCase()))
  let result = [
    ...choices,
    separator,
    ...commands.map(cmd => ({
      name: chalk.yellowBright.bold(`[${cmd}]`),
      value: `_${cmd}`,
      short: cmd,
    })),
    separator,
  ]
  const findFilter = result.find(item => item.short === filter)
  if (findFilter) {
    result = result.filter(item => item.short !== filter)
    result.unshift(findFilter)
  }
  return result
}


module.exports = createNext