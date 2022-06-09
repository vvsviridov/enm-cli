function setIdByCommand(command) {
  const nextChild = this.childrens.find(child => `${child.moType}=${child.moName}` === command)
  if (nextChild) {
    this.nextPoId = nextChild.poId
    return true
  }
  return false
}


module.exports = setIdByCommand