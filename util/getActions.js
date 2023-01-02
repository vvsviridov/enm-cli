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


module.exports = { getNeType, getActions }