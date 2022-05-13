const inquirer = require('inquirer')
const chalk = require('chalk')

const logError = require('../../../util/logError')
const { isEmpty } = require('../../../util/validation')


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))


async function commandOther(prvn, prompt, command) {
  const choosedIndex = prvn.choices.indexOf(command)
  if (choosedIndex !== -1) {
    if (prvn.nodes) {
      prvn.nodeIndex = choosedIndex
      prompt = prvn.getNode()
    } else {
      prvn.projectIndex = choosedIndex
      prompt = await prvn.getProjectData()
    }
  }
  return prompt
}


async function handleCommand(prvn, prompt, command) {
  const [, cmd] = command.match(/\[(\w+)\]/) || [, command]
  switch (cmd) {

    case 'exit':
      return
    case 'new':
      await prvn.newProject()
      break
    case 'back':
      prompt = prvn.nodeIndex ? await prvn.getProjects() : await prvn.getProjectData()
      break
    case 'delete':
      prvn.nodeIndex ? prvn.deleteNode() : await prvn.deleteProject()
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
      prompt = await commandOther(prvn, prompt, command)
  }
  return prompt
}


async function inputHandlerLoop(prvn) {
  let prompt = await prvn.getProjects()
  let prefix = ''
  while (true) {
    try {
      const input = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'command',
          message: chalk.bold.blue(prompt),
          pageSize: 10,
          prefix: chalk.bold.grey(prefix),
          suffix: chalk.bold.blue('>'),
          validate: isEmpty,
          source: async (answers, input) => await prvn.next(input),
          emptyText: prvn.help,
        }
      ])
      prompt = await handleCommand(prvn, prompt, input.command)
      if (!prompt) break
    } catch (error) {
      logError(error)
    }
  }
}


async function inputHandler() {
  try {
    await inputHandlerLoop(this)
  } catch (error) {
    logError(error)
  }
}


module.exports = inputHandler