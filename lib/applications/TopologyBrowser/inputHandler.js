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
  const [cmd, param = ''] = command.split(/\s+/)
  switch (cmd) {
    case '_exit':
      tplg.fdn = ''
      break
    case '_show':
      await tplg.show(param)
      break
    case '_config':
      await tplg.config()
      break
    case '_set':
      await tplg.set()
      break
    case '_commit':
      await tplg.commit()
      break
    case '_up':
      tplg.up()
      break
    case '_get':
      tplg.get()
      break
    case '_check':
      tplg.check()
      break
    case '_end':
      tplg.end()
      break
    case '_abort':
      tplg.abort()
      break
    case '_xml':
      await tplg.xml()
      break
    case '_home':
      await tplg.home()
      break
    case '_search':
      await tplg.search()
      break
    case '_description':
      tplg.description()
      break
    case '_persistent':
      tplg.persistent()
      break
    case '_fdn':
      await tplg.goToFdn(param)
      break
    case '_alarms':
      await tplg.alarms()
      break
    case '_sync':
      await tplg.sync()
      break
    case '_amos':
      await tplg.amos()
      break
    case '_scripting':
      await tplg.scripting()
      break
    case '_wfcli':
      await tplg.wfcli()
      break
    case '_nodecli':
      await tplg.nodecli()
      break
    case '_enmdata':
      await tplg.enmdata()
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
          suffix: chalk.blue(this.isConfig ? '#' : '>'),
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