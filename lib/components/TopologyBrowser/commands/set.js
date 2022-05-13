const colors = require('colors')
const inputByType = require('../inputValue')


async function set() {
  const attributeData = this.attributesData.filter(item => item.key === this.attribute)[0]
  if (!attributeData) return
  if (attributeData.writeBehavior === 'NOT_ALLOWED' || attributeData.immutable) {
    console.log('Attribute Is ReadOnly'.yellow)
    return
  }
  if (this.isConfig) {
    const found = this.configSet.filter(item => item.key === this.attribute)[0]
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
