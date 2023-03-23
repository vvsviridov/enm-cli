const inquirer = require('inquirer')
const chalk = require('chalk')
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')
const fs = require('fs')
const fsPromises = require('fs').promises
const FormData = require('form-data')
const path = require('path')

const { logJob } = require('../../../util/logJob')

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)
inquirer.registerPrompt("date", require("inquirer-date-prompt"))

const jobCommands = [
  'validate', 'execute', 'unschedule', 'operations',
  'failures', 'errors', 'export', 'revoke', 'files', 'unsync',
  'delete', 'back', 'exit'
]
const jobCommandsHelp = [
  '[validate] - Starts job validation.',
  '[execute] - Starts job execution.',
  '[unschedule] - Cancels job scheduling.',
  '[operations] - Lists job operation',
  '[failures] - Lists job failures',
  '[errors] - Lists job errors',
  '[export] - Exports operations to CSV file.',
  '[revoke] - Creates XML file for undoing job.',
  '[files] - Add file to job.',
  '[unsync] - Shows unsynchronized nodes count.',
  '[delete] - Deletes import job.',
  '[back] - Return to jobs.',
  '[exit] - Exit this app.',
]


function job(jobId) {
  const job = this.jobs.find(job => job.id === jobId)
  if (!job) {
    throw new Error('Job not Found❗')
  }
  this.jobId = jobId
  this.operations = null
  logJob(job)
  this.commands = [...jobCommands]
  this.help = jobCommandsHelp.join('\n  ')
  this.choices = []
  this.prompt = job.name
}


async function deleteJob() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Still want to delete❓',
      default: true,
    },
  ])
  if (!confirm) return
  const axiosConfig = {
    text: `Deleting job ${this.jobId}...`,
    method: 'delete',
    url: this.appUrl,
    params: {
      jobId: this.jobId,
    }
  }
  const { data } = await this.httpClient.request(axiosConfig)
  data.errors.forEach(err => {
    console.log(`${err.type === 'INFO' ? chalk.green(err.message) : chalk.red(err.code + ': ' + err.message)}`)
  })
  await this.getJobs()
}


async function cancelImportJob() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const axiosConfig = {
    text: `Cancelling job ${this.jobId}...`,
    method: 'put',
    url: `${this.appUrl}/${this.jobId}`,
    params: {
      status: "cancelling",
    }
  }
  const { data } = await this.httpClient.request(axiosConfig)
  console.log(`${chalk.green(data.status)}`)
}


async function files() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const fileNameInput = await inquirer.prompt([{
    type: 'file-tree-selection',
    name: 'importFile',
    message: 'Choose an import file...',
    enableGoUpperDirector: true,
  }])
  const formData = new FormData()
  formData.append('file', fs.createReadStream(fileNameInput.importFile))
  formData.append('filename', path.basename(fileNameInput.importFile))
  const axiosConfig = {
    text: `Importing file for job ${this.jobId}...`,
    method: 'post',
    url: `${this.appUrl}/${this.jobId}/files`,
    headers: formData.getHeaders(),
    data: formData,
  }
  const { data } = await this.httpClient.request(axiosConfig)
  console.log(`
  ${chalk.dim.italic(data.format)} ${data.name}
  `)
}


async function invocation(command) {
  const flow = command.replace(/_/, '')
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const job = this.jobs.find(job => job.id === this.jobId)
  const axiosConfig = {
    text: `Starting to ${flow} job ${this.jobId}...`,
    method: 'post',
    url: `${this.appUrl}/${this.jobId}/invocations`,
    data: {
      invocationFlow: flow,
      validationPolicy: job.validationPolicy,
      executionPolicy: job.executionPolicy,

    }
  }
  if (flow === 'execute') {
    const { scheduleTime } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Schedule job execution❓',
        default: false,
      },
      {
        type: 'date',
        name: 'scheduleTime',
        message: 'Schedule job execution:',
        prefix: '⏰',
        clearable: true,
        when: input => input.confirm
      },
    ])
    if (scheduleTime) {
      axiosConfig.data.scheduleTime = scheduleTime
    }
  }
  const { data } = await this.httpClient.request(axiosConfig)
  console.log(chalk.green(`${data.id}: ${data.invocationFlow}`))
}


async function unschedule() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Still want to unschedule job❓',
      default: true,
    },
  ])
  if (!confirm) return
  const axiosConfig = {
    text: `Unschedule job ${this.jobId}...`,
    method: 'delete',
    url: `${this.appUrl}/${this.jobId}/invocations/${this.jobId}`,
  }
  const response = await this.httpClient.request(axiosConfig)
  console.log(`Unschedule job ${this.jobId}: ${chalk.green(response.status)}`)
}


async function unsync() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const axiosConfig = {
    text: `Counting unsync nodes for job ${this.jobId}...`,
    method: 'get',
    url: `${this.appUrl}/${this.jobId}/unsyncNodesCount`,
  }
  const { data: { unsyncNodesCount } } = await this.httpClient.request(axiosConfig)
  console.log(`Number of unsync nodes: ${chalk.yellowBright(unsyncNodesCount)}`)
}


async function exportJob() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const axiosConfig = {
    text: `Exporting job ${this.jobId} to CSV...`,
    method: 'post',
    url: `${this.appUrl}/${this.jobId}/export`,
  }
  const { data: { jobExportId } } = await this.httpClient.request(axiosConfig)
  const statusConfig = {
    text: `Check export job ${jobExportId} status...`,
    method: 'get',
    url: `${this.appUrl}/${this.jobId}/export/${jobExportId}`,
  }
  const httpClient = this.httpClient
  const url = `${this.appUrl}/${this.jobId}/export/${jobExportId}/download`
  let timerId = setTimeout(async function request() {
    const { data: { status } } = await httpClient.request(statusConfig)
    if (status === 'COMPLETED') {
      clearTimeout(timerId)
      await downloadTextFile(url, httpClient)
      return
    }
    timerId = setTimeout(request, 5000)
  }, 5000)
}


async function downloadTextFile(url, httpClient) {
  const dwnldConfig = {
    text: `Downloading...`,
    method: 'get',
    url,
  }
  const response = await httpClient.request(dwnldConfig)
  const filename = response.headers["content-disposition"].match(/filename="?([\w\-.]+)"?/)[1]
  const filepath = path.resolve(process.cwd(), filename)
  await fsPromises.writeFile(filepath, response.data)
  console.log(chalk.greenBright('Saved: ') + filepath)
}


async function revoke() {
  if (!this.jobId) {
    throw new Error('Job Is not Selected❗')
  }
  const axiosConfig = {
    text: `Undoing job ${this.jobId}...`,
    method: 'post',
    url: '/configuration/jobs',
    data: {
      fileFormat: '3GPP',
      id: this.jobId,
      type: 'UNDO_IMPORT_TO_LIVE',
    }
  }
  const { data } = await this.httpClient.request(axiosConfig)
  console.log(`${data.type.replace(/_/g, ' ')} ${data.status}`
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
  )
  const statusConfig = {
    text: `Check undoing ${data.id} status...`,
    method: 'get',
    url: `/configuration/jobs/${data.id}?type=UNDO_IMPORT_TO_LIVE`,
  }
  const httpClient = this.httpClient
  let timerId = setTimeout(async function request() {
    const { data: { status, fileUri } } = await httpClient.request(statusConfig)
    if (status === 'COMPLETED') {
      clearTimeout(timerId)
      await downloadTextFile(fileUri, httpClient)
      return
    }
    timerId = setTimeout(request, 5000)
  }, 5000)
}


module.exports = {
  job,
  deleteJob,
  cancelImportJob,
  files,
  invocation,
  unschedule,
  unsync,
  exportJob,
  revoke,
}