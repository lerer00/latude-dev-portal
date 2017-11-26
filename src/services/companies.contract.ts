const contract = require('truffle-contract');
const CompanyFactoryContract = require('../build/contracts/CompanyFactory.json');
const companyFactoryContract = contract(CompanyFactoryContract);
const web3 = window['web3'];
import store from '../store';

class CompaniesService {
    public init() {
        companyFactoryContract.setProvider(web3.currentProvider);
    }

    private waitingCompany = new Map();

    private _instance: Promise<any>;

    public getInstance(): Promise<any> {
        if (!this._instance) {
            this._instance = companyFactoryContract.deployed();
            this._instance.then((instance) => {
                instance.companyCreated('latest').watch((error: Error, result: any) => {
                    store.dispatch({type: 'companies/FETCH_COMPANIES' });
                    const name = result.args.name;
                    if (this.waitingCompany.has(name)) {
                        this.waitingCompany.get(name)();
                        this.waitingCompany.delete(name);
                    }
                });
            });
        }
        return this._instance;
    }

    public async getCompanies() {
        const instance = await this.getInstance();
        const companies = await instance.getCompanies.call();
        store.dispatch({type: 'companies/COMPANIES_FETCHED', payload: companies });
        return companies;
    }

    public async addCompany(name: string, context: any, cb: () => void) {
        const instance = await this.getInstance();
        this.waitingCompany.set(name, cb);
        return await instance.addCompany(name, { from: context.web3.selectedAccount });
    }
}

export default new CompaniesService();