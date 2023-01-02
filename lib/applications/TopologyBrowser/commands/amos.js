const { getActions, getNeType } = require('../../../../util/getActions')


async function amos() {
  const axiosConfig = {
    text: 'Launching AMOS...',
    method: 'get',
    url: this.amosUrl,
  }
  const amosCommand = { command: 'shell' }
  const meContextFind = this.fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (meContextFind) {
    const type = meContextFind[1]
    const nodeName = meContextFind[2]
    const neType = await getNeType.call(this)
    const actions = await getActions.call(this, type, neType)
    const hasAmos = actions.find(action => action.applicationId === 'advancedmoscripting')
    if (hasAmos) {
      axiosConfig['params'] = { poid: this.currentPoId }
      amosCommand.command = 'amos'
      amosCommand['poid'] = nodeName
    }
  }
  const response = await this.httpClient.request(axiosConfig)
  await this.webSocketSession(response.config.headers, '/terminal-websocket/command', amosCommand)
}


module.exports = amos