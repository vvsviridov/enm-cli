const chalk = require('chalk')


const isEmpty = input => (input === '' ? chalk.bgRed('Empty Inputs not Allowed') : true)

const isValidHardwareId = input => (input.match(/[A-HJ-NP-Z0-9]{13}/) ? true : chalk.bgRed(`The Ericsson Hardware Serial Number frame consists of 13 alphanumeric characters.
Character set is the letters A-Z with the exception of O and I, and digits 0-9.`))


module.exports = { isEmpty, isValidHardwareId }