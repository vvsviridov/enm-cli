const colors = require('colors')
const logAttributeData = require('../../util/logAttributeData')


function description() {
  const attributeData = this.attributesData.filter(item => item.key === this.attribute)[0]
  if (attributeData) {
    logAttributeData(attributeData)
    if (attributeData.complexRef) {
      console.log(`${attributeData.type.magenta}
  ${attributeData.complexRef.key.cyan}: ${attributeData.complexRef.description.grey}
      `)
      attributeData.complexRef.attributes.forEach(attr => logAttributeData(attr))
    }
  } else {
    console.log('Attribute Not Found!'.yellow)
  }
}


module.exports = description