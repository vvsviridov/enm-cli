const logDetails = require('../../../../util/logDetails')


async function config() {
  this.isConfig = true
  const axiosConfig = {
    text: 'Reading Attributes...',
    method: 'get',
    url: `${this.objectUrl}${this.currentPoId}`,
    params: {
      includeNonPersistent: this.includeNonPersistent,
      stringifyLong: true
    }
  }
  const responseA = await this.httpClient.request(axiosConfig)
  if (!responseA.data.attributes) {
    throw new Error('Can\'t read attributes')
  }
  const { attributes, namespace, namespaceVersion, neType, neVersion, networkDetails, type} = responseA.data
  axiosConfig.text = 'Reading Attributes Data...'
  axiosConfig.url = `${this.objectUrl}model/${neType}/${neVersion}/${namespace}/${type}/${namespaceVersion}/attributes`
  axiosConfig.params = {
    includeNonPersistent: this.includeNonPersistent
  }
  const responseD = await this.httpClient.request(axiosConfig)
  if (!responseD.data.attributes) {
    throw new Error('Can\'t read attributes data')
  }
  this.networkDetails = networkDetails
  logDetails(networkDetails)
  this.attributes = attributes
  this.nextVariants = async (input) => await this.nextAttributes(input)
  this.attributesData = responseD.data.attributes
  this.fdn = `${this.fdn}(config)`
}


module.exports = config