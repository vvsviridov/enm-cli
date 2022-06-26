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
  // const [, cmd] = command.match(/\[(\w+)\]/) || [, command]
  switch (command) {

    case 'exit':
      prvn.prompt = ''
      break
    case 'new':
      await prvn.newProject()
      break
    case 'back':
      prvn.nodeIndex ? await prvn.getProjects() : await prvn.getProjectData()
      break
    case 'delete':
      prvn.nodeIndex ? await prvn.deleteNode() : await prvn.deleteProject()
      break

    case 'status':
      await prvn.getNodeStatus()
      break
    case 'properties':
      await prvn.getNodeProperties()
      break
    case 'bind':
      await prvn.bindNode()
      break
    case 'cancel':
      await prvn.cancelNode()
      break
    case 'resume':
      await prvn.resumeNode()
      break
    case 'configurations':
      await prvn.configurationsNode()
      break
    case 'siteinstall':
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