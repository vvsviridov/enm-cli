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
    case '_exit':
      bulk.prompt = ''
      break
    case '_next':
    case '_last':
    case '_first':
    case '_prev':
      bulk.operations ? await bulk.pageOperations(command) : await bulk.pageJobs(command)
      break
    case '_operations':
    case '_failures':
      await bulk.getOperations(command === '_failures')
      break
    case '_my':
      await bulk.my()
      break
    case '_new':
      await bulk.newJob()
      break
    case '_back':
      bulk.operations ? await bulk.job(bulk.jobId) : await bulk.getJobs()
      break
    case '_delete':
      await bulk.deleteJob()
      break
    case '_cancel':
      await bulk.cancelImportJob()
      break
    case '_files':
      await bulk.files()
      break
    case '_print':
      await bulk.print()
      break
    case '_validate':
    case '_execute':
      await bulk.invocation(command)
      break
    case '_unschedule':
      await bulk.unschedule()
      break
    case '_unsync':
      await bulk.unsync()
      break
    case '_export':
      await bulk.exportJob()
      break
    case '_revoke':
      await bulk.revoke()
      break

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