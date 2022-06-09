function home() {
  this.fdn = this.fdn.split(',', 1)[0]
  this.nextPoId = this.poIds.shift()
  this.poIds.length = 0
  this.nextVariants = async (input) => await this.nextObjects(input)
}


module.exports = home
