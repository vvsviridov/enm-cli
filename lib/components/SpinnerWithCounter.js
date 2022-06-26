const ora = require('ora')
const { isXMas } = require('../../util/validation')

const defaultSpinner = process.env.SPINNER || 'clock'


class SpinnerWithCounter {
  constructor() {
    this.spinner = null
    this.counter = 0
  }

  start(text) {
    if (!this.spinner) {
      this.spinner = ora(text)
      this.spinner.spinner = isXMas() ? 'christmas' : defaultSpinner
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