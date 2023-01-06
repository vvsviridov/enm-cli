const WebSocket = require('ws')
const chalk = require('chalk')


function socketOnOpen(socket) {
  console.log('📡 Connection started...')
  socket.send(`{"type":"resize","cols":"${process.stdout.columns}","rows":"${process.stdout.rows}"}`)
}


function socketOnMessage(event) {
  process.stdout.write(event.data)
}


function socketOnClose(event, resolve, reject) {
  if (event.wasClean) {
    console.log(`\n${chalk.green('✔')} Connection closed: ${event.code} ${event.reason}.`)
    resolve()
  } else {
    reject(`Connection unexpectedly closed: ${event.code} ${event.reason}.`)
  }
}


function socketOnError(error, reject) {
  reject(error)
}


async function webSocketSession(headers, socketUrl) {
  return new Promise((resolve, reject) => {
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
        if (key === '\u0003') {
          socket.send('exit')
          resolve()
        }
        socket.send(key)
      })
  })
}


module.exports = webSocketSession