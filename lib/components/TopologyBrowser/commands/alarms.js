const colors = require('colors')
const inquirer = require('inquirer')

const requestWrapper = require('../../util/requestWrapper')
const logAlarm = require('../../util/logAlarm')
const eventTimeToString = require('../../util/eventTimeToString')

const closeAlarms = { name: 'Close Alarms'.yellow, value: -1}


function logTotal(total) {
  if (total === 0) {
    console.log(`Total Alarms: ${total}`.green)
    return
  }
  console.log(`Total Alarms: ${total}`.yellow)
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
  const response = await requestWrapper(axiosConfig, 'Getting Alarms...')
  if (!Array.isArray(response.data)) return
  const [total, eventPoIds] = parsePoIdResponse(response)
  logTotal(total)
  if (eventPoIds) return eventPoIds.toString()
}


async function getFields(url, eventPoIds) {
  const axiosConfig = {
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
  const response = await requestWrapper(axiosConfig, 'Getting Alarms Data...')
  return response.data
}


async function alarmChoices(alarmList, input) {
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
        source: async (answers, input) => await alarmChoices(alarmList, input)
      }
    ])
    if (input.alarm === closeAlarms.value) break
    logAlarm(alarmList, input.alarm)
  }
}


async function alarms(fdn) {
  const meContextFind = fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (!meContextFind) {
    console.log('No alarming object in FDN!'.yellow)
    return
  }
  const eventPoIds = await getPoIds(`${this.alarmUrl}eventpoids`, meContextFind[2])
  if (!eventPoIds) return
  const alarmList = await getFields(`${this.alarmUrl}getalarmlist/fields`, eventPoIds)
  await alarmsLoop(alarmList)
}


module.exports = alarms