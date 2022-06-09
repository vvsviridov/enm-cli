# Cli application based on ENM AutoProvisioning API

[![Github version](https://img.shields.io/github/package-json/version/vvsviridov/prvn-cli?label=prvn-cli&color=brightgreen&logo=github)](https://github.com/vvsviridov/prvn-cli)
[![Npm version](https://img.shields.io/npm/v/prvn-cli?color=red&logo=npm&label=prvn-cli)](https://www.npmjs.com/package/prvn-cli)

## Main goal

A simple CLI interface for AutoProvisioning API.

## Installation

First you need **node.js** which can be downloaded from official site [nodejs.org](https://nodejs.org/en/download/) and installed as described in the docs.

Then you can run directly from NPM without installation

```
npx prvn-cli -l USERNAME -p PASSWORD -u https://enm.your.company.domain.com
```

Or install with NPM

```
npm i prvn-cli
```

Or download this repository and run from the project root directory ...

```
npm install
```

... to install dependencies,

```
npm link
```

... to add application to your OS $PATH variable if you want to run it from anywhere.
Now you can launch apllication

```
prvn-cli -l USERNAME -p PASSWORD -u https://enm.your.company.domain.com
```

## Usage

Recommended environment is Windows Terminal (not _cmd.exe_) or any shell with rich formatting support. After application successfully launched youll see root content and available commands.

### Help Page
```
> prvn-cli --help
Usage: prvn-cli [options]

Options:
  -V, --version             output the version number
  -l, --login <letters>     ENM User Login
  -p, --password <letters>  ENM User Password
  -u, --url <letters>       ENM Url
  -h, --help                display help for command
```
### Connection
```
>prvn-cli -l USERNAME -p PASSWORD -u https://enm.your.company.domain.com
✔ Login in...
✔ Getting projects...
323 projects> (Use arrow keys or type to search)
  ──────────────
> [new]
  [exit]
  ──────────────
  Project1      (1) 1✅
  Project2      (2) 1✅ 1⌛
  Project3      (2) 1❌ 1⌚
  Project4      (1) 1❌
```

### Working with Projects

- `[new]` - Import an Auto Provisioning project to start Auto Provisioning workflows based on the content of the AutoProvisioning project. The Auto Provisioning project file contains project related data in the projectInfo.xml file and node folders which contain configurations required to execute AutoProvisioning use-cases.
- `[exit]` - Exit this app.

Start typing and you see only commands and projects matches input.

```
323 projects> pro
──────────────
──────────────
> Project1      (1) 1✅
  Project2      (2) 1✅ 1⌛
  Project3      (2) 1❌ 1⌚
  Project4      (1) 1❌
SubNetwork=ONRM_ROOT_MO> ex
──────────────
>[exit]
──────────────
```

### Working with Single Project

Select project you want to work with.

Available commands are:

- `[delete]` - Delete of an Auto Provisioning project removes an Auto Provisioning project and all the Auto Provisioning data for nodes within that project. This includes removal or rollback of any ongoing Auto Provisioning workflows within that project.
- `[back]` - Return to projects.
- `[exit]` - Exit this app.

```
323 projects> Project1      (1) 1✅
✔ Getting Project1s status...
✔ Getting Project1s properties...

    Project id    : Project1
    Author        : Ericsson
    Creation Date : 2019-01-06 11:23:39
    Description   : Project1 description
    Nodes         :

      RadioNode1
      RadioNode
      3432-762-238
      192.168.192.168
      Successful
      Integration Completed

Project1> (Use arrow keys or type to search)
  ──────────────
> [delete]
  [back]
  [exit]
  ──────────────
  RadioNode1
```

### Wotking with Node

Select node ...

```
Project1 (RadioNode1) > (Use arrow keys or type to search)
  ──────────────
> [status]
  [properties]
  [delete]
  [bind]
  [cancel]
  [resume]
  [configurations]
  [siteinstall]
  [back]
(Move up and down to reveal more choices)
```

Available commands are:

- `[status]` - Retrieving Auto Provisioning node status returns the node status information for each task that has been executed for the specified node.
- `[properties]` - Retrieving Auto Provisioning node properties returns the node properties for each task that has been executed for the specified node.
- `[delete]` - Delete an Auto Provisioning node removes the Auto Provisioning data for a Network Element. If a node is the last node in a project and there are no profiles associated with the project the project will automatically be deleted.
- `[bind]` - Binding a hardware serial number to a node configuration associates the specified node configurations with a hardware serial number for Zero Touch Integration or Hardware Replace.
- `[cancel]` - Cancelling the auto provisioning activity rolls back an AutoProvisoning workflow for Node Integration. For expansion a node is rolled back to it\s original configuration if additional configurations have been applied to the node.
- `[resume]` - Resuming the auto provisioning activity recommences an Auto Provisioning workflow that is suspended.
- `[configurations]` - Uploading an auto provisioning configuration replaces a configuration file that was part of the initial Auto Provisioning node configuration.
- `[siteinstall]` - Download Site Installation File (SIF) that is required to be taken on site for LMT Integration or LMT Hardware Replace.
- `[back]` - Return to project\s nodes.
- `[exit]` - Exit this app.


## Contribution

1. [Fork it]
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am Add some feature`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Known Issues

### flickering issue

In some windows terminal spinner may look flickery. To fix this you need to modify file ./node_modules/ora/index.js

Add 1 to _clearLine()_ on this line

```javascript
this.stream.clearLine(1);
```

## Credits

[Contact Me](https://github.com/vvsviridov/) to request new feature or bugs reporting.

## Changes

1.0.0 - is released
