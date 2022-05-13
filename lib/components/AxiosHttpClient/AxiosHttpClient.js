const axios = require('axios')
const chalk = require('chalk')
const https = require('https')
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')
const SpinnerWithCounter = require('../../../util/SpinnerWithCounter')


axiosCookieJarSupport(axios)

let spinner = new SpinnerWithCounter()


function beforeRequest(config) {
  const {text = 'Executing request...', ...newConfig} = config
  spinner.start(text)
  return newConfig
}


function errorRequest(error) {
  spinner.fail()
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