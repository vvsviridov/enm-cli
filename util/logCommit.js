const chalk = require('chalk')


function logCommit(commitResult) {
  if (commitResult.title === 'Success') {
    console.log(chalk.green(commitResult.title))
  }
}

module.exports = logCommit