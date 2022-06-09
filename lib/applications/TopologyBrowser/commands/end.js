function end() {
  this.fdn = this.fdn.replace(/\((\w+)\)/g, '')
  this.isConfig = false
  this.attribute = null
  this.configSet.length = 0
  this.configCommands = this.configCommands.filter(cmd => !['get', 'set', 'description'].includes(cmd) )
  this.nextVariants = async (input) => await this.nextObjects(input)
}


module.exports = end