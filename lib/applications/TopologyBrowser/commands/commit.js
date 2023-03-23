const logAttributes = require('../../../../util/logAttributes')
const logCommit = require('../../../../util/logCommit')


async function commit() {
  if (!this.configSet.length) {
    throw new Error('Configuration is empty❗')
  }
  this.fdn = this.fdn.replace(/\((\w+)\)/g, '')
  logAttributes(this.fdn, this.configSet)
  const axiosConfig = {
    text: 'Commiting Config...',
    method: 'put',
    url: `${this.objectUrl}${this.currentPoId}`,
    data: {
      poId: this.currentPoId,
      fdn: this.fdn,
      attributes: [...this.configSet],
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
  this.configSet.length = 0
  this.end()
  const response = await this.httpClient.request(axiosConfig)
  if (response.data) {
    logCommit(response.data)
  } else {
    throw new Error('No data or response❗')
  }
}


module.exports = commit