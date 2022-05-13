const logAttributes = require('../util/logAttributes')
const inputHandler = require('./inputHandler')
const alarms = require('../commands/alarms')
const sync = require('../commands/sync')
const initialPrompt = require('../commands/initialPrompt')
const nextObjects = require('../commands/nextObjects')
const nextAttributes = require('../commands/nextAttributes')
const setIdByCommand = require('../commands/setIdByCommand')
const show = require('../commands/show')
const up = require('../commands/up')
const config = require('../commands/config')
const end = require('../commands/end')
const setAttribute = require('../commands/setAttribute')
const description = require('../commands/description')
const get = require('../commands/get')
const set = require('../commands/set')
const commit = require('../commands/commit')
const home = require('../commands/home')
const fdn = require('../commands/fdn')

const ENM = require('../ENM/ENM')

class TopologyBrowser extends ENM {
  constructor(username, password, url) {
    super(username, password, url)
    this.objectUrl = '/persistentObject/'
    this.alarmUrl = '/alarmcontroldisplayservice/alarmMonitoring/alarmoperations/'

    this.currentPoId = 0
    this.nextPoId = 1
    this.childrens = null
    this.poIds = []
    this.isConfig = false
    this.attributes = null
    this.nextVariants = null
    this.attributesData = null
    this.attribute = null
    this.networkDetails = null
    this.configSet = []
    this.includeNonPersistent = false
    this.configCommands = ['commit', 'check', 'end', 'persistent', 'exit']
    this.help = 'No results...'
  }

  async initialPrompt() {
    return await initialPrompt.call(this)
  }

  async next(input) {
    return await this.nextVariants(input)
  }

  async nextObjects(input) {
    return await nextObjects.call(this, input)
  }

  async nextAttributes(input) {
    return await nextAttributes.call(this, input)
  }

  setIdByCommand(command) {
    return setIdByCommand.call(this, command)
  }

  async show(filter) {
    await show.call(this, filter)
  }

  up() {
    return up.call(this)
  }

  async config(fdn) {
    return await config.call(this, fdn)
  }

  end() {
    end.call(this)
  }

  setAttribute(attribute) {
    return setAttribute.call(this, attribute)
  }

  description() {
    description.call(this)
  }

  get(fdn) {
    get.call(this, fdn)
  }

  async set() {
    await set.call(this)
  }

  async commit(fdn) {
    return await commit.call(this, fdn)
  }

  check(fdn) {
    logAttributes(fdn, this.configSet)
  }

  home() {
    home.call(this)
  }

  async fdn(fromFdn, targetFdn) {
    return await fdn.call(this, fromFdn, targetFdn)
  }

  persistent() {
    this.includeNonPersistent = !this.includeNonPersistent
    console.log(`Include Non Persistent Atrributes Set to: ${this.includeNonPersistent}`.yellow)
  }

  async alarms(fdn) {
    await alarms.call(this, fdn)
  }

  async sync(fdn) {
    await sync.call(this, fdn)
  }

  async inputHandler() {
    await inputHandler.call(this)
  }
}


module.exports = TopologyBrowser