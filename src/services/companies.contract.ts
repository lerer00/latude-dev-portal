const CompanyFactoryContract = require('../build/contracts/CompanyFactory.json');
import Web3Contract from './web3.contract';
import companyContract from './company.contract';
import store from '../store';
import * as test from '../test';

class CompaniesService extends Web3Contract {

    constructor() {
        super(CompanyFactoryContract);
    }

    private waitingCompany = new Map();

    protected onRegisterEvent(instance: any) {
        instance.companyCreated('latest').watch((error: Error, result: any) => {
            store.dispatch({type: 'companies/FETCH_COMPANIES' });
            const name = result.args.name;
            if (this.waitingCompany.has(name)) {
                this.waitingCompany.get(name)();
                this.waitingCompany.delete(name);
            }
        });
    }

    public async getCompanies(context: any) {
        const contract = new test.CompanyFactory();
        console.log(await contract.getCompanies({}));
        this.init();
        const instance = await this._getInstance();
        const companies = await instance.getCompanies.call();
        const mappedCompanies = [];
        for (const id of companies) {
            const company = await companyContract.getCompany(id, context);
            mappedCompanies.push(company);
        }
        store.dispatch({type: 'companies/COMPANIES_FETCHED', payload: mappedCompanies });
        return companies;
    }

    public async addCompany(name: string, context: any, cb: () => void) {
        this.init();
        const instance = await this._getInstance();
        this.waitingCompany.set(name, cb);
        return await instance.addCompany(name, { from: context.web3.selectedAccount });
    }
}

export default new CompaniesService();