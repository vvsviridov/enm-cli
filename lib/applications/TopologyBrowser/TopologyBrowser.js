const logAttributes = require('../../../util/logAttributes')
const inputHandler = require('./inputHandler')
const alarms = require('./commands/alarms')
const sync = require('./commands/sync')
const initialPrompt = require('./commands/initialPrompt')
const nextObjects = require('./commands/nextObjects')
const nextAttributes = require('./commands/nextAttributes')
const setIdByCommand = require('./commands/setIdByCommand')
const show = require('./commands/show')
const up = require('./commands/up')
const config = require('./commands/config')
const end = require('./commands/end')
const setAttribute = require('./commands/setAttribute')
const description = require('./commands/description')
const get = require('./commands/get')
const set = require('./commands/set')
const commit = require('./commands/commit')
const home = require('./commands/home')
const search = require('./commands/search')
const goToFdn = require('./commands/goToFdn')
const createNext = require('../../../util/createNext')
const { mainHelp, configHelp } = require('./help')

const ENM = require('../../components/ENM')
const chalk = require('chalk')

class TopologyBrowser extends ENM {
  constructor(username, password, url) {
    super(username, password, url)
    this.objectUrl = '/persistentObject/'
    this.alarmUrl = '/alarmcontroldisplayservice/alarmMonitoring/alarmoperations/'
    this.nodeTypesUrl = '/modelInfo/model/nodeTypes/'
    this.nodeSearchUrl = '/managedObjects/search/v2'
    this.nodePoIdsUrl = '/managedObjects/getPosByPoIds'

    this.currentPoId = 0
    this.nextPoId = 1
    this.fdn = ''
    this.childrens = null
    this.poIds = []
    this.isConfig = false
    this.attributes = []
    this.nextVariants = null
    this.attributesData = []
    this.attribute = null
    this.networkDetails = null
    this.configSet = []
    this.includeNonPersistent = false
    this.configCommands = ['commit', 'check', 'end', 'exit']
    this.help = mainHelp
  }

  async initialPrompt() {
    await initialPrompt.call(this)
  }

  async next(input) {
    await this.nextVariants(input)
    return createNext.call(this, input ? input : '')
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
    this.help = configHelp
    return await config.call(this, fdn)
  }

  end() {
    this.help = mainHelp
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

  check() {
    logAttributes(this.fdn, this.configSet)
  }

  home() {
    home.call(this)
  }

  async search() {
    await search.call(this)
  }

  async goToFdn(fromFdn, targetFdn) {
    return await goToFdn.call(this, fromFdn, targetFdn)
  }

  persistent() {
    this.includeNonPersistent = !this.includeNonPersistent
    console.log(chalk.yellow(`Include Non Persistent Atrributes Set to: ${this.includeNonPersistent}`))
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

  getPrompt() {
    if (this.fdn.length >= 67) {
      return `...${this.fdn.slice(-65)}`
    }
    return this.fdn
  }
}


module.exports = TopologyBrowser