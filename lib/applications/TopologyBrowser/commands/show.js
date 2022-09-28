const logAttributes = require('../../../../util/logAttributes')


async function show(filter) {
  const axiosConfig = {
    text: 'Getting Attributes...',
    method: 'get',
    url: `${this.objectUrl}${this.currentPoId}`,
    params: {
      includeNonPersistent: this.includeNonPersistent,
      stringifyLong: true
    }
  }
  const response = await this.httpClient.request(axiosConfig)
  if (!response.data.fdn || !response.data.attributes) return
  logAttributes(response.data.fdn, response.data.attributes.filter(item => item.key.match(filter)))
}


module.exports = show