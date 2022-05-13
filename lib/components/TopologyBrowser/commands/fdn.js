const requestWrapper = require('../../util/requestWrapper')


async function fdn(fromFdn, targetFdn) {
  const axiosConfig = {
    method: 'get',
    url: `${this.objectUrl}fdn/${targetFdn}`,
  }
  const response1 = await requestWrapper(axiosConfig, 'Browsing to FDN...')
  if (!response1.data.fdn) return fromFdn
  this.poIds.length = 0
  const { fdn, poId } = response1.data
  this.currentPoId = poId
  this.nextPoId = poId
  this.nextVariants = async (input) => await this.nextObjects(input)
  axiosConfig.url = `${this.objectUrl}network/${this.currentPoId}/subTrees`
  const response2 = await requestWrapper(axiosConfig, 'Building FDN path...')
  if (response2.data) {
    if (response2.data.treeNodes.length > 1) {
      response2.data.treeNodes.slice(0, -1).forEach((node) => {
        this.poIds.push(node.poId)
      })
    }
    this.childrens = null
  }
  return fdn
}
module.exports = fdn
