const chalk = require('chalk')


function statusPic(status) {
  switch (status) {
    case 'CREATED':
      return '📄'
    case 'PARSING':
      return '📂'
    case 'PARSED':
      return '📁'
    case 'VALIDATING':
      return '🎛'
    case 'VALIDATED':
      return '📊'
    case 'EXECUTING':
      return '⏳'
    case 'EXECUTED':
      return '✅'
    case 'CANCELLING':
      return '❌'
    case 'CANCELLED':
      return '⛔️'

    default:
      return '❓'
  }
}


function statusColor(status) {
  switch (status) {
    case 'EXECUTED':
      return chalk.green(status)
    case 'CANCELLED':
      return chalk.red(status)

    default:
      return chalk.yellow(status)
  }
}


function validationPolicy(job) {
  return [
    `${job.validationPolicy.includes('instance-validation') ? '✅' : '❌'} Instance Validation`,
    `${job.validationPolicy.includes('node-based-validation') ? '✅' : '❌'} Node Based Validation`,
  ]
}


function executionPolicy(job) {
  return [
    `${job.executionPolicy.includes('stop-on-error') ? '✅' : '❌'} Stop`,
    `${job.executionPolicy.includes('continue-on-error-node') ? '✅' : '❌'} Skip to Next Node`,
    `${job.executionPolicy.includes('continue-on-error-operation') ? '✅' : '❌'} Skip to Next Operation`,
    `${job.executionPolicy.includes('parallel') ? '✅ Parallel' : '✅ Sequential'}`,
    `${job.executionPolicy.includes('skip-unsync-nodes') ? '✅' : '❌'} Skip Unsync Nodes`,
  ]
}


function timeAttributes(job) {
  Object.entries(job)
    .forEach(([key, value]) => {
      if (['created', 'lastValidation', 'lastExecution'].includes(key)) {
        const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
        const formattingSpaces = ' '.repeat(18 - title.length)
        console.log(`  ${chalk.yellowBright.bold(title + ':')}${formattingSpaces} ${new Date(value).toLocaleString()}`)
      }
    })
}


function optionalAttributes(job) {
  if (job.failureReason) {
    console.log(`  ${chalk.yellowBright.bold('Failure Reason:    ')} ${chalk.red(job.failureReason)}`)
  }
  if (job.files && job.files.find(i => i).name) {
    console.log(`  ${chalk.yellowBright.bold('Files:             ')}
    ${job.files.map(f => `${chalk.dim.italic(f.format)} ${f.name}`).join('\n    ')}`)
  }
  if (job.summary) {
    console.table(job.summary, ['parsed', 'valid', 'invalid', 'executed', 'executionErrors'])
  }
}


function logJob(job) {
  if (!job) {
    throw new Error('No job data❗')
  }
  console.log(`
  ${chalk.yellowBright.bold('Job ID:            ')} ${chalk.dim(job.id)}
  ${chalk.yellowBright.bold('Job Name:          ')} ${job.name}
  ${chalk.yellowBright.bold('User:              ')} ${chalk.cyanBright.underline(job.userId)}
  ${chalk.yellowBright.bold('Configuration:     ')} ${chalk.greenBright(job.configuration)}
  ${chalk.yellowBright.bold('Status:            ')} ${statusColor(job.status)} ${statusPic(job.status)}
  ${chalk.yellowBright.bold('Time Total:        ')} ${new Date(job.totalElapsedTime * 1000).toISOString().slice(11, -5)}`)
  timeAttributes(job)
  console.log(`  ${chalk.yellowBright.bold('Validation Options:')}
    ${chalk.gray(validationPolicy(job).join('\n    '))}
  ${chalk.yellowBright.bold('Execution Options:')}
    ${chalk.gray(executionPolicy(job).join('\n    '))}`)
  optionalAttributes(job)
  console.log('')
}


module.exports = {
  logJob,
  statusPic,
}