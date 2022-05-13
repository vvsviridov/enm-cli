const colors = require('colors')

const requestWrapper = require('../../util/requestWrapper')


async function sync(fdn) {
  const meContextFind = fdn.match(/(NetworkElement|MeContext)=([\w-]+),?/)
  if (!meContextFind) {
    console.log('No sync object in FDN!'.yellow)
    return
  }
  const actionUrl = `${this.objectUrl}v1/perform-mo-action/NetworkElement=${meContextFind[2]},CmFunction=1?actionName=sync`
  const axiosConfig = {
    method: 'post',
    url: actionUrl,
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const response = await requestWrapper(axiosConfig, 'Initiate Node Sync...')
  if (response.status === 200) {
    console.log(`
    ${response.data.body.bold}
    ${response.data.title.green}
    `)
  }
}
  
  
module.exports = sync