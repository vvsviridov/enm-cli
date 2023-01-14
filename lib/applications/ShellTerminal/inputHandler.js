const inquirer = require('inquirer')
const { amos, scripting, wfcli } = require('./terminals')


async function inputHandler() {
  const input = await inquirer.prompt([{
    type: 'list',
    name: 'vm',
    prefix: '💻',
    message: 'Select Terminal:',
    choices: [
      {
        name: 'Shell Terminal on Scripting',
        value: 'scripting',
        short: 'scripting',
      },
      {
        name: 'Shell Terminal on AMOS',
        value: 'amos',
        short: 'amos',
      },
      {
        name: 'WinFIOL CLI',
        value: 'wfcli',
        short: 'wfcli',
      },
    ]
  }])

  switch (input.vm) {
    case 'amos':
      await amos.call(this)
      break
    case 'scripting':
      await scripting.call(this)
      break
    case 'wfcli':
      await wfcli.call(this)
      break
  }
  if (process.stdin.isRaw) {
    process.stdin.setRawMode(false)
  }
  process.stdin.pause()
}


module.exports = inputHandler