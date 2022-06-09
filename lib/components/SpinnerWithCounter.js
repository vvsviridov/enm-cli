const ora = require('ora')

class SpinnerWithCounter {
  constructor() {
    this.spinner = null
    this.counter = 0
  }

  start(text) {
    if (!this.spinner) {
      this.spinner = ora(text)
      this.spinner.start()
    }
    this.counter = ++this.counter
  }

  succeed() {
    this.counter = --this.counter
    if (this.spinner && this.counter === 0) {
      this.spinner.succeed()
      this.spinner = null
    }
  }

  fail() {
    this.counter = --this.counter
    if (this.spinner && this.counter === 0) {
      this.spinner.fail()
      this.spinner = null
    }
  }
}


module.exports = SpinnerWithCounter