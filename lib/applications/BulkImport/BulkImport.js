const chalk = require('chalk')

const ENM = require('../../components/ENM')
const {
  newJob,
  getJobs,
  pageJobs,
} = require('./jobs')
const {
  job,
  deleteJob,
  cancelImportJob,
  files,
  invocation,
  unschedule,
  unsync,
  exportJob,
  revoke,
} = require('./job')
const {
  getOperations,
  pageOperations,
  print,
} = require('./operations')
const inputHandler = require('./inputHandler')
const createNext = require('../../../util/createNext')

class BulkImport extends ENM {
  constructor(username, password, url) {
    super(username, password, url)

    this.appUrl = '/bulk-configuration/v1/import-jobs/jobs'
    this.jobs = null
    this.jobsLinks = null
    this.jobId = null
    this.username = username
    this.onlyMy = false
    this.jobsOffset = 0
    this.jobsLimit = 50
    this.operations = null
    this.operationsId = null
    this.operationsOffset = 0
    this.operationsLimit = 50
    this.operationsLinks = null
    this.failures = false
    this.errors = false
    this.prompt = ''
    this.help = 'No results...'
  }

  async getJobs() {
    await getJobs.call(this)
  }

  async pageJobs(page) {
    await pageJobs.call(this, page)
  }

  async deleteJob() {
    await deleteJob.call(this)
  }

  async exportJob() {
    await exportJob.call(this)
  }

  async revoke() {
    await revoke.call(this)
  }

  async cancelImportJob() {
    await cancelImportJob.call(this)
  }

  async files() {
    await files.call(this)
  }

  job(jobId) {
    job.call(this, jobId)
  }

  async invocation(command) {
    await invocation.call(this, command)
  }

  async unschedule() {
    await unschedule.call(this)
  }

  async unsync() {
    await unsync.call(this)
  }

  async my() {
    this.onlyMy = !this.onlyMy
    console.log(chalk.yellowBright(`Show ${this.onlyMy ? 'only my' : 'all'} jobs❗`))
    this.jobsOffset = 0
    this.jobsLimit = 50
    await this.getJobs()
  }

  async newJob() {
    await newJob.call(this)
  }

  async getOperations(failures, errors) {
    await getOperations.call(this, failures, errors)
  }

  async pageOperations(page) {
    await pageOperations.call(this, page)
  }

  print() {
    print.call(this)
  }

  async next(input) {
    return createNext.call(this, input ? input : '')
  }

  async inputHandler() {
    await inputHandler.call(this)
  }

}


module.exports = BulkImport