const colors = require('colors')
const logAttributes = require('../../util/logAttributes')
const requestWrapper = require('../../util/requestWrapper')
const logCommit = require('../../util/logCommit')


async function commit(fdn) {
  logAttributes(fdn, this.configSet)
  this.configSet.forEach(item => delete item.from)
  const axiosConfig = {
    method: 'put',
    url: `${this.objectUrl}${this.currentPoId}`,
    data: {
      poId: this.currentPoId,
      fdn,
      attributes: this.configSet,
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await requestWrapper(axiosConfig, 'Commiting Config...')
  if (response.data) {
    logCommit(response.data)
  } else {
    console.log('No data or response!'.red)
  }
  this.configSet.length = 0
  this.end()
  return fdn
}


module.exports = commit