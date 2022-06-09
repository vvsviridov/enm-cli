

function eventTimeToString(eventTime) {
  if (!eventTime) return ''
  return new Date(eventTime).toISOString().slice(0, -1).split('T').join(' ')
  // return `${eventDateTime.toLocaleDateString()} ${eventDateTime.toLocaleTimeString()}`
}


module.exports = eventTimeToString