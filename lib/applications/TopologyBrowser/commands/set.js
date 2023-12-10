const inputByType = require('../inputValue')


async function set() {
  if (!this.isConfig) return
  const attributeData = this.attributesData.find(item => item.key === this.attribute)
  if (!attributeData) {
    throw new Error('No attribute data found❗')
  }
  if (attributeData.writeBehavior === 'NOT_ALLOWED' || attributeData.immutable) {
    throw new Error('Attribute Is ReadOnly')
  }
  const clearFdn = this.fdn.replace(/\((\w+)\)/g, '')
  const itemFound = this.configSet.find(item => item.fdn === clearFdn)
  const { value } = await inputByType(attributeData)
  const currentAttribute = {
    key: this.attribute,
    value,
    datatype: attributeData.type,
  }
  if (!itemFound) {
    this.configSet.push(
      {
        fdn: clearFdn,
        poId: this.currentPoId,
        attributes: [
          currentAttribute
        ]
      }
    )
    return
  }
  const attributeFound = itemFound.attributes.find(item => item.key === this.attribute)
  if (attributeFound) {
    attributeFound.value = value
  } else {
    itemFound.attributes.push(
      currentAttribute
    )
  }
}
module.exports = set
