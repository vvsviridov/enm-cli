const chalk = require('chalk')
const logAttributeData = require('../../../../util/logAttributeData')


function description() {
  const attributeData = this.attributesData.find(item => item.key === this.attribute)
  if (attributeData) {
    logAttributeData(attributeData)
    if (attributeData.complexRef) {
      console.log(`${chalk.magenta(attributeData.type)}
  ${chalk.cyan(attributeData.complexRef.key)}: ${chalk.grey(attributeData.complexRef.description)}
      `)
      attributeData.complexRef.attributes.forEach(attr => logAttributeData(attr))
    }
  } else {
    throw new Error('Attribute Not Found❗')
  }
}


module.exports = description