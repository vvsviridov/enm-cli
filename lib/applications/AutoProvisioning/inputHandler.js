const inquirer = require('inquirer')
const chalk = require('chalk')

const logError = require('../../../util/logError')
const { isEmpty } = require('../../../util/validation')


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))


async function commandOther(prvn, command) {
  if (prvn.nodes) {
    prvn.nodeId = command
    prvn.getNode()
  } else {
    prvn.projectId = command
    await prvn.getProjectData()
  }
}


async function handleCommand(prvn, command) {
  switch (command) {

    case '_exit':
      prvn.prompt = ''
      break
    case '_new':
      await prvn.newProject()
      break
    case '_back':
      prvn.nodeIndex ? await prvn.getProjects() : await prvn.getProjectData()
      break
    case '_delete':
      prvn.nodeIndex ? await prvn.deleteNode() : await prvn.deleteProject()
      break

    case '_status':
      await prvn.getNodeStatus()
      break
    case '_properties':
      await prvn.getNodeProperties()
      break
    case '_bind':
      await prvn.bindNode()
      break
    case '_cancel':
      await prvn.cancelNode()
      break
    case '_resume':
      await prvn.resumeNode()
      break
    case '_configurations':
      await prvn.configurationsNode()
      break
    case '_siteinstall':
      await prvn.siteinstallNode()
      break

    default:
      await commandOther(prvn, command)
  }
}


async function inputHandler() {
  await this.getProjects()
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