const contract = require('truffle-contract');
const web3 = window['web3'];

export default abstract class Web3Contract {
    private contract: any;
    protected web3 = web3;

    private _instance: Promise<any>;

    constructor(contractAbi: string) {
        this.contract = contract(contractAbi);
    }

    protected init() {
        this.contract.setProvider(web3.currentProvider);
    }

    protected _getInstance(): Promise<any> {
        if (!this._instance) {
            this._instance = this.contract.deployed();
            this._instance.then((instance) => {
                this.onRegisterEvent(instance);
            });
        }
        return this._instance;
    }

    protected async _getInstanceAt(id: string) {
        return await this.contract.at(id);
    }

    protected abstract onRegisterEvent(instance: any): void;
}