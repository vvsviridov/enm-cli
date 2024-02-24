const WebSocket = require('ws')
const chalk = require('chalk')
const ora = require('ora')


let spinner = ora({
  text: 'Starting connection...',
  spinner: 'speaker',
})

function socketOnOpen(socket) {
  socket.send(`{"type":"resize","cols":"${process.stdout.columns}","rows":"${process.stdout.rows}"}`)
  spinner.succeed()
}


function socketOnMessage(event) {
  process.stdout.write(event.data)
}


function socketOnClose(event, resolve, reject) {
  if (event.wasClean) {
    console.log(`\n${chalk.green('✔')} Connection closed: ${chalk.green(event.code)} ${event.reason}.`)
    resolve()
  } else {
    process.stdin.setRawMode(false)
    process.stdin.pause()
    reject(new Error(`Connection unexpectedly closed: ${event.code} ${event.reason}.`))
  }
}


function socketOnError(error, reject) {
  process.stdin.setRawMode(false)
  process.stdin.pause()
  reject(error)
}


async function webSocketSession(headers, socketUrl) {
  return new Promise((resolve, reject) => {
    spinner.start()
    const socket = new WebSocket(socketUrl, {
      headers,
      rejectUnauthorized: false,
    })
    socket.addEventListener('open', () => socketOnOpen(socket))
    socket.addEventListener('message', socketOnMessage)
    socket.addEventListener('close', (event) => socketOnClose(event, resolve, reject))
    socket.addEventListener('error', (error) => socketOnError(error, reject))

    process.stdin
      .setRawMode(true)
      .resume()
      .setEncoding('utf8')
      .on('data', (key) => {
        if (key === '\u0004') {
          socket.close()
          socket.send('\u0003')
          resolve()
        }
        socket.send(key)
      })
  })
}


module.exports = webSocketSession