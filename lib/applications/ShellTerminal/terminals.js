
const amosUrl = '/amos-service/amos/launch/info'


async function getNeType() {
  const axiosConfig = {
    text: 'Getting Network Element Type...',
    method: 'get',
    url: `${this.objectUrl}${this.currentPoId}`,
    params: {
      includeNonPersistent: false,
      stringifyLong: false
    }
  }
  const { data: { neType } } = await this.httpClient.request(axiosConfig)
  return neType
}


async function getActions(type, neType) {
  const axiosConfig = {
    text: 'Matching Actions...',
    method: 'post',
    url: '/rest/v1/apps/action-matches',
    data: {
      application: 'topologybrowser',
      multipleSelection: false,
      conditions: [
        {
          dataType: 'ManagedObject',
          properties: [
            { name: 'type', value: type },
            { name: 'type', value: type },
            { name: 'neType', value: neType },
          ]
        }
      ]
    }
  }
  const { data: { actions } } = await this.httpClient.request(axiosConfig)
  return actions
}


async function amos() {
  const axiosConfig = {
    text: 'Launching AMOS...',
    method: 'get',
    url: amosUrl,
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


async function scripting() {
  const axiosConfig = {
    text: 'Launching Scripting Shell...',
    method: 'get',
    url: amosUrl,
  }
  const response = await this.httpClient.request(axiosConfig)
  await this.webSocketSession(response.config.headers, '/scripting-terminal-ws/command', { command: 'scripting' })
}


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


async function nodecli() {
  const axiosConfig = {
    text: 'Launching Node CLI...',
    method: 'get',
    url: `/oss/idm/usermanagement/users/${this.username}?username=true`,
  }
  const meContextFind = this.fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (!meContextFind) {
    throw new Error('Can\'t launch node cli here❗')
  }
  const type = meContextFind[1]
  const neType = await getNeType.call(this)
  const actions = await getActions.call(this, type, neType)
  const hasNodeCli = actions.find(action => action.applicationId === 'nodecli')
  if (!hasNodeCli) {
    throw new Error('Can\'t launch node cli here❗')
  }
  const response = await this.httpClient.request(axiosConfig)
  await this.webSocketSession(response.config.headers, '/nodecli-websocket', { poid: this.currentPoId })
}


module.exports = { amos, scripting, wfcli, nodecli }