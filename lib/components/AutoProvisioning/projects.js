const inquirer = require('inquirer')
const chalk = require('chalk')
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')
const fs = require('fs')
const FormData = require('form-data')

const logProject = require('../../../util/logProject')

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

const projectsCommands = ['new', 'exit']
const projectsCommandsHelp = [
  '[new] - Import an Auto Provisioning project to start Auto Provisioning workflows based on the content of the AutoProvisioning project. The Auto Provisioning project file contains project related data in the projectInfo.xml file and node folders which contain configurations required to execute AutoProvisioning use-cases.',
  '[exit] - Exit this app.',
  'Or choose a project from list...',
]
const projectCommands = ['delete', 'back', 'exit']
const projectCommandsHelp = [
  '[delete] - Delete of an Auto Provisioning project removes an Auto Provisioning project and all the Auto Provisioning data for nodes within that project. This includes removal or rollback of any ongoing Auto Provisioning workflows within that project.',
  '[back] - Return to projects.',
  '[exit] - Exit this app.',
  'Or choose a node from list...',
]

async function getProjects() {
  const axiosConfig = {
    text: 'Getting projects...',
    method: 'get',
    url: `${this.appUrl}/projects`
  }
  const response = await this.httpClient.request(axiosConfig)
  this.projects = response.data
  this.choices = projectsChoices(this.projects)
  this.commands = projectsCommands
  this.help = projectsCommandsHelp.join('\n  ')
  this.nodes = null
  return `${this.projects.length} projects`
}


async function getProjectData() {
  const { projectId } = this.projects[this.projectIndex]
  const axiosConfig = {
    text: `Getting ${projectId}'s status...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}`
  }
  const { data: { nodeSummary } } = await this.httpClient.request(axiosConfig)
  axiosConfig.text = `Getting ${projectId}'s properties...`
  axiosConfig.url +=  '?filter=properties'
  const { data } = await this.httpClient.request(axiosConfig)
  logProject(data, nodeSummary)
  this.nodes = nodeSummary.map(node => node.id)
  this.choices = this.nodes
  this.commands = projectCommands
  this.help = projectCommandsHelp.join('\n  ')
  this.nodeIndex = -1
  return projectId
}


async function newProject() {
  const fileNameInput = await inquirer.prompt([{
    type: 'file-tree-selection',
    name: 'projectFile',
    message: 'Choose a project file...',
  }])
  const formData = new FormData()
  formData.append('file', fs.createReadStream(fileNameInput.projectFile))
  const axiosConfig = {
    text: `Creating project...`,
    method: 'post',
    url: `${this.appUrl}/projects`,
    headers: formData.getHeaders(),
    data: formData
  }
  const { data: { id } } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Project ${id} created!`))
  await this.getProjectData(id)
}


async function deleteProject() {
  const { projectId } = this.projects[this.projectIndex]
  const axiosConfig = {
    text: `Deleting project ${projectId}...`,
    method: 'delete',
    url: `${this.appUrl}/projects/${projectId}`
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Delete ${statusText}`))
  this.choices = projectsChoices(this.projects)
}


function projectsChoices(projects) {
  return projects.map(project => {
    const {
      projectId,
      numberOfNodes,
      integrationPhaseSummary: {
        cancelled,
        failed,
        inProgress,
        successful,
        suspended,
      },
    } = project
    const statusList = [
      successful && successful + '✅',
      inProgress && inProgress + '⌛',
      suspended && suspended + '⌚',
      cancelled && cancelled + '❌',
      failed && failed + '⛔',
    ]
    const space = ' '.repeat(Math.max(14, projectId.length + 2) - projectId.length)
    return `${chalk.bold(projectId)}${space}(${numberOfNodes}) ${statusList.filter(item => item).join(' ')}`
  })
}


module.exports = { getProjects, getProjectData, deleteProject, newProject }
