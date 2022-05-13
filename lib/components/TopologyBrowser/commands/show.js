const requestWrapper = require('../../util/requestWrapper')
const logAttributes = require('../../util/logAttributes')


async function show(filter) {
  const axiosConfig = {
    method: 'get',
    url: `${this.objectUrl}${this.currentPoId}`,
    params: {
      includeNonPersistent: this.includeNonPersistent,
      stringifyLong: true
    }
  }
  const response = await requestWrapper(axiosConfig)
  if (!response.data.fdn || !response.data.attributes) return
  logAttributes(response.data.fdn, response.data.attributes.filter(item => item.key.match(filter)))
}


module.exports = show