#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const inquirer = require('inquirer')

require('dotenv').config()

const AutoProvisioning = require('../lib/components/AutoProvisioning/AutoProvisioning')
const TopologyBrowser = require('../lib/components/TopologyBrowser/TopologyBrowser')

const inputHandler = require('../lib/components/AutoProvisioning/inputHandler')
const logError = require('../util/logError')

program
	.version(pkg.version)
	.option('-l, --login <letters>', 'ENM User Login')
	.option('-p, --password <letters>', 'ENM User Password')
	.option('-a, --application <letters>', 'Start specified application')
	.requiredOption('-u, --url <letters>', 'ENM Url')
	.parse(process.argv)


const options = program.opts()

const applications = ['tplg', 'prvn']


async function promptUsername() {
	if (process.env.LOGIN) return process.env.LOGIN
	const input = await inquirer.prompt([
		{
			type: 'input',
			name: 'value',
			suffix: chalk.bgGreen('?'),
			message: 'Type ENM login',
			// validate: input => isValidNumber(input, attributeData.constraints),
		}
	])
	return input.value
}


async function promptPassword() {
	if (process.env.PASSWORD) return process.env.PASSWORD
	const input = await inquirer.prompt([
		{
			type: 'password',
			name: 'value',
			message: `Type ${options.login}'s ENM password`,
			// validate: input => isValidNumber(input, attributeData.constraints),
		}
	])
	return input.value
}


async function selectApplication() {
	let selectedApp
	if (options.application && options.application in applications) {
		selectedApp = options.application
	} else {
		const input = await inquirer.prompt([
			{
				type: 'list',
				name: 'application',
				suffix: '💾',
				message,
				choices: applications
			}])
		selectedApp = input.application
	}
	return {
		tplg: TopologyBrowser,
		prvn: AutoProvisioning
	}[selectedApp]
}

async function main() {
	try {
		const app = new selectApplication()(options.login || await promptUsername(), options.password || await promptPassword(), options.url)
		const result = await app.login()
		const { code } = result
		if (code === 'SUCCESS') {
			await app.inputHandler()
			await app.logout()
		}
	} catch (error) {
		logError(error)
	}
}

; (async () => await main())()
