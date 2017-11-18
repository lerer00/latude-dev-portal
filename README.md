# latude-dev-portal

latude-dev-portal is created to help us bootstrap the idea of removing third-parties within the accommodation industry.

### Prerequisites

This is what you need to install before building the application

```
npm ^5.3.0
node ^6.11.2
testrpc ^4.1.1
ipfs ^0.4.11
truffle ^3.4.9
metamask ^3.11.0
ethereum-bridge ^0.5.4
```

You'll also need to deploy a contract first named ExchangeRates.sol that is used to retreived currencies rates against ETH. 
``` 
git clone https://github.com/lerer00/latude-currency-api
npm install
npm run dev
```

This will start the api on you localhost, but it's not enough since oraclized need a valid https public endpoint. That's why we need to use a tool like localtunnel(https://www.npmjs.com/package/localtunnel).

```
lt --port 8000
```

Note the resulting address and deploy the ExchangeRates.sol contract with this address. Note the resulting contract address and modify the 2_deploy_contracts.js file to give CompanyFactory.sol the good ExchangeRates address. 

This is a huge mess for now, I'll improve this procedure.

### Installing

Here's how to setup you dev environment using testrpc. Other networks haven't been tested out yet.
Note that testrpc will always run with the same mnemonic phrase since metamask require 12 words.

```
Festch sources and dependencies
git clone https://github.com/lerer00/latude-dev-portal.git
npm install -msvs_version=2015 *this is a problem with the web3 library, does not accept other version... pretty weird!

Automated process
grunt bootstrap (start testrpc & ipfs)
grunt truffle (compile, migrate and copy to go location)
npm start

Manuel process
testrpc --mnemonic "clog banana trophy city sunset busy citizen biology cash orchard better couch" --accounts 50
ipfs daemon
truffle compile
truffle migrate
*copy the /build/contract folder into the /src/build
npm start

```

And if you are doing changes to your solidity contract simply do those step.

```
truffle compile
truffle migrate
```

## Authors

* **Francis Boily** - *Initial work*
* **Vadim Stepanov** - *Work on contracts*

