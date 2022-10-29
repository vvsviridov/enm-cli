const chalk = require('chalk')


function logDefaultValue(value) {
  return value ? ` default: ${value}` : ''
}


function logAttribute(key, attribute, output) {
  let attrName = key.replace(/([A-Z])/g, ' $1')
  if (attribute !== undefined && attribute !== '') {
    output.push(`${chalk.blue(attrName.toLocaleUpperCase())}
    ${attribute}
    `)
  }
}


function logConstraints(constraints, output) {
  output.push(`${chalk.blue(Object.keys({ constraints }).pop().toLocaleUpperCase())}`)
  if (constraints.valueRangeConstraints) {
    constraints.valueRangeConstraints.forEach(item => {
      output.push(`    ${chalk.yellow('Range')}: ${item.minValue}..${item.maxValue}`)
    })
  }
  ['nullable', 'validContentRegex', 'valueResolution'].forEach(key => {
    if (Object.keys(constraints).includes(key)) {
      output.push(`    ${chalk.yellow(key.replace(/([A-Z])/g, ' $1').replace(/^([a-z])/g, (l) => l.toUpperCase()))}: ${constraints[key]}`)
    }
  })
}


function logEnumeration(enumeration, output) {
  output.push(`${chalk.blue(Object.keys({ enumeration }).pop().toLocaleUpperCase())}
    ${chalk.cyan(enumeration.key)}
      ${enumeration.description}`)
  enumeration.enumMembers.forEach(item => output.push(`        ${chalk.yellow(item.key)} (${item.value}): -- ${chalk.gray(item.description)}`))
}


function logList(listReference, output) {
  output.push(`${chalk.blue(Object.keys({ listReference }).pop().toLocaleUpperCase())}
    ${listReference.type}`)
  createOutput(listReference, output)
}


function logComplexRef(complexRef, output) {
  output.push(`${chalk.blue(complexRef.key.toLocaleUpperCase())}
    ${complexRef.description}`)
  complexRef.attributes.forEach(attribute => createOutput(attribute, output))
}


function createOutput(attributeData, output) {
  const attributeDataKeys = [
    'key',
    'type',
    'defaultValue',
    'description',
    'trafficDisturbances',
    'unit',
    'multiplicationFactor',
    'immutable',
    'precondition',
    'dependencies',
    'sideEffects',
    'activeChoiceCase',
  ]

  output.push(`
${chalk.yellow.bold(attributeData['key'])}: ${chalk.green(attributeData['type'])} ${logDefaultValue(attributeData['defaultValue'])}
  `)
  attributeDataKeys.slice(3).forEach((key) => logAttribute(key, attributeData[key], output))
  if (attributeData.constraints) {
    logConstraints(attributeData.constraints, output)
  }
  if (attributeData.enumeration) {
    logEnumeration(attributeData.enumeration, output)
  }
  if (attributeData.listReference) {
    logList(attributeData.listReference, output)
  }
  if (attributeData.complexRef) {
    logComplexRef(attributeData.complexRef, output)
  }
}


function logAttributeData(attributeData) {
  const output = []
  createOutput(attributeData, output)
  console.log(output.join('\n') + '\n')
}


module.exports = logAttributeData