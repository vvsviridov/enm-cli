const chalk = require('chalk')


function logNodeStatus(statusEntries, indent = 4) {
  if (!statusEntries) {
    throw new Error('No node status entries!')
  }
  console.log('')
  statusEntries.forEach(entry => {
    const { task, progress, timestamp, additionalInfo } = entry
    console.log(`${' '.repeat(indent)}${chalk.cyan(task)} ${progress} at ${chalk.italic.gray(timestamp)}`)
    if (additionalInfo) {
      additionalInfo.trim().split('\n').forEach(info => {
        console.log(`${' '.repeat(indent + 2) + chalk.dim(info)}`)
      })
    }
  })
  console.log('')
}


function logNodeProperties(attributes, attributeGroups, indent = 4) {
  if (!attributeGroups) {
    throw new Error('No node attribute groups!')
  }
  console.log('')
  logAttributes(attributes)
  console.log('')
  attributeGroups.forEach(attributeGroup => {
    const { type, properties } = attributeGroup
    console.log(`${' '.repeat(indent)}${chalk.bold.yellow(type + '↓')}`)
    logAttributes(properties, indent + 2)
    console.log('')
  })
}


function logAttributes(attributes, indent = 4) {
  if (!attributes) {
    throw new Error('No node attributes!')
  }
  attributes.forEach(attribute => {
    const { name, value } = attribute
    console.log(`${' '.repeat(indent)}${name ? chalk.bold.cyan(name + ': ') : ''}${value}`)
  })
}


module.exports = { logNodeStatus, logNodeProperties }