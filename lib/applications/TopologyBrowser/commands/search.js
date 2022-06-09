const chalk = require('chalk')
const inquirer = require('inquirer')
const { isValidNodeName } = require('../../../../util/validation')


async function getNodeTypes() {
  const axiosConfig = {
    text: 'Getting Node Types...',
    method: 'get',
    url: this.nodeTypesUrl,
  }
  const response = await this.httpClient.request(axiosConfig)
  return response.data
}


async function getPoIds(query) {
  const axiosConfig = {
    text: 'Searching Nodes...',
    method: 'get',
    url: this.nodeSearchUrl,
    headers: {
      'X-Netex-Scoping-Panel': true,
    },
    params: {
      query,
      orderby: 'moName',
      orderdirection: 'asc',
    }
  }
  const { data: { objects } } = await this.httpClient.request(axiosConfig)
  return objects.map(item => item.id)
}


async function getNodesData(poList) {
  const axiosConfig = {
    text: 'Getting Nodes Data...',
    method: 'post',
    url: this.nodePoIdsUrl,
    data: {
      poList,
      defaultMappings: ["syncStatus","managementState","radioAccessTechnology","parentNeType"],
      attributeMappings:[{"moType":"MeContext","attributeNames":["neType"]}]
    }
  }
  const response = await this.httpClient.request(axiosConfig)
  return response.data
}


function resultOutput(result) {
  console.log('')
  result.forEach(item => {
    const {
      fdn,
      attributes,
      cmSyncStatus,
      radioAccessTechnology,
    } = item
    console.log(`${cmSyncStatus === 'SYNCHRONIZED' ? '✅' : '⏳'} ${fdn} ${chalk.dim.grey(attributes.neType)} ${chalk.bold.cyan(radioAccessTechnology.join(' '))}`)
  })
  console.log('')
}


function filterTypes(input, nodeTypes){
  const filter = input ? input : ''
  return nodeTypes.filter(
    item => item
      .toLowerCase()
      .includes(filter.toLowerCase())
  )
}


function buildQuery(nodeName, nodeType, rat) {
  const ratFilter = rat.length !== 0
    ? ` filter by radioAccessTechnology ${rat.length === 1 ? 'containing ' : 'contains any of '}${rat.join(',')}`
    : ''
  const typeFilter = nodeType === 'ALL'
    ? `with name = ${nodeName}`
    : `of type ${nodeType} where name = ${nodeName}`
  return `select all nodes ${nodeName && typeFilter}${ratFilter}`
}


async function search() {
  const nodeTypes = await getNodeTypes.call(this)
  nodeTypes.push('ALL')
  const { nodeName, nodeType, rat } = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'nodeType',
      message: 'Select Node Type (default ALL):',
      pageSize: 10,
      default: 'ALL',
      source: async (answers, input) => filterTypes(input, nodeTypes)
    },
    {
      type: 'checkbox',
      name: 'rat',
      message: 'Select Radio Access Technologies (default all):',
      choices: [
        {name: '2G'},
        {name: '3G'},
        {name: '4G'},
        {name: '5G'},
      ]
    },
    {
      type: 'input',
      name: 'nodeName',
      message: 'Type a Node Name:',
      validate: isValidNodeName
    }
  ])
  const poList = await getPoIds.call(this, buildQuery(nodeName, nodeType, rat))
  if (poList.length === 0) {
    throw new Error('Nodes not found❗')
  }
  const result = await getNodesData.call(this, poList)
  resultOutput(result)
}


module.exports = search