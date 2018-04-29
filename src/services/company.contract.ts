const contract = require('truffle-contract');
const CompanyContract = require('latude-contracts/build/contracts/Company.json');
const companyContract = contract(CompanyContract);
const web3 = window['web3'];
import store from '../store';

class CompanyService {
    private _instance: Promise<any>;
    private _companyContractAddress: string;

    public init(contractAddress: string) {
        companyContract.setProvider(web3.currentProvider);
        this._companyContractAddress = contractAddress;
    }

    public async getInstance(): Promise<any> {
        this._instance = await companyContract.at(this._companyContractAddress);
        return this._instance;
    }

    public async getProperties() {
        const instance = await this.getInstance();
        const properties = await instance.getProperties.call();
        store.dispatch({ type: 'company/PROPERTIES_FETCHED', payload: properties });
        return properties;
    }

    public async addProperty(name: string, context: any, cb: () => void) {
        const instance = await this.getInstance();
        instance.addProperty(name, { from: context.web3.selectedAccount })
            .then(() => {
                cb();
            });
    }
}

export default new CompanyService();