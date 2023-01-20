#!/usr/bin/env node

const { Command, Option } = require('commander')
const pkg = require('../package.json')
const inquirer = require('inquirer')
const path = require('path')

const { isEmpty } = require('../util/validation')

require('dotenv').config({ path: [...__dirname.split(path.sep).slice(0, -1), '.env'].join(path.sep) })

const AutoProvisioning = require('../lib/applications/AutoProvisioning/AutoProvisioning')
const TopologyBrowser = require('../lib/applications/TopologyBrowser/TopologyBrowser')
const BulkImport = require('../lib/applications/BulkImport/BulkImport')
const ShellTerminal = require('../lib/applications/ShellTerminal/ShellTerminal')

const logError = require('../util/logError')

if (process.env.NODE_ENV === 'development') {
	process.on('uncaughtException', (exception) => console.log(exception))
}

const applications = [
	{
		id: 'tplg',
		appClass: TopologyBrowser,
		name: 'Topology Browser',
	},
	{
		id: 'prvn',
		appClass: AutoProvisioning,
		name: 'Auto Provisioning',
	},
	{
		id: 'bulk',
		appClass: BulkImport,
		name: 'Bulk Import',
	},
	{
		id: 'shll',
		appClass: ShellTerminal,
		name: 'Shell Terminal',
	},
]
const appIds = applications.map(item => item.id)

const program = new Command()
program
	.version(pkg.version)
	.addOption(new Option('-l, --login <letters>', 'ENM User Login').env('LOGIN'))
	.addOption(new Option('-p, --password <letters>', 'ENM User Password').env('PASSWORD'))
	.addOption(new Option('-a, --application <letters>', 'Start specified application')
		.choices(appIds)
	)
	.requiredOption('-u, --url <valid URL>', 'ENM Url')
	.parse(process.argv)


const options = program.opts()


async function promptUsername() {
	const input = await inquirer.prompt([
		{
			type: 'input',
			name: 'value',
			prefix: '👤',
			message: 'Type ENM login:',
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
			prefix: '🔑',
			message: 'Type ENM password:',
			validate: isEmpty,
		}
	])
	return input.value
}


async function selectApplication() {
	let selectedApp
	if (options.application && appIds.includes(options.application)) {
		selectedApp = options.application
	} else {
		const input = await inquirer.prompt([
			{
				type: 'list',
				name: 'application',
				prefix: '💾',
				message: 'Select Application:',
				choices: applications.map(item => ({ name: item.name, value: item.id, short: item.id }))
			}])
		selectedApp = input.application
	}
	const { appClass } = applications.find(item => item.id === selectedApp)
	const login = options.login || await promptUsername()
	const password = options.password || await promptPassword()
	return new appClass(login, password, options.url)
}

async function main() {
	try {
		const app = await selectApplication()
		await app.login()
		await app.inputHandler()
		await app.logout()
	} catch (error) {
		logError(error)
	}
}

main()
