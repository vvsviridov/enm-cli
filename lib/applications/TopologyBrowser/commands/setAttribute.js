function setAttribute(attribute) {
  if (!this.attributes) return false
  if (!this.attributes.find(item => item.key === attribute)) return false
  if (!this.attribute) {
    ['get', 'set', 'description'].forEach(cmd => this.configCommands.push(cmd))
  }
  this.attribute = attribute
  return true
}


module.exports = setAttribute