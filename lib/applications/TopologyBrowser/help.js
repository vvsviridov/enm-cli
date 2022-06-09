const mainHelp = [
  '',
  'show [<valid regex>] - shows current object\'s attributes filtered with regex',
  'config - enters config mode',
  'up - navigate up one level',
  'fdn [<valid FDN>] - navigate to FDN',
  'home - navigate to root folder',
  'alarms - show alarms',
  'sync - initiate node CM synchronization',
  'persistent - toggle persistent attributes inclusion',
  'exit - logout and exit application',
].join('\n')

const configHelp = [
  '',
  'set - set attribute\'s value',
  'get - get attribute\'s value',
  'commit - commiting changes to the network',
  'check - view configuration changes',
  'end - exit config mode without commiting',
  'exit - logout and exit application',
].join('\n')


module.exports = { mainHelp,  configHelp }