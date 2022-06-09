const chalk = require('chalk')


function transformAttributes(element) {
  if (Array.isArray(element)) {
    return element.map(item => transformAttributes(item))
  }
  if (Array.isArray(element.value)) {
    return { [element.key]: transformAttributes(element.value) }
  }
  return element.key ? { [element.key]: element.value } : element
}


function colorize(attributes) {
  const sorted = attributes.sort ? attributes.sort((a, b) => a.key < b.key ? -1 : 1) : attributes
  return  JSON.stringify(transformAttributes(sorted), null, 1)
    .replace(/["(){}\[\]]/mg, '')
    .replace(/^\s*,*\n/mg, '')
    .replace(/,$/mg, '')
    .replace(/^(\s{2}\w+):/mg, chalk.green('$1:'))
    .replace(/^(\s{4}\w+):/mg, chalk.yellow('$1:'))
    .replace(/^(\s{5}\w+):/mg, chalk.cyan('$1:'))
}


function logAttributes(fdn, attributes) {
  const output = `
  ${chalk.yellow.bold('FDN')}: ${chalk.bold(fdn)}
${colorize(attributes)}`
  console.log(output)
}

module.exports = logAttributes