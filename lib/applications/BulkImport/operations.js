const chalk = require("chalk")

const operationsCommands = ['print', 'back', 'exit']
const operationsCommandsHelp = [
  '[print] - Print all operations.',
  '[back] - Return to jobs.',
  '[exit] - Exit this app.',
  'Or choose a node from list...',
]


async function getOperations() {
  const params =new URLSearchParams()
  params.append('offset', this.operationsOffset)
  params.append('limit', this.operationsLimit)
  params.append('expand', 'attributes')
  params.append('expand', 'persistentCurrentAttributes')
  params.append('expand', 'failures')
  params.append('expand', 'warnings')
  // params.append('status', 'invalid')
  // params.append('status', 'execution-error')
  const axiosConfig = {
    text: 'Getting operations...',
    method: 'get',
    url: `${this.appUrl}/${this.jobId}/operations/`,
    params,
  }
  const { data } = await this.httpClient.request(axiosConfig)
  this.operations = data.operations
  this.operationsId = null
  this.operationsLinks = data._links
  this.choices = this.operations.map(item => ({
    name: `${item.status === 'EXECUTED' ? chalk.green(item.type) : chalk.red(item.type)} ${item.fdn.slice(-79)}`,
    value: item.id,
    short: item.id
  }))
  this.commands = [...operationsCommands]
  Object.values(this.operationsLinks).forEach(item => {
    if (item.rel !== 'self' || item.rel !== 'job') {
      this.commands.push(item.rel)
    }
  })
  this.help = operationsCommandsHelp.join('\n  ')
  this.prompt = `${data.totalCount} operations (${this.operationsOffset}-${Math.min(this.operationsOffset + this.operationsLimit, data.totalCount)})`
}


function setOperationsPagination(href) {
  const url = new URL(href)
  const searchParams = new URLSearchParams(url.search)
  this.operationsLimit = +searchParams.get('limit')
  this.operationsOffset = +searchParams.get('offset')
}


async function pageOperations(page) {
  if (!this.operationsLinks[page]) {
    throw new Error(`No ${page} jobs❗`)
  }
  setOperationsPagination.call(this, this.operationsLinks[page].href)
  await this.getOperations()
}


module.exports = {
  getOperations,
  pageOperations,
}