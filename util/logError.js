const chalk = require('chalk')

function logError(err) {
  if (err.response && err.response.data && err.response.data.errorTitle) {
    const {
      errorTitle = 'Error',
      errorBody = 'No error body',
      errorDetails = null
    } = err.response.data
    console.log(`
      ⚠️ ${chalk.bold.bgRed(errorTitle)}
      ${chalk.yellow(errorBody || '')}${errorDetails ? '\n' + errorDetails.toString() : ''}
    `)
  } else {
    const {
      name = 'Error',
      message = 'No error message',
      stack = null,
    } = err
    console.log(`
      ⛔ ${chalk.bold.bgRed(name)}
      ${chalk.yellow(message)}
      ${chalk.dim(stack && process.env.NODE_ENV === 'development' ? stack : '')}
    `)
  }
}


module.exports = logError
