const chalk = require('chalk')


const timeValues = [
  'eventTime',
  'insertTime',
  'ceaseTime',
  'ackTime',
]


function logAlarm(alarmList, eventPoId) {
  const alarm = alarmList.find(item => item.eventPoIdAsLong === eventPoId)
  timeValues.forEach(value => {
    if (alarm[value]) {
      alarm[value] = new Date(alarm[value]).toLocaleString()
    }
  })
  console.log(
    JSON.stringify(alarm, null, 2)
      .replace(/["(){}\[\]]/mg, '')
      .replace(/,$/mg, '')
      .replace(/^(\s{2}\w+):/mg, chalk.green('$1:'))
  )
}


module.exports = logAlarm