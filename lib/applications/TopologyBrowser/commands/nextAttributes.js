const chalk = require('chalk')


async function nextAttributes(input) {
  // const filter = input ? input : ''
  this.commands = this.configCommands
    // .filter(item => item.toLowerCase().includes(filter.toLowerCase()))
  this.choices = this.attributes
    .map(({ key, value }) => ({
      value: key,
      short: key,
      name: `${key} ${chalk.dim(typeof value !== 'object' || value === null ? value : '...')}`
    }))
    // .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.value > b.value ? 1 : -1)
}


module.exports = nextAttributes