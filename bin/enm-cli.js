#!/usr/bin/env node

const { Command, Option } = require('commander')
const pkg = require('../package.json')
const inquirer = require('inquirer')
const { isEmpty } = require('../util/validation')

require('dotenv').config()

const AutoProvisioning = require('../lib/components/AutoProvisioning/AutoProvisioning')
const TopologyBrowser = require('../lib/components/TopologyBrowser/TopologyBrowser')

const logError = require('../util/logError')

const applications = ['tplg', 'prvn']

const program = new Command()
program
	.version(pkg.version)
	// .option('-l, --login <letters>', 'ENM User Login')
	// .option('-p, --password <letters>', 'ENM User Password')
	.addOption(new Option('-l, --login <letters>', 'ENM User Login').env('LOGIN'))
	.addOption(new Option('-p, --password <letters>', 'ENM User Password').env('PASSWORD'))
	.addOption(new Option('-a, --application <letters>', 'Start specified application')
		.choices(applications)
		.default('tplg')
	)
	.requiredOption('-u, --url <letters>', 'ENM Url')
	.parse(process.argv)


const options = program.opts()



async function promptUsername() {
	const input = await inquirer.prompt([
		{
			type: 'input',
			name: 'value',
			suffix: chalk.bgGreen('?'),
			message: 'Type ENM login',
			validate: isEmpty,
		}
	])
	return input.value
}


async function promptPassword() {
	const input = await inquirer.prompt([
		{
			type: 'password',
			name: 'value',
			message: `Type ${options.login}'s ENM password`,
			validate: isEmpty,
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
