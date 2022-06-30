const chalk = require("chalk")

const logError = require('../../../../util/logError')
const tableChoices = require('../../../../util/tableChoices')

const otherCommands = [
  'show', 'config', 'up', 'home',
  'fdn', 'search', 'persistent', 'alarms',
  'sync', 'exit'
]


function getSyncStatus(child) {
  if (child.syncStatus === 'SYNCHRONIZED') return '✅ '
  if (child.syncStatus === 'UNSYNCHRONIZED') return '⏳ '
  return child.syncStatus ? '❓ ' : ''
}


function getRadioAccessTechnology(child) {
  return child.radioAccessTechnology ? chalk.bold.cyan(child.radioAccessTechnology.join(' ')) : ''
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


async function nextObjects(input) {
  const filter = input ? input : ''
  const filterChoice = [{ name: filter, value: filter, short: filter }]
  if (this.currentPoId !== this.nextPoId || !this.childrens) {
    this.currentPoId = this.nextPoId
    this.poIds.push(this.currentPoId)
    await networkRequest.call(this)
  }
  this.commands = otherCommands

  const tableData = this.childrens
    .map(child => {
      const nameValue = []
      nameValue.push(`${getSyncStatus(child)}${child.moType}=${child.moName}`)
      nameValue.push(child.neType ? chalk.dim.gray(child.neType) : '')
      nameValue.push(getRadioAccessTechnology(child))
      return nameValue
    })
  this.choices = tableChoices(tableData)
    .map((row, i) => ({
      name: row,
      value: `${this.childrens[i].moType}=${this.childrens[i].moName}`,
      short: `${this.childrens[i].moType}=${this.childrens[i].moName}`,
    }))
    .concat(filter.startsWith('show') ? filterChoice : [])
    .concat(filter.startsWith('fdn') ? filterChoice : [])
}


module.exports = nextObjects