

async function initialPrompt() {
  const axiosConfig = {
    text: 'Starting Topology Browser...',
    method: 'get',
    url: `${this.objectUrl}network/-1?relativeDepth=0:-2&childDepth=1`
  }
  const response = await this.httpClient.request(axiosConfig)
  if (!response.data.treeNodes) {
    throw new Error('Nothing in initial promt‼')
  }
  const { moType, moName, poId } = response.data.treeNodes[0]
  this.currentPoId = poId
  this.nextPoId = poId
  this.nextVariants = async (input) => await this.nextObjects(input)
  this.fdn = `${moType}=${moName}`
}


module.exports = initialPrompt