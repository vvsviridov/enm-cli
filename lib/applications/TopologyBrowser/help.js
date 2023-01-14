const mainHelp = [
  '',
  'show [<valid regex>] - shows current object\'s attributes filtered with regex',
  'config - enters config mode',
  'up - navigate up one level',
  'fdn [<valid FDN>] - navigate to FDN',
  'home - navigate to root folder',
  'alarms - show alarms',
  'sync - initiate node CM synchronization',
  'search - searching for specified nodes',
  'persistent - toggle persistent attributes inclusion',
  'amos - launching Advanced MO Shell Scripting (amos)',
  'scripting - open shell terminal towards scripting VM',
  'wfcli - launching WinFIOL CLI app',
  'nodecli - launching node CLI app',
  'exit - logout and exit application',
].join('\n')

const configHelp = [
  '',
  'set - set attribute\'s value',
  'get - get attribute\'s value',
  'commit - commiting changes to the network',
  'description - show attribute\'s description',
  'check - view configuration changes',
  'end - exit config mode without commiting',
  'exit - logout and exit application',
].join('\n')


module.exports = { mainHelp, configHelp }