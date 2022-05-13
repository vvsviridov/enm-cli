const requestWrapper = require('../../util/requestWrapper')

const otherCommands = ['show', 'config', 'up', 'home', 'fdn', 'persistent', 'alarms', 'sync', 'exit']


async function nextObjects(input){
  const filter = input ? input : ''
  if (this.currentPoId !== this.nextPoId || !this.childrens) {
    this.currentPoId = this.nextPoId
    this.poIds.push(this.currentPoId)
    const axiosConfig = {
      method: 'get',
      url: `${this.objectUrl}network/${this.currentPoId}`
    }
    const response = await requestWrapper(axiosConfig)
    if (response.data.treeNodes) {
      this.childrens = response.data.treeNodes[0].childrens
    }
  }
  let result = this.childrens
          .map(child => `${child.moType}=${child.moName}`)
          .concat(otherCommands)
          .filter(child => child.toLowerCase().includes(filter.toLowerCase()))
          .concat(filter.startsWith('show') ? [filter] : [])
          .concat(filter.startsWith('fdn') ? [filter] : [])
  if (result.includes(filter)) {
    result = result.filter(item => item !== filter)
    result.unshift(filter)
  }
  return result
}


module.exports = nextObjects