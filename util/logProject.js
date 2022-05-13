const chalk = require('chalk')


function logProject(data, nodeSummary) {
  if (!data || !nodeSummary) {
    throw new Error('No project data or node summary!')
  }
  const {
    id: projectId,
    description,
    creator,
    creationDate,
    nodes,
  } = data
  console.log(`
    ${chalk.italic.yellowBright('Project id')}    : ${chalk.bold.inverse(projectId)}
    ${chalk.italic.yellowBright('Author')}        : ${chalk.underline(creator)}
    ${chalk.italic.yellowBright('Creation Date')} : ${chalk.dim.gray(creationDate)}
    ${chalk.italic.yellowBright('Description')}   : ${description}
    ${chalk.italic.yellowBright('Nodes')}         : 
  `)
  nodes.forEach(node => {
    const { id: nodeId, type, identifier, ipAddress } = node
    const { status, state } = nodeSummary.find(item => item.id === nodeId)
    console.log(`      ${chalk.cyan(nodeId)}
      ${type}
      ${identifier}
      ${ipAddress}
      ${status === 'Successful' ? chalk.greenBright(status) : chalk.redBright(status) }
      ${state}
    `)
  })
}


module.exports = logProject