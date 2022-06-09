const inputByType = require('../inputValue')


async function set() {
  const attributeData = this.attributesData.find(item => item.key === this.attribute)
  if (!attributeData) return
  if (attributeData.writeBehavior === 'NOT_ALLOWED' || attributeData.immutable) {
    throw new Error('Attribute Is ReadOnly')
  }
  if (this.isConfig) {
    const found = this.configSet.find(item => item.key === this.attribute)
    const { value } = await inputByType(attributeData)
    if (found) {
      found.value = value
    } else {
      this.configSet.push(
        {
          key: this.attribute,
          value,
          datatype: attributeData.type,
        }
      )
    }
  }
}
module.exports = set
