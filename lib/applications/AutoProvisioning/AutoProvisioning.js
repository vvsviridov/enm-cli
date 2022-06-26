const ENM = require('../../components/ENM')

const { getProjects, getProjectData, deleteProject, newProject } = require('./projects')
const {
  getNode,
  getNodeStatus,
  getNodeProperties,
  bindNode,
  cancelNode,
  resumeNode,
  configurationsNode,
  siteinstallNode
} = require('./nodes')
const inputHandler = require('./inputHandler')
const createNext = require('../../../util/createNext')

class AutoProvisioning extends ENM {
  constructor(username, password, url) {
    super(username, password, url)

    this.appUrl = '/auto-provisioning/v1'
    this.projects = null
    this.projectId = null
    // this.projectIndex = -1
    this.nodes = null
    // this.nodeIndex = -1
    this.nodeId = null
    this.prompt = ''
    this.help = 'No results...'
  }

  async getProjects() {
    return await getProjects.call(this)
  }

  async getProjectData() {
    return await getProjectData.call(this)
  }

  async newProject() {
    await newProject.call(this)
  }

  async deleteProject() {
    await deleteProject.call(this)
  }

  async deleteNode() {
    // await deleteNode.call(this)
  }

  async getNode() {
    return await getNode.call(this)
  }

  async getNodeStatus() {
    await getNodeStatus.call(this)
  }

  async getNodeProperties() {
    await getNodeProperties.call(this)
  }

  async bindNode() {
    await bindNode.call(this)
  }

  async cancelNode() {
    await cancelNode.call(this)
  }

  async resumeNode() {
    await resumeNode.call(this)
  }

  async configurationsNode() {
    await configurationsNode.call(this)
  }

  async siteinstallNode() {
    await siteinstallNode.call(this)
  }

  async next(input) {
    return createNext.call(this, input ? input : '')
  }

  async inputHandler() {
    await inputHandler.call(this)
  }

}


module.exports = AutoProvisioning