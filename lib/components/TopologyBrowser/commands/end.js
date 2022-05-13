function end() {
  this.isConfig = false
  this.attribute = null
  this.configSet.length = 0
  this.nextVariants = async (input) => await this.nextObjects(input)
}


module.exports = end