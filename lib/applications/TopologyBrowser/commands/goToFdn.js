async function goToFdn(targetFdn) {
  if (!targetFdn) {
    throw new Error('Valid FDN must be supplied❗')
  }
  const axiosConfig = {
    text: 'Browsing to FDN...',
    method: 'get',
    url: `${this.objectUrl}fdn/${targetFdn}`,
  }
  const response1 = await this.httpClient.request(axiosConfig)
  this.poIds.length = 0
  const { fdn, poId } = response1.data
  this.currentPoId = poId
  this.nextPoId = poId
  this.nextVariants = async (input) => await this.nextObjects(input)
  axiosConfig.text = 'Building FDN path...'
  axiosConfig.url = `${this.objectUrl}network/${this.currentPoId}/subTrees`
  const response2 = await this.httpClient.request(axiosConfig)
  if (response2.data) {
    if (response2.data.treeNodes.length > 1) {
      response2.data.treeNodes.slice(0, -1).forEach((node) => {
        this.poIds.push(node.poId)
      })
    }
    this.childrens = null
  }
  this.fdn = fdn
}
module.exports = goToFdn
