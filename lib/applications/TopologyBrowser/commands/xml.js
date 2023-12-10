const fsPromises = require('fs').promises
const path = require('path')
const chalk = require('chalk')


function reduceArrayToObject(value) {
  if (Array.isArray(value)) {
    return value.reduce((prev, curr) => {
      if (Array.isArray(curr.value)) {
        prev[curr.key] = curr.value.every(item => item.key) ?
          reduceArrayToObject(curr.value) :
          curr.value.map(item => {
            return reduceArrayToObject(item)
          })
      } else {
        prev[curr.key] = curr.value
      }
      return prev
    }, {})
  } else {
    return value
  }
}


async function xml() {
  const operations = this.configSet.map(({ fdn, attributes }) => ({
    fdn,
    changeType: 'UPDATE',
    attributes: reduceArrayToObject(attributes),
  }))
  const axiosConfig = {
    text: 'Generating XML...',
    method: 'post',
    url: '/parametermanagement/v1/importFile',
    data: {
      fileType: 'THREE_GPP',
      importFileName: 'bulk_import',
      operations
    }
  }
  const { data } = await this.httpClient.request(axiosConfig)
  const saveFileName = path.join(process.cwd(), `bulk_import_${this.currentPoId}.xml`)
  await fsPromises.writeFile(saveFileName, data)
  console.log(chalk.bgGreen(`Saved bulk import file to ${saveFileName}`))
}


module.exports = xml