const colors = require('colors')
const logAttributes = require('../../util/logAttributes')
const banner = require('../../util/banner')


function get(fdn) {
  const syncStatus = this.networkDetails.filter(item => item.key === 'syncStatus')[0]
  if (syncStatus && syncStatus.value === 'UNSYNCHRONIZED') {
    console.log(`
    ❗ ${syncStatus.key}: ${syncStatus.value} ❗`.yellow)
  }
  const attribute = this.attributes.filter(item => item.key === this.attribute)[0]
  const attributeData = this.attributesData.filter(item => item.key === this.attribute)[0]
  logAttributes(fdn, [attribute])
  console.log(`  ${'Type: '.green + attributeData['type']}    ${attributeData['defaultValue'] ? 'Default: '.yellow + attributeData['defaultValue'] : ''}
  `)
  if (attributeData.constraints && attributeData.constraints.orderingConstraint) banner(attributeData)
}

module.exports = get
