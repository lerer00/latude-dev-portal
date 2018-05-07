const contract = require('truffle-contract');
const ExchangeRatesContract = require('latude-contracts/build/contracts/ExchangeRates.json');
const exchangeRatesContract = contract(ExchangeRatesContract);
const web3 = window['web3'];

class ExchangeRatesService {
    private _instance: Promise<any>;

    public init() {
        exchangeRatesContract.setProvider(web3.currentProvider);
    }

    public getInstance(): Promise<any> {
        if (!this._instance) {
            // this._instance = exchangeRatesContract.deployed();
            this._instance = exchangeRatesContract.at(process.env.REACT_APP_LOCAL_EXCHANGE_RATES);
        }
        return this._instance;
    }

    public async getCurrencyRate(currency: string) {
        const instance = await this.getInstance();
        const rate = await instance.getCurrencyRate.call(currency);
        return rate;
    }

    public async isCurrencyAllowed(currency: string) {
        const instance = await this.getInstance();
        const isAllowed = await instance.getCurrencyRate.call(currency);
        return isAllowed;
    }
}

export default new ExchangeRatesService();