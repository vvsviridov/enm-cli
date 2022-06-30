const chalk = require('chalk')


async function nextAttributes(input) {
  this.commands = this.configCommands
  this.choices = this.attributes
    .map(({ key, value }) => ({
      value: key,
      short: key,
      name: `${key} ${chalk.dim(typeof value !== 'object' || value === null ? value : '...')}`
    }))
    .sort((a, b) => a.value > b.value ? 1 : -1)
}


module.exports = nextAttributes