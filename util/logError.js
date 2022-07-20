const chalk = require('chalk')

function logError(err) {
  // console.dir(err)
  try {
    if (!err.response) {
      const {
        name = 'Error',
        message = 'No error message',
        stack = null,
      } = err
      console.log(`
        ⛔ ${chalk.bold.bgRed(name)}
        ${chalk.yellow(message)}${chalk.dim(stack && process.env.NODE_ENV === 'development' ? '\n' + stack : '')}
      `)
      return
    }
    if (err.response.data) {
      const { data } = err.response
      //  other http error
      let errorTitle = `${err.response.status}: ${err.response.statusText}`
      let errorBody = data.code
      let errorDetails = data.message
      if (typeof data !== 'object') {
        errorBody = data
      }
      if (data.userMessage) {
        errorBody = `${data.errorCode}: ${data.userMessage.title}`
        errorDetails = data.userMessage.body
      }
      // prvn error
      if (data.errorTitle) {
        errorTitle = data.errorTitle
        errorBody = data.errorBody
        errorDetails = data.errorDetails
      }
      // tplg error
      if (data.title) {
        errorTitle = `${data.errorCode}: ${data.title}`
        errorBody = data.body
        errorDetails = data.detail
      }
      //bulk error
      if (data.errors) {
        errorBody = `Total Errors Count: ${data.totalCount}`
        errorDetails = data.errors.map(err => {
          return `
          ${err.type}: ${err.code}
          ${err.message}
          ${err.parameters && typeof err.parameters === 'object'
              ? JSON.stringify(err.parameters)
              : err.parameters ?? ''}
          `
        })
      }
      console.log(`
        ⚠️ ${chalk.bold.bgRed(errorTitle)}
        ${chalk.yellow(errorBody)}${errorDetails ? '\n' + errorDetails.toString() : ''}
      `)
    }
  } catch (error) {
    console.log(error)
  }
}


module.exports = logError
