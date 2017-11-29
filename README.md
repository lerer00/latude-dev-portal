# latude-dev-portal

This repo is created to help us bootstrap the idea of removing third-parties within the accommodation industry. This application is the one that hotel manager will use to manage companies, properties and assets.

### Prerequisites

This is what you need to install before building the application

```
npm ^5.3.0
node ^6.11.2
testrpc ^4.1.3
truffle ^4.0.0
metamask ^3.12.0
geth 1.7.2
```

### Installing

Here's how to setup you dev environment using testrpc or RinkeBy. Other environment haven't been tested out yet.

#### Get and Build sources

```
git clone https://github.com/lerer00/latude-dev-portal.git
npm install -msvs_version=2015 //this is a problem with the web3 library, it does not accept other version... pretty weird!
```

#### Developing localy with testrpc

First there's a line in the ExchangeRates.sol constructor that you need to uncomment.
```
OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
```

Follow those grunt commands.

This command start the local rpc with mnemonic "clog banana trophy city sunset busy citizen biology cash orchard better couch".
```
grunt start_localrpc
```
This command clean previous build, compile all solidity contract with truffle and migrate them against the desired rpc.
```
grunt localrpc
```
This should start the application in your prefered browser.
```
npm start
```

#### Developing with RinkeBy

This line in the ExchangeRates.sol constructor should be commented.
```
OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
```

Follow those grunt commands.

This command start the rinkeby rpc using geth. You'll need to create yourself an account first following those [instructions](https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts#creating-an-account). Take your account address and paste it in the appropriate location in the gruntfile.js exec:local_geth_rinkeby function. Make sure to remember your passphrase because you'll need it.
```
grunt start_rinkeby
```
This command clean previous build, compile all solidity contract with truffle and migrate them against the desired rpc.
```
grunt rinkeby
```
This should start the application in your prefered browser.
```
npm start
```

### Authors

[**Francis Boily**](https://github.com/lerer00) - *Initial work*
[**Simon B.Robert**](https://github.com/carte7000) - *Active development*
[**Vadim Stepanov**](https://github.com/vadimkerr) - *Work on contracts*

