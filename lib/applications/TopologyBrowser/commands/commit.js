const logAttributes = require('../../../../util/logAttributes')
const logCommit = require('../../../../util/logCommit')


async function commit() {
  if (!this.configSet.length) {
    throw new Error('Configuration is empty❗')
  }
  for (const { fdn, poId, attributes } of this.configSet) {
    logAttributes(fdn, attributes)
    const axiosConfig = {
      text: 'Commiting Config...',
      method: 'put',
      url: `${this.objectUrl}${poId}`,
      data: {
        poId,
        fdn,
        attributes,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await this.httpClient.request(axiosConfig)
    if (response.data) {
      logCommit(response.data)
    }
  }
  this.abort()
}


module.exports = commit