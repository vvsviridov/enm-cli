

async function scripting() {
  const axiosConfig = {
    text: 'Launching Scripting Shell...',
    method: 'get',
    url: this.amosUrl,
  }
  const response = await this.httpClient.request(axiosConfig)
  await this.webSocketSession(response.config.headers, '/scripting-terminal-ws/command', { command: 'scripting' })
}


module.exports = scripting