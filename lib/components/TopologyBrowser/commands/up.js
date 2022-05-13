function up() {
  if (this.poIds.length > 1) {
    this.poIds.pop()
    this.nextPoId = this.poIds.pop()
    this.currentPoId = this.poIds[this.poIds.length - 1]
  return true
  }
  return false
}


module.exports = up
