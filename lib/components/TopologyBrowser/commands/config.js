const requestWrapper = require('../../util/requestWrapper')
const logDetails = require('../../util/logDetails')


async function config(fdn) {
  this.isConfig = true
  const axiosConfig = {
    method: 'get',
    url: `${this.objectUrl}${this.currentPoId}`,
    params: {
      includeNonPersistent: this.includeNonPersistent,
      stringifyLong: true
    }
  }
  const responseA = await requestWrapper(axiosConfig, 'Reading Attributes...')
  if (!responseA.data.attributes) {
    console.log('Can\'t read attributes'.red)
    return fdn
  }
  const { attributes, namespace, namespaceVersion, neType, neVersion, networkDetails, type} = responseA.data
  axiosConfig.url = `${this.objectUrl}model/${neType}/${neVersion}/${namespace}/${type}/${namespaceVersion}/attributes`
  axiosConfig.params = {
    includeNonPersistent: this.includeNonPersistent
  }
  const responseD = await requestWrapper(axiosConfig, 'Reading Attributes Data...')
  if (!responseD.data.attributes) {
    console.log('Can\'t read attributes data'.red)
    return fdn
  }
  this.networkDetails = networkDetails
  logDetails(networkDetails)
  this.attributes = attributes
  this.nextVariants = async (input) => await this.nextAttributes(input)
  this.attributesData = responseD.data.attributes
  return `${fdn}(config)`
}


module.exports = config