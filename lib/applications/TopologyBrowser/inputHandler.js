const inquirer = require('inquirer')
const chalk = require('chalk')

const logError = require('../../../util/logError')
const { isEmpty } = require('../../../util/validation')


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))


function commandOther(tplg, command) {
  const spl = command.split(/\s+/).find(item => item)
  if (tplg.setIdByCommand(spl)) {
    tplg.fdn = `${tplg.fdn},${spl}`
  } else if (tplg.setAttribute(command)) {
    tplg.fdn = tplg.fdn.replace(/\((\w+)\)/g, `(${command})`)
  } else {
    throw new Error('Command Unrecognized❗')
  }
}


async function handleCommand(tplg, command) {
  const [cmd, param] = command.split(/\s+/)
  const cmdMatch = cmd.match(/\[(\w+)\]/)
  const cmdName = cmdMatch ? cmdMatch[1] : cmd
  switch (cmdName) {
    case 'exit':
      tplg.fdn = ''
      break
    case 'show':
      await tplg.show(param ? param.trim() : '')
      break
    case 'config':
      await tplg.config()
      break
    case 'set':
      await tplg.set()
      break
    case 'commit':
      await tplg.commit()
      break
    case 'up':
      tplg.up()
      break
    case 'get':
      tplg.get()
      break
    case 'check':
      tplg.check()
      break
    case 'end':
      tplg.end()
      break
    case 'home':
      tplg.home()
      break
    case 'search':
      await tplg.search()
      break
    case 'description':
      tplg.description()
      break
    case 'persistent':
      tplg.persistent()
      break
    case 'fdn':
      await tplg.goToFdn(param ? param.trim() : '')
      break
    case 'alarms':
      await tplg.alarms()
      break
    case 'sync':
      await tplg.sync()
      break

    default:
      commandOther(tplg, command)
  }
}


async function inputHandler() {
  await this.initialPrompt()
  while (true) {
    try {
      const input = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'command',
          message: chalk.blue(this.getPrompt()),
          pageSize: 10,
          prefix: '',
          suffix: this.isConfig ? chalk.blue('#') : chalk.blue('>'),
          validate: isEmpty,
          source: async (answers, input) => await this.next(input),
          emptyText: this.help,
        }
      ])
      await handleCommand(this, input.command)
      if (!this.fdn) break
    } catch (error) {
      logError(error)
    }
  }
}


module.exports = inputHandler