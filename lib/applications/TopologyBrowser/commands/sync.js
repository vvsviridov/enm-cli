const chalk = require("chalk")


async function sync() {
  const meContextFind = this.fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (!meContextFind) {
    throw new Error('No sync object in FDN!')
  }
  const actionUrl = `${this.objectUrl}v1/perform-mo-action/NetworkElement=${meContextFind[2]},CmFunction=1?actionName=sync`
  const axiosConfig = {
    text: 'Initiate Node Sync...',
    method: 'post',
    url: actionUrl,
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const response = await this.httpClient.request(axiosConfig)
  console.log(`
    ${chalk.bold(response.data.body)}
    ${chalk.green(response.data.title)}
  `)
}
  
  
module.exports = sync