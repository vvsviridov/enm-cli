const chalk = require('chalk')
const axiosHttpClient = require('../AxiosHttpClient/AxiosHttpClient')

class ENM {
  constructor(username, password, url) {
    this.logoutUrl = '/logout'
    this.loginUrl =  `/login?IDToken1=${username}&IDToken2=${password}`
    this.httpClient = axiosHttpClient(url)
  }

  async login() {
    const axiosConfig = {
      text: 'Login in...',
      method: 'post',
      url: this.loginUrl
    }
    const response = await this.httpClient.request(axiosConfig)
    return response.data
  }

  async logout() {
    const axiosConfig = {
      text: 'Logout...',
      method: 'get',
      url: this.logoutUrl
    }
    await this.httpClient.request(axiosConfig)
  }
}


module.exports = ENM