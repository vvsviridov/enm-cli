const chalk = require('chalk')
const inquirer = require('inquirer')

const { statusPic } = require('../../../util/logJob')
const tableChoices = require('../../../util/tableChoices')
const { isEmpty } = require('../../../util/validation')

const jobsCommands = ['new', 'my', 'exit']
const jobsCommandsHelp = [
  '[new] - Creates a new import job.',
  '[my] - Toggle to show only user\'s jobs.',
  '[exit] - Exit this app.',
  'Or choose a job from list...',
]


async function newJob() {
  const {
    name,
    validationPolicy,
    executionPolicy,
    unsynchNodes,
    executionOrder
  } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Type a job\'s name:',
      validate: isEmpty,
    },
    {
      type: 'checkbox',
      name: 'validationPolicy',
      message: 'Validation Policy:',
      choices: [
        {
          name: 'Skip MO Instance Validation',
          value: 'no-instance-validation',
        },
        {
          name: 'Skip Node Based Validation',
          value: 'no-node-based-validation',
          checked: true,
        },
      ],
    },
    {
      type: 'list',
      name: 'executionPolicy',
      message: 'Execution Error Handling:',
      choices: [
        {
          name: 'Stop',
          value: 'stop-on-error',
        },
        {
          name: 'Skip to next node',
          value: 'continue-on-error-node',
        },
        {
          name: 'Skip to next operation',
          value: 'continue-on-error-operation',
        },
      ],
      default: 'stop-on-error',
    },
    {
      type: 'list',
      name: 'unsynchNodes',
      message: 'Unsynchronized Nodes Policy:',
      choices: [
        {
          name: 'Import skips operation execution on unsynchronized nodes. Recommended for faster performance.',
          value: 'skip-unsync-nodes',
        },
        {
          name: 'Import will be agnostic towards node synchronization state, implying import attempts operation execution on unsychronized nodes as well.',
          value: 'exec-unsync-nodes',
        },
      ],
      default: 'skip-unsync-nodes',
    },
    {
      type: 'list',
      name: 'executionOrder',
      message: 'Execution Order:',
      choices: [
        {
          name: 'Sequential',
          value: 'sequential',
        },
        {
          name: 'Parallel',
          value: 'parallel',
        },
      ],
      default: 'parallel',
      when: input => !input.executionPolicy.includes('stop-on-error')
    },
  ])
  const axiosConfig = {
    text: 'Creating job...',
    method: 'post',
    url: this.appUrl,
    data: {
      name,
      validationPolicy: validationPolicy.length
        ? validationPolicy
        : ['instance-validation', 'node-based-validation'],
      executionPolicy: [
        executionPolicy,
        unsynchNodes,
        executionOrder ?? 'sequential',
      ]
    },
  }
  const { data } = await this.httpClient.request(axiosConfig)
  this.jobs.unshift(data)
  this.job(data.id)
}


async function getJobs() {
  const params = new URLSearchParams()
  params.append('offset', this.jobsOffset)
  params.append('limit', this.jobsLimit)
  params.append('expand', 'summary')
  params.append('expand', 'files')
  if (this.onlyMy) {
    params.append('createdBy', this.username)
  }
  const axiosConfig = {
    text: 'Getting jobs...',
    method: 'get',
    url: this.appUrl,
    params,
  }
  const { data } = await this.httpClient.request(axiosConfig)
  this.jobs = data.jobs
  this.jobId = null
  this.jobsLinks = data._links
  const tableData = this.jobs.map(({ userId, status, name, summary }) => {
    const nameValue = []
    nameValue.push(`${statusPic(status)} ${name}`)
    nameValue.push(chalk.dim(userId))
    nameValue.push(chalk.dim.italic(status))
    if (summary) {
      const { executed, executionErrors, invalid, parsed, valid } = summary.total
      nameValue.push(chalk.dim(`🍳${parsed}`))
      nameValue.push(chalk.dim(`☑${valid}`))
      nameValue.push(chalk.dim(`⚠${invalid}`))
      nameValue.push(chalk.dim(`✅${executed}`))
      nameValue.push(chalk.dim(`❌${executionErrors}`))
    }
    return nameValue
  })
  this.choices = tableChoices(tableData).map((row, i) => ({
    name: row,
    value: this.jobs[i].id,
    short: this.jobs[i].id,
  }))
  this.commands = [...jobsCommands]
  Object.values(this.jobsLinks).forEach(item => item.rel !== 'self' && this.commands.push(item.rel))
  this.help = jobsCommandsHelp.join('\n  ')
  this.prompt = `${data.totalCount} jobs (${this.jobsOffset}-${Math.min(this.jobsOffset + this.jobsLimit, data.totalCount)})`
}


function setJobsPagination(href) {
  const url = new URL(href)
  const searchParams = new URLSearchParams(url.search)
  this.jobsLimit = +searchParams.get('limit')
  this.jobsOffset = +searchParams.get('offset')
}


async function pageJobs(command) {
  const page = command.replace(/_/, '')
  if (!this.jobsLinks[page]) {
    throw new Error(`No ${page} jobs❗`)
  }
  setJobsPagination.call(this, this.jobsLinks[page].href)
  await this.getJobs()
}


module.exports = {
  newJob,
  getJobs,
  pageJobs,
}