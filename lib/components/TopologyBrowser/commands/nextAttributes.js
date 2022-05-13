async function nextAttributes(input) {
  const filter = input ? input : ''
  let result = this.attributes.map(item => item.key).sort((a, b) => a > b ? 1 : -1)
                  .concat(this.configCommands)
                  .filter(item => item.toLowerCase().includes(filter.toLowerCase()))
  if (result.includes(filter)) {
    result = result.filter(item => item !== filter)
    result.unshift(filter)
  }
  return result
}


module.exports = nextAttributes