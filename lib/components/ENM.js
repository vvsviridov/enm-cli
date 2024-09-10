const axiosHttpClient = require('./AxiosHttpClient')
const webSocketSession = require('./webSocketSession')

class ENM {
  constructor(username, password, url) {
    this.logoutUrl = '/logout'
    this.loginUrl = '/login'
    this.commands = []
    this.choices = []
    this.httpClient = axiosHttpClient(url)
    this.url = url
    this.username = username
    this.password = password
  }

  async login() {
    const axiosConfig = {
      text: 'Login in...',
      method: 'post',
      url: this.loginUrl,
      data: `IDToken1=${encodeURIComponent(this.username)}&IDToken2=${encodeURIComponent(this.password)}`,
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

  async webSocketSession(headers, pathname, urlSearch) {
    const socketUrl = new URL(this.url)
    socketUrl.protocol = 'wss:'
    socketUrl.pathname = `${pathname}/${this.username}`
    Object.entries(urlSearch).forEach(([name, value]) => socketUrl.searchParams.append(name, value))
    await webSocketSession(headers, socketUrl)
  }
}


module.exports = ENM