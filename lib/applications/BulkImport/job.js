const inquirer = require('inquirer')
const chalk = require('chalk')
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')
const fs = require('fs')
const FormData = require('form-data')

const { logJob } = require('../../../util/logJob')

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)


const jobCommands = ['operations', 'failures', 'delete', 'back', 'exit']
const jobCommandsHelp = [
  '[delete] - Deletes import job.',
  '[back] - Return to jobs.',
  '[exit] - Exit this app.',
  'Or choose a node from list...',
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
    throw new Error('Job Is not selected❗')
  }
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Still want to delete❓',
      default: true,
    },
  ])
  if (!confirm)  return
  const axiosConfig = {
    text: `Deleting job ${this.jobId} ...`,
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


module.exports = {
  job,
  deleteJob,
}