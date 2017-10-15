const Web3 = require('web3');

class Ethereum {
    getWeb3() {
        var web3 = window['web3'];

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            console.log('Injected web3 detected.');
            return web3;
        } else {
            var provider = new Web3.providers.HttpProvider('http://localhost:8545')
            web3 = new Web3(provider);
            console.log('No web3 instance injected, using Local web3.');
            return web3;
        }
    }
}

export default Ethereum;