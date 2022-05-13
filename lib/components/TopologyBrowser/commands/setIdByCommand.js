function setIdByCommand(command) {
  const nextChild = this.childrens.filter(child => `${child.moType}=${child.moName}` === command)[0]
  if (nextChild) {
    this.nextPoId = nextChild.poId
    return true
  }
  return false
}


module.exports = setIdByCommand