const chalk = require('chalk')


const isEmpty = input => (input === '' ? chalk.bgRed('Empty Inputs not Allowed') : true)

const isValidHardwareId = input => (input.match(/[A-HJ-NP-Z0-9]{13}/) ? true : chalk.bgRed(`The Ericsson Hardware Serial Number frame consists of 13 alphanumeric characters.
Character set is the letters A-Z with the exception of O and I, and digits 0-9.`))

const isValidNumber = (input, constraints) => {
	if (constraints) {
		const test = input ? input : ''
		if (!constraints.nullable && test === 'null') return chalk.red('Value Can\'t Be a null')
		if (constraints.nullable && test === 'null') return true 
			if (!test.toString().match(/-?[0-9]+/)) return chalk.red('Input Is Not a Number')
		const checkResult = checkValueRangeConstraints(+test, constraints)
			if (checkResult) return checkResult
	}
	return true
}

const isValidString = (input, constraints) => {
	if (constraints) {
		const test = input ? input : ''
		if (!constraints.nullable && test === 'null') return chalk.red('Value Can\'t Be a null')
		if (constraints.nullable && test === 'null') return true
			if (constraints.validContentRegex && !test.match(constraints.validContentRegex)) return chalk.red('Input Doesn\'t Match RegEx')
		const checkResult = checkValueRangeConstraints(test.length, constraints)
			if (checkResult) return checkResult
	}
	return true
}

const checkValueRangeConstraints = (value, constraints) => {
	let min
	let max
	if (constraints.valueRangeConstraints) {
		const inRange = constraints.valueRangeConstraints.some(item => {
			min = item.minValue
			max = item.maxValue
			return min <= value && max >= value
		})
		errStrArr = constraints.valueRangeConstraints.map(item => `${item.minValue}..${item.maxValue}`)
		if (!inRange) return chalk.red(`Input is Outside Allowed Range: ${errStrArr.join(', ')}`)
	}
}


const isValidNodeName = (input) => {
	if (input.match('[a-zA-Z0-9-_.\\/:$]+') || input === '') {
		return true
	}
	return chalk.red('Node Name is Invalid')
}


const isXMas = () => {
	const date = new Date()
	if (date.getMonth() === 11 || date.getMonth() === 0) {
		return true
	}
}


module.exports = {
	isEmpty,
	isValidHardwareId,
	isValidNumber,
	isValidString,
	checkValueRangeConstraints,
	isValidNodeName,
	isXMas,
}