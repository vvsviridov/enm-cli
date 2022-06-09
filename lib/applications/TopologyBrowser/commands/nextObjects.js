const chalk = require("chalk")
const logError = require('../../../../util/logError')

const otherCommands = ['show', 'config', 'up', 'home', 'fdn', 'search', 'persistent', 'alarms', 'sync', 'exit']


function getSyncStatus(child) {
  if (child.syncStatus === 'SYNCHRONIZED') return '\t\t✅'
  if (child.syncStatus === 'UNSYNCHRONIZED') return '\t\t⏳'
  return child.syncStatus ? '\t\t❓' : ''
}


function getRadioAccessTechnology(child) {
  return child.radioAccessTechnology ? ' ' + chalk.bold.cyan(child.radioAccessTechnology.join(' ')) : ''
}


async function networkRequest() {
  try {
    const axiosConfig = {
      text: 'Loading network data...',
      method: 'get',
      url: `${this.objectUrl}network/${this.currentPoId}`
    }
    const { data: { treeNodes } } = await this.httpClient.request(axiosConfig)
    if (treeNodes) {
      this.childrens = treeNodes[0].childrens
    }
  } catch (error) {
    logError(error)      
  }
}


async function nextObjects(input){
  const filter = input ? input : ''
  if (this.currentPoId !== this.nextPoId || this.childrens.length === 0) {
    this.currentPoId = this.nextPoId
    this.poIds.push(this.currentPoId)
    await networkRequest.call(this)
  }
  this.commands = otherCommands.filter(cmd => cmd.toLowerCase().includes(filter.toLowerCase()))
  this.choices = this.childrens
    .map(child => {
      const st = getSyncStatus(child)
      const rt = getRadioAccessTechnology(child)
      const ne = child.neType ? ' ' + chalk.dim.gray(child.neType) : ''
      return `${child.moType}=${child.moName}${st}${rt}${ne}`
    })
    .filter(child => child.toLowerCase().includes(filter.toLowerCase()))
    .concat(filter.startsWith('show') ? [filter] : [])
    .concat(filter.startsWith('fdn') ? [filter] : [])
}


module.exports = nextObjects