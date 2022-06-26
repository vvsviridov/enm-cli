const chalk = require('chalk')


function statusColor(status) {
  switch (status) {
    case 'EXECUTED':
      return chalk.green(status)
    case 'INVALID':
      return chalk.red(status)

    default:
      return chalk.yellow(status)
  }
}


function attributesTransform(attributes, currentAttributes) {
  return attributes.reduce((prev, curr) => {
    const { currentValue } = currentAttributes.find(i => i.name === curr.name) ?? {}
    const { name, suppliedValue } = curr
    return {
      ...prev,
      [name]: {
        currentValue: currentValue ? currentValue : '',
        suppliedValue,
      }
    }
  }, {})
}


function logOperation(operation) {
  if (!operation) {
    throw new Error('No operation data❗')
  }
  const {
    id,
    type,
    status,
    updateTime,
    fdn,
    failures,
    attributes = [],
    currentAttributes = [],
  } = operation
  console.log(`
  ${chalk.yellowBright.bold('Operation ID:')} ${chalk.dim(id)}
  ${chalk.yellowBright.bold('Type:        ')} ${type}
  ${chalk.yellowBright.bold('Status:      ')} ${statusColor(status)}
  ${chalk.yellowBright.bold('Update Time: ')} ${new Date(updateTime).toLocaleString()}
  ${chalk.yellowBright.bold('FDN:         ')} ${chalk.cyanBright.underline(fdn)}`)
  if (failures) {
    console.log(`  ${chalk.yellowBright.bold('Failures:    ')}`)
    failures.forEach(({ failureReason }) => console.log(`    ❌ ${chalk.redBright(failureReason)}`))
  }
  if (attributes.length > 0) {
    console.table(attributesTransform(attributes, currentAttributes))
  }
}


module.exports = {
  logOperation,
}