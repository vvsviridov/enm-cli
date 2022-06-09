function up() {
  if (this.poIds.length > 1) {
    this.poIds.pop()
    this.nextPoId = this.poIds.pop()
    this.currentPoId = this.poIds[this.poIds.length - 1]
    this.fdn = this.fdn.split(',').slice(0, -1).join(',')
    return
  }
  throw new Error('There\'s no way up!')
}


module.exports = up
