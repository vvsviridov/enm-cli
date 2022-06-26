const logAttributes = require('../../../../util/logAttributes')
const banner = require('../../../../util/banner')
const chalk = require('chalk')


function get() {
  const syncStatus = this.networkDetails.find(item => item.key === 'syncStatus')
  if (syncStatus && syncStatus.value === 'UNSYNCHRONIZED') {
    console.log(chalk.yellow(`
    ❗ ${syncStatus.key}: ${syncStatus.value} ❗`))
  }
  const attribute = this.attributes.find(item => item.key === this.attribute)
  if (!attribute) {
    throw new Error(`Attribute not Found: ${this.attribute}`)
  }
  const { constraints, defaultValue, type } = this.attributesData.find(item => item.key === this.attribute)
  logAttributes(this.fdn, [attribute])
  console.log(`  ${chalk.green('Type: ') + type}    ${defaultValue && chalk.yellow('Default: ') + defaultValue}
  `)
  if (constraints && constraints.orderingConstraint) banner(constraints)
}

module.exports = get
