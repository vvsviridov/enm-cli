const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const FormData = require('form-data')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { logNodeStatus, logNodeProperties } = require('../../../util/logNode')
const { isValidHardwareId } = require('../../../util/validation')

const nodeCommands = [
  'status',         'properties',  'delete', 
  'bind',           'cancel',      'resume',
  'configurations', 'siteinstall', 'back',
  'exit'
]

const nodeCommandsHelp = [
  '[status] - Retrieving Auto Provisioning node status returns the node status information for each task that has been executed for the specified node.',
  '[properties] - Retrieving Auto Provisioning node properties returns the node properties for each task that has been executed for the specified node.',
  '[delete] - Delete an Auto Provisioning node removes the Auto Provisioning data for a Network Element. If a node is the last node in a project and there are no profiles associated with the project the project will automatically be deleted.', 
  '[bind] - Binding a hardware serial number to a node configuration associates the specified node configurations with a hardware serial number for Zero Touch Integration or Hardware Replace.',
  '[cancel] - Cancelling the auto provisioning activity rolls back an AutoProvisoning workflow for Node Integration. For expansion a node is rolled back to it\'s original configuration if additional configurations have been applied to the node.',
  '[resume] - Resuming the auto provisioning activity recommences an Auto Provisioning workflow that is suspended.',
  '[configurations] - Uploading an auto provisioning configuration replaces a configuration file that was part of the initial Auto Provisioning node configuration.',
  '[siteinstall] - Download Site Installation File (SIF) that is required to be taken on site for LMT Integration or LMT Hardware Replace.',
  '[back] - Return to project\'s nodes.',
  '[exit] - Exit this app.',
]


async function getNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  this.commands = nodeCommands
  this.help = nodeCommandsHelp.join('\n  ')
  this.choices = [] // this.nodes.filter(item => item !== nodeId)
  return `${projectId} (${nodeId}) `
}


async function getNodeStatus() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Getting ${nodeId}'s status...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}`
  }
  const {  data: { statusEntries } } = await this.httpClient.request(axiosConfig)
  logNodeStatus(statusEntries)
}


async function getNodeProperties() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Getting ${nodeId}'s properties...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}?filter=properties`
  }
  const { data: { attributes, attributeGroups } } = await this.httpClient.request(axiosConfig)
  logNodeProperties(attributes, attributeGroups)
}


async function bindNode() {
  const hardwareId = await inquirer.prompt([
		{
		  type: 'input',
		  name: 'value',
		  suffix: chalk.bgGreen('?'),
		  message: 'Type hardwareId',
		  validate: input => isValidHardwareId(input),
		}
	])
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Binding ${hardwareId} to ${nodeId}...`,
    method: 'put',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/actions/bind`,
    data: {
      hardwareId,
    },
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Binding ${statusText}`))
}


async function cancelNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Canceling ${nodeId}...`,
    method: 'post',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/actions/cancel`,
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Canceling ${statusText}`))
}


async function resumeNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Resuming ${nodeId}...`,
    method: 'post',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/actions/resume`,
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Resuming ${statusText}`))
}


async function configurationsNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const fileNameInput = await inquirer.prompt([{
    type: 'file-tree-selection',
    name: 'nodeFile',
    message: 'Choose a node file...',
  }])
  const formData = new FormData()
  formData.append('file', fs.createReadStream(fileNameInput.nodeFile))
  const axiosConfig = {
    text: `Uploading ${nodeId} configuration to ${projectId}...`,
    method: 'put',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/configurations`,
    headers: formData.getHeaders(),
    data: formData
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Resuming ${statusText}`))
}


async function siteinstallNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const saveFileName = path.join(process.cwd(), `Site_Install_${nodeId}.xml`)
  const axiosConfig = {
    text: `Downloading site install file ${nodeId}...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/configurations/siteinstall`,
  }
  const { data } = await this.httpClient.request(axiosConfig)
  await fsPromises.writeFile(saveFileName, data)
  console.log(chalk.bgGreen(`Download site install file to ${saveFileName}`))
}


module.exports = {
  getNode,
  getNodeStatus,
  getNodeProperties,
  bindNode,
  cancelNode,
  resumeNode,
  configurationsNode,
  siteinstallNode
}