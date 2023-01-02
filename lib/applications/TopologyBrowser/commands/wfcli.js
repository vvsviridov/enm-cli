const { getActions, getNeType } = require('../../../../util/getActions')


async function wfcli() {
  const axiosConfig = {
    text: 'Launching WinFIOL CLI...',
    method: 'get',
    url: `/neconnection-service/v1/networkelement-data/${this.currentPoId}`,
  }
  const wfcliCommand = { command: 'wfcli' }
  const meContextFind = this.fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (meContextFind) {
    const type = meContextFind[1]
    const neType = await getNeType.call(this)
    const actions = await getActions.call(this, type, neType)
    const hasWinfiol = actions.find(action => action.applicationId === 'winfiol')
    if (hasWinfiol) {
      wfcliCommand['poid'] = this.currentPoId
    }
  }
  let response
  try {
    response = await this.httpClient.request(axiosConfig)
  } catch (error) {
    response = error.response
  }
  await this.webSocketSession(response.config.headers, '/winfiol-websocket/command', wfcliCommand)
}


module.exports = wfcli