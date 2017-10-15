# Project Title

latude-dev-portal is created to help us bootstrap the idea of removing third-parties within the accommodation industry.

## Getting Started

Build React, Web3, IPFS, and the help of solidity contracts. 

### Prerequisites

This is what you need to install before building the application

```
npm ^5.3.0
node ^6.11.2
testrpc ^4.1.1
ipfs ^0.4.11
truffle ^3.4.9
metamask ^3.11.0
```

### Installing

Here's how to setup you dev environment using testrpc. Other networks haven't been tested out yet.
Note that testrpc will always run with the same mnemonic phrase since metamask require 12 words.

```
git clone https://github.com/lerer00/latude-dev-portal.git
npm install
testrpc --mnemonic "clog banana trophy city sunset busy citizen biology cash orchard better couch" --accounts 50
truffle compile
truffle migrate
*copy the /build/contract folder into the /src/truffle-build this step will be removed soon
npm start
```

And if you are doing changes to your solidity contract simply do those step.

```
truffle compile
truffle migrate
```

## Authors

* **Francis Boily** - *Initial work*

