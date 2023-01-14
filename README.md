# CLI application based on ENM (Ericsson Network Manager) REST API

[![Github version](https://img.shields.io/github/package-json/version/vvsviridov/enm-cli?label=enm-cli&color=brightgreen&logo=github)](https://github.com/vvsviridov/enm-cli)
[![Npm version](https://img.shields.io/npm/v/enm-cli?color=red&logo=npm&label=enm-cli)](https://www.npmjs.com/package/enm-cli)

## Key Features

- 🚲 Simple and easy to use
- 📟 Does not require GUI
- 🚀 Faster than a web-browser
- 🏗 Allows to make changes in config mode
- 🤯 No needs to remember nodes IP addresses

## Installation

First you need **node.js** which can be downloaded from official site [nodejs.org](https://nodejs.org/en/download/) and installed as described in the docs.

### Run directly from NPM without installation

```shell
npx enm-cli -u https://enm.your.company.com
```

### Install with NPM

```shell
npm install -g enm-cli
```

### Download this repository and run from the project root directory

```shell
npm install
```

... to install dependencies,

```shell
npm link
```

... to add application to your OS $PATH variable if you want to run it from anywhere.

## Store your credentials

### Dotenv file

Create `.env` file in project's root folder and store your credentials as:

```shell
LOGIN=YourLogin
PASSWORD=YourPassword
```

### Prompted by app

By default you'll be prompted for username and password

## Launch apllication

```shell
> enm-cli -l USERNAME -p PASSWORD -u https://enm.your.company.domain.com
💾 Select Application: (Use arrow keys)
> Topology Browser
  Auto Provisioning
  Bulk Import
  Shell Terminal
```

## Usage

Recommended environment is Windows Terminal (not _cmd.exe_) or any shell with rich formatting support. After application successfully launched youll see root content and available commands.

### Help Page

```shell
> enm-cli --help
Usage: enm-cli [options]

Options:
  -V, --version                output the version number
  -l, --login <letters>        ENM User Login (env: LOGIN)
  -p, --password <letters>     ENM User Password (env: PASSWORD)
  -a, --application <letters>  Start specified application (choices: "tplg", "prvn", "bulk", "shll")
  -u, --url <valid URL>        ENM Url
  -h, --help                   display help for command
```

## AutoProvisioning Application

![AutoProvisioning](img/render1673699059489.gif?raw=true 'AutoProvisioning')

### Connection

```shell
>enm-cli -l USERNAME -p PASSWORD -u https://enm.your.company.domain.com -a prvn
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

```shell
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

```shell
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

```shell
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
- `[back]` - Return to project's nodes.
- `[exit]` - Exit this app.

## TopologyBrowser Application

![TopologyBrowser](img/render1673690475520.gif?raw=true 'TopologyBrowser')

```shell
PS C:\> enm-cli -l USERNAME -p PASSWORD -u https://enm.your.company.domian.com -a tplg
✔ Login in...
Authentication Successful
✔ Starting Topology Browser...
✔ Reading Topology...
 SubNetwork=ONRM_ROOT_MO> (Use arrow keys or type to search)
> SubNetwork=Core
  SubNetwork=LTE
  SubNetwork=RBS
  SubNetwork=RNC
  show
  config
  up
  home
  exit
```

### Commands

> **Note:** _only `show` and `fdn` command can have parameter, all other commands haven't._

- `[show] [<valid regex>]` - shows current object's attributes filtered with regex
- `[config]` - enters _config_ mode
- `[up]` - navigate up one level
- `[fdn] [<valid FDN>]` - navigate to FDN
- `[home]` - navigate to root folder
- `[alarms]` - show alarms
- `[search]` - searching specified node in topology
- `[sync]` - initiate node CM synchronization
- `[persistent]` - toggle persistent attributes inclusion
- `[amos]` - launch advanced moshell (amos)
- `[scripting]` - launch shell terminal on scripting VM
- `[wfcli]` - launch WinFIOL CLI
- `[nodecli]` - launch Node CLI
- `[exit]` - logout and exit application

### Advanced MOshell Scripting, Scripting Terminal and WinFIOL CLI

These applications are executes on ENM virtual machines and does not required any local installation

### Examples

Start typing and you see only matches commands to your input.

```shell
SubNetwork=ONRM_ROOT_MO> subn
> SubNetwork=Core
  SubNetwork=LTE
  SubNetwork=RBS
  SubNetwork=RNC
SubNetwork=ONRM_ROOT_MO> exi
>exit
```

You can navigate to the next level selecting object ...

```shell
SubNetwork=ONRM_ROOT_MO> subn
  SubNetwork=Core
  SubNetwork=LTE
  SubNetwork=RBS
> SubNetwork=RNC
SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC>
> MeContext=RNC01
  MeContext=RNCTEST
  MeContext=TEST
```

View objects attributes ...

```shell
SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC> show
> show
✔ Reading Topology...

  FDN: SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC

  SubNetworkId: RNC

SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC> MeContext=RNC01
> MeContext=RNC01
✔ Reading Topology...
... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01> show
> show
✔ Reading Topology...

  FDN: SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01

  MeContextId: RNC01
  neType: RNC
  platformType: CPP
```

... show attributes with filter

```shell
... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01> show Type
> show type
✔ Reading Topology...

  FDN: SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01

  neType: RNC
  platformType: CPP

... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01>
```

Return one level up in FDN tree ...

```shell
... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01> up
> up
✔ Reading Topology...
SubNetwork=ONRM_ROOT_MO,SubNetwork=RNC>
```

Return to the root from anywhere ...

```shell
... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01> home
> home
✔ Reading Topology...
SubNetwork=ONRM_ROOT_MO>
```

Go to specific FDN ...

```shell
... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01> fdn NetworkElement=RBS01
```

And logout and exit ...

```shell
... Network=ONRM_ROOT_MO,SubNetwork=RNC,MeContext=RNC01> exit
> exit
✔ Logout...
Logout OK
PS C:\>
```

### Config Mode

To modify attributes _config_ mode is used.

Available commands are:

- `[commit]` - commiting changes to the network
- `[check]` - view configuration changes
- `[get]` - get attribute value
- `[set]` - set attribute value
- `[end]` - end config mode without commiting
- `[exit]` - logout and exit application

```shell
... ManagedElement=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1> config
> config
✔ Reading Attributes...
✔ Reading Attributes Data...

    syncStatus: SYNCHRONIZED
    ipAddress: 10.10.11.1
    managementState: NORMAL
    radioAccessTechnology: 4G, 3G

... lement=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(config)# (Use arrow keys or type to search)
> acBarringForCsfb
  acBarringForEmergency
  acBarringForMoData
  acBarringForMoSignalling
  ...
  commit
  check
  end
  exit
(Move up and down to reveal more choices)
```

To modify attribute select it ...

```shell
... lement=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(config)# userLabel
... ent=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(userLabel)#
  commit
  check
  end
  exit
> get
  set
  description
```

Now you can get it ...

```shell
... ent=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(userLabel)# get
> get

  FDN: SubNetwork=ONRM_ROOT_MO,SubNetwork=RBS,MeContext=ERBS01,ManagedElement=1,ENodeBFunction=1,EUtranCellFDD=test1(userLabel)

  userLabel: test1

  Type: STRING

```

And set it's value ...

```shell
... ent=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(userLabel)# set
? userLabel (STRING): ? test_label
```

Check configuration before applying

```shell
... ent=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(userLabel)# check

  FDN: SubNetwork=ONRM_ROOT_MO,SubNetwork=RBS,MeContext=ERBS01,ManagedElement=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1

  userLabel: test_label

```

Applying changes to the network ...

```shell
... ent=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(userLabel)# commit

  FDN: SubNetwork=ONRM_ROOT_MO,SubNetwork=RBS,MeContext=ERBS01,ManagedElement=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1

  userLabel: test_label
✔ Commiting Config...
Success
```

View attribute's description

```shell
... lement=ERBS01,ENodeBFunction=1,EUtranCellFDD=test1(config)# acBarringForCsfb
... S01,ENodeBFunction=1,EUtranCellFDD=test1(acBarringForCsfb)# description

acBarringForCsfb: COMPLEX_REF

DESCRIPTION
      Access class barring parameters for mobile originating CSFB calls.
The information is broadcasted in SIB2.

TRAFFIC DISTURBANCES
      Changing this attribute can cause loss of traffic.

IMMUTABLE
      false

ACTIVE CHOICE CASE
      null


COMPLEX_REF
    AcBarringConfig: AcBarringConfig


acBarringTime: INTEGER  default: 64

DESCRIPTION
      Mean access barring time in seconds for mobile originating signalling.

IMMUTABLE
      false

ACTIVE CHOICE CASE
      null

CONSTRAINTS
    Nullable: false
    Value Resolution: null


acBarringForSpecialAC: LIST  default: false,false,false,false,false

DESCRIPTION
      Access class barring for AC 11-15. The first instance in the list is for AC 11, second is for AC 12, and so on.

IMMUTABLE
      false

ACTIVE CHOICE CASE
      null

CONSTRAINTS
    Nullable: false
LISTREFERENCE
    BOOLEAN
CONSTRAINTS
    Nullable: true


acBarringFactor: INTEGER  default: 95

DESCRIPTION
      If the random number drawn by the UE is lower than this value, access is allowed. Otherwise the access is barred.

IMMUTABLE
      false

ACTIVE CHOICE CASE
      null

CONSTRAINTS
    Nullable: false
    Value Resolution: null
```

## Bulk Import

![BulkImport](img/render1673699800882.gif?raw=true 'BulkImport')

## Shell Terminal

![ShellTerminal](img/render1673702182559.gif?raw=true 'ShellTerminal')

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

1.0.0 - Is released

1.0.2 - Bulk Import added

1.0.5 - Fix AutoProvisioning errors

1.0.6 - Ability to launch amos, scripting shell terminal and winfiol cli
