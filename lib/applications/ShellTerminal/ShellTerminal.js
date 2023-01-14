const ENM = require('../../components/ENM')

const inputHandler = require('./inputHandler')


class ShellTerminal extends ENM {
  constructor(username, password, url) {
    super(username, password, url)
      this.fdn = ''
  }

  async inputHandler() {
    await inputHandler.call(this)
  }

}


module.exports = ShellTerminal