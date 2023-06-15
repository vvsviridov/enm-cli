async function home() {
  this.nextPoId = 1
  this.childrens = null
  this.poIds.length = 0
  await this.initialPrompt()
}


module.exports = home
