const colors = require('colors')
const requestWrapper = require('../../util/requestWrapper')


async function initialPrompt() {
  const axiosConfig = {
    method: 'get',
    url: `${this.objectUrl}network/-1?relativeDepth=0:-2&childDepth=1`
  }
  const response = await requestWrapper(axiosConfig, 'Starting Topology Browser...')
  if (!response.data.treeNodes) {
    console.log('Nothing in initial promt!'.red)
    return
  }
  const { moType, moName, poId } = response.data.treeNodes[0]
  this.currentPoId = poId
  this.nextPoId = poId
  this.nextVariants = async (input) => await this.nextObjects(input)
  return `${moType}=${moName}`
}


module.exports = initialPrompt