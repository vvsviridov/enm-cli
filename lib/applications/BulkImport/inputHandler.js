const inquirer = require('inquirer')
const chalk = require('chalk')

const logError = require('../../../util/logError')
const { logOperation } = require('../../../util/logOperation')
const { isEmpty } = require('../../../util/validation')


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))


async function commandOther(bulk, command) {
  if (bulk.operations) {
    const operation = bulk.operations.find(i => i.id === command)
    logOperation(operation)
  }
  if (!bulk.jobId) {
    bulk.job(command)
  }
}


async function handleCommand(bulk, command) {
  switch (command) {
    case 'exit':
      bulk.prompt = ''
      break
    case 'next':
    case 'last':
    case 'first':
    case 'prev':
      await bulk.pageJobs(command)
      break
    case 'operations':
    case 'failures':
      await bulk.getOperations()
      break
    case 'my':
      await bulk.my()
      break
    case 'new':
      await bulk.newJob()
      break
    case 'back':
      bulk.operations ? await bulk.job() : await bulk.getJobs()
      break
    case 'delete':
      await bulk.deleteJob()
      break

    // case 'status':
    //   await bulk.getNodeStatus()
    //   break
    // case 'properties':
    //   await bulk.getNodeProperties()
    //   break
    // case 'bind':
    //   await bulk.bindNode()
    //   break
    // case 'cancel':
    //   await bulk.cancelNode()
    //   break
    // case 'resume':
    //   await bulk.resumeNode()
    //   break
    // case 'configurations':
    //   await bulk.configurationsNode()
    //   break
    // case 'siteinstall':
    //   await bulk.siteinstallNode()
    //   break

    default:
      await commandOther(bulk, command)
  }
}


async function inputHandler() {
  await this.getJobs()
  while (true) {
    try {
      const input = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'command',
          message: chalk.bold.blue(this.prompt),
          pageSize: 10,
          prefix: '',
          suffix: chalk.bold.blue('>'),
          validate: isEmpty,
          source: async (answers, input) => await this.next(input),
          emptyText: this.help,
        }
      ])
      await handleCommand(this, input.command)
      if (!this.prompt) break
    } catch (error) {
      logError(error)
    }
  }
}


module.exports = inputHandler