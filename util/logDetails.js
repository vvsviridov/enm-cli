const chalk = require('chalk')


function logDetails(networkDetails) {
  const output = networkDetails.map(details => `    ${chalk.gray(details.key)}: ${details.value === 'UNSYNCHRONIZED' ? '⌛ ' + chalk.yellow(details.value): chalk.gray(details.value)}`)
  console.log(`
${output.join('\n')}
  `)
}

module.exports = logDetails