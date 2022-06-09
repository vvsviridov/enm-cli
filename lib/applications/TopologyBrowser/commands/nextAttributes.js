

async function nextAttributes(input) {
  const filter = input ? input : ''
  this.commands = this.configCommands
    .filter(item => item.toLowerCase().includes(filter.toLowerCase()))
  this.choices = this.attributes
    .map(item => item.key)
    .filter(item => item.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a > b ? 1 : -1)
}


module.exports = nextAttributes