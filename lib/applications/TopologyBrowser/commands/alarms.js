const chalk = require('chalk')
const inquirer = require('inquirer')

const logAlarm = require('../../../../util/logAlarm')
const eventTimeToString = require('../../../../util/eventTimeToString')

const closeAlarms = { name: chalk.yellow('Close Alarms'), value: -1}


function logTotal(total) {
  if (total === 0) {
    console.log(chalk.green(`Total Alarms: ${total}`))
    return
  }
  console.log(chalk.yellow(`Total Alarms: ${total}`))
}


function parsePoIdResponse(response) {
  let total
  let eventPoIds
  response.data.forEach(item => {
    if (item.eventPoIds) {
      eventPoIds = item.eventPoIds
      return
    }
    if (typeof item.total === 'number') {
      total = item.total
      return
    }
  })
  return [total, eventPoIds]
}


async function getPoIds(url, nodes) {
  const axiosConfig = {
    text: 'Getting Alarms...',
    method: 'post',
    url,
    data: {
      filters: '',
      category: 'All',
      nodes,
      recordLimit: 5000,
      tableSettings: 'fdn#true#false,alarmingObject#true#false,presentSeverity#true#false,eventTime#true#false,insertTime#true#false,specificProblem#true#false',
      timestamp: + new Date(),
      sortCriteria: [
        {
          attribute: 'insertTime',
          mode: 'desc'
        }
      ],
      advFilters: ''
    }
  }
  const response = await this.httpClient.request(axiosConfig)
  if (!Array.isArray(response.data)) return
  const [total, eventPoIds] = parsePoIdResponse(response)
  logTotal(total)
  if (eventPoIds) return eventPoIds.toString()
}


async function getFields(url, eventPoIds) {
  const axiosConfig = {
    text: 'Getting Alarms Data...',
    method: 'post',
    url,
    data: {
      eventPoIds,
      tableSettings: '',
      timestamp: + new Date(),
      filters: '',
      category: 'All'
    }
  }
  const response = await this.httpClient.request(axiosConfig)
  return response.data
}


function alarmChoices(alarmList, input) {
  const filter = input ? input : ''
  return alarmList
    .map(al => {
      const { eventPoIdAsLong, alarmingObject, presentSeverity, eventTime, specificProblem } = al
      return {
        name: `${presentSeverity}\t${eventTimeToString(eventTime)}\t${alarmingObject}\t${specificProblem}`,
        value: eventPoIdAsLong
      }
    })
    .filter(al => al.name.toLowerCase().includes(filter.toLowerCase()))
    .concat(closeAlarms)
}


async function alarmsLoop(alarmList) {
  while (true) {
    const input = await inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'alarm',
        message: 'Select Alarm:',
        pageSize: 10,
        source: async (answers, input) => alarmChoices(alarmList, input)
      }
    ])
    if (input.alarm === closeAlarms.value) break
    logAlarm(alarmList, input.alarm)
  }
}


async function alarms() {
  const meContextFind = this.fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (!meContextFind) {
    throw new Error('No alarming object in FDN!')
  }
  const eventPoIds = await getPoIds.call(this, `${this.alarmUrl}eventpoids`, meContextFind[2])
  if (!eventPoIds) return
  const alarmList = await getFields.call(this, `${this.alarmUrl}getalarmlist/fields`, eventPoIds)
  await alarmsLoop(alarmList)
}


module.exports = alarms