const inquirer = require('inquirer')
const colors = require('colors')

const logError = require('../util/logError')
const { isEmpty } = require('../util/validation')


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))


function buildPrompt(fdn) {
  if (fdn.length >= 67) {
    return { prefix: '...', prompt: fdn.slice(-65) }
  }
  return { prefix: '', prompt: fdn }
}


function commndUp(tplg, fdn) {
  if (tplg.up()) {
    fdn = fdn.split(',').slice(0, -1).join(',')
  } else {
    console.log('There\'s no way up!'.yellow)
  }
  return fdn
}


function commandOther(tplg, fdn, command) {
  if (tplg.setIdByCommand(command)) {
    fdn = `${fdn},${command}`
  } else if (tplg.setAttribute(command)) {
    fdn = fdn.replace(/\((\w+)\)/g, `(${command})`)
  } else {
    console.log('Command Unrecognized❗'.red)
  }
  return fdn
}


async function handleCommand(tplg, fdn, command) {
  const [cmd, param] = command.split(/\s+/)
  switch (cmd) {
    case 'exit':
      return
    case 'show':
      await tplg.show(param ? param.trim() : '')
      break
    case 'config':
      fdn = await tplg.config(fdn)
      break
    case 'set':
      await tplg.set()
      break
    case 'commit':
      fdn = await tplg.commit(fdn.replace(/\((\w+)\)/g, ''))
      break
    case 'up':
      fdn = commndUp(tplg, fdn)
      break
    case 'get':
      tplg.get(fdn)
      break
    case 'check':
      tplg.check(fdn.replace(/\((\w+)\)/g, ''))
      break
    case 'end':
      tplg.end()
      fdn = fdn.replace(/\((\w+)\)/g, '')
      break
    case 'home':
      tplg.home()
      fdn = fdn.split(',', 1)[0]
      break
    case 'description':
      tplg.description()
      break
    case 'persistent':
      tplg.persistent()
      break
    case 'fdn':
      fdn = await tplg.fdn(fdn, param ? param.trim() : '')
      break
    case 'alarms':
      await tplg.alarms(fdn)
      break
    case 'sync':
      await tplg.sync(fdn)
      break

    default:
      fdn = commandOther(tplg, fdn, command)
  }
  return fdn
}


async function inputHandlerLoop(tplg) {
  let prompt = await tplg.initialPrompt()
  let fdn = prompt
  let prefix = ''
  while (true) {
    try {
      const input = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'command',
          message: tplg.isConfig ? prompt.blue.underline : prompt.blue,
          pageSize: 10,
          prefix: prefix.gray,
          suffix: tplg.isConfig ? '#'.blue : '>'.blue,
          validate: isEmpty,
          source: async (answers, input) => await tplg.next(input),
          emptyText: prvn.help,
        }
      ])
      fdn = await handleCommand(tplg, fdn, input.command)
      if (!fdn) break
      ({ prefix, prompt } = buildPrompt(fdn))
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