const axios = require('axios')
const https = require('https')
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')
const logError = require('../../util/logError')
const SpinnerWithCounter = require('./SpinnerWithCounter')


axiosCookieJarSupport(axios)

let spinner = new SpinnerWithCounter()


function beforeRequest(config) {
  const {text = 'Executing request...', ...newConfig} = config
  spinner.start(text)
  return newConfig
}


function errorRequest(error) {
  spinner.fail()
  if (error.response && 401 === error.response.status) {
    logError(error)
    process.exit(1)
  }
  return Promise.reject(error)
}


function beforeResponse(response) {
  spinner.succeed()
  return response
}


function axiosHttpClient(url) {
  const axiosClient = axios.create({
    baseURL: url,
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    withCredentials: true,
    jar: new tough.CookieJar(),
  })
  axiosClient.interceptors.request.use(beforeRequest, errorRequest)
  axiosClient.interceptors.response.use(beforeResponse, errorRequest)
  return axiosClient
}


module.exports = axiosHttpClient