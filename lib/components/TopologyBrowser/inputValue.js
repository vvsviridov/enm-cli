const colors = require('colors')
const inquirer = require('inquirer')
const banner = require('../util/banner')
const { isValidNumber, isValidString, checkValueRangeConstraints } = require('../util/validation')


async function inputInteger(attributeData) {
  const message = `${attributeData.key.yellow} { ${attributeData.unit ? attributeData.unit : 'parrots'.gray} } (${attributeData.type}): `
  const input = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      suffix: '?'.green,
      message,
      default: attributeData.defaultValue,
      validate: input => isValidNumber(input, attributeData.constraints),
    }
  ])
  return +input.value
}


async function inputEnumRef(attributeData) {
  const message = `Select Value For ${attributeData.key.yellow}: `
  const input = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      suffix: '?'.green,
      message,
      choices: attributeData.enumeration.enumMembers.map(item => ({ name: `${item.key} (${item.description})`, value: item.key, short: item.key })),
      default: attributeData.defaultValue,
    }
  ])
  return input.value
}


async function inputBoolean(attributeData) {
  const variants = ['true', 'false']
  if (attributeData.constraints.nullable) variants.push('null')
  const message = `Select Value For ${attributeData.key.yellow}:`
  const input = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      suffix: '?'.green,
      message,
      choices: variants,
      default: String(attributeData.defaultValue),
    }
  ])
  return {
    true: true,
    false: false,
    null: null
  }[input.value]
}


async function inputString(attributeData) {
  const message = `${attributeData.key.yellow} (${attributeData.type}): `
  const input = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      suffix: '?'.green,
      message,
      default: attributeData.defaultValue,
      validate: input => isValidString(input, attributeData.constraints),
    }
  ])
  return input.value
}


async function inputList(attributeData) {
  const message = `${attributeData.key.yellow} List Of (${attributeData.listReference.type}) Size: `
  const result = []
  const { value } = await inquirer.prompt([
    {
      type: 'number',
      name: 'value',
      suffix: '?'.green,
      message,
      default: 'null',
      validate: input => +input > 0 || input === 'null',
    }
  ])
  if (value === 'null') return null
  const checkResult = checkValueRangeConstraints(value, attributeData.constraints)
  if (checkResult) return checkResult
  if (attributeData.constraints.orderingConstraint) banner(attributeData)
  await inputListValues(attributeData, value, result)
  return result.value ? result.value : result
}


async function inputListValues(attributeData, listSize, result) {
  for (let i = 0; i < listSize; i++) {
    let input
    if (!attributeData.listReference.key) {
      attributeData.listReference.key = `${attributeData.key} [${i}]`
      input = await inputByType(attributeData.listReference)
      attributeData.listReference.key = null
    } else {
      input = await inputByType(attributeData.listReference)
    }
    if (attributeData.constraints.uniqueMembers) {
      if (result.indexOf(input.value) !== -1) {
        console.log('>>Array Values Should Be Unique'.red)
        i--
        continue
      }
    }
    result.push(input.value)
  }
}


async function inputComplexRef(attributeData) {
  const result = []
  const attributes = attributeData.complexRef.attributes.slice()
  while (attributes.length > 0) {
    const item = attributes.shift()
    const { value } = await inputByType(item)
    result.push({
      key: item.key,
      value,
      datatype: item.type
    })
  }
  return result
}


async function inputByType(typeReference) {
  const inputs = {
    INTEGER: inputInteger,
    SHORT: inputInteger,
    ENUM_REF: inputEnumRef,
    BOOLEAN: inputBoolean,
    STRING: inputString,
    MO_REF: inputString,
    LIST: inputList,
    COMPLEX_REF: inputComplexRef
  }
  if (inputs[typeReference.type]) {
    const input = await inputs[typeReference.type](typeReference)
    return { value: input } 
  }
  banner(typeReference)
}


module.exports = inputByType
