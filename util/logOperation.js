const chalk = require('chalk')
const Table = require('cli-table3')


function statusColor(status) {
  switch (status) {
    case 'EXECUTED':
      return chalk.green(status)
    case 'INVALID':
    case 'EXECUTION_ERROR':
      return chalk.red(status)

    default:
      return chalk.yellow(status)
  }
}


function stringifyValue(value) {
  if (typeof value === 'object') {
    return JSON.stringify(value).replace(/['"\{\}\[\]]/g, '')
  }
  return value
}


function attributesTransform(attributes, currentAttributes) {
  return attributes.reduce((prev, curr) => {
    const { currentValue = '' } = currentAttributes.find(i => i.name === curr.name) ?? {}
    const { name, suppliedValue = '' } = curr
    return [
      ...prev,
      {
        [`    ${name}`]: [
          stringifyValue(suppliedValue),
          stringifyValue(currentValue),
        ]
      }
    ]
  }, [])
}


function consoleTable(params) {
  const table = new Table({
    chars: {
      'top': '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '',
      'left-mid': '',
      'mid': '',
      'mid-mid': '',
      'right': '',
      'right-mid': '',
      'middle': ' '
    },
    style: { 'padding-left': 0, 'padding-right': 0, head: ['magenta'], border: [] },
    head: ['    Attribute', 'Supplied value', 'Current value'],
    wordWrap: true,
    wrapOnWordBoundary: false,
    colWidths: [, 30, 30]
  })
  params.forEach(row => table.push(row))
  console.log(table.toString())
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
    breakpoint,
    attributes = [],
    currentAttributes = [],
  } = operation
  console.log(`
  ${chalk.yellowBright.bold('Operation ID:')} ${chalk.dim(id)}
  ${chalk.yellowBright.bold('Type:        ')} ${type}
  ${chalk.yellowBright.bold('Status:      ')} ${statusColor(status)}
  ${chalk.yellowBright.bold('Update Time: ')} ${new Date(updateTime).toLocaleString()}
  ${chalk.yellowBright.bold('FDN:         ')} ${chalk.cyanBright.underline(fdn)}`)
  if (breakpoint) {
    console.log('')
    console.log(`  ${chalk.blue.bold('Breakpoint 📌:')} ${breakpoint.type}_${breakpoint.id}: ${breakpoint.description}`)
  }
  if (failures) {
    console.log(`  ${chalk.yellowBright.bold('Failures:    ')}`)
    failures.forEach(({ failureReason }) => console.log(`    ❌ ${chalk.redBright(failureReason)}`))
  }
  console.log('')
  if (attributes.length > 0) {
    consoleTable(attributesTransform(attributes, currentAttributes))
    console.log('')
  }
}


module.exports = {
  logOperation,
  statusColor,
}