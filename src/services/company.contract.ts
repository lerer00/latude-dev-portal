const CompanyContract = require('../build/contracts/Company.json');
import Web3Contract from './web3.contract';

class CompanyService extends Web3Contract {

    constructor() {
        super(CompanyContract);
    }

    protected onRegisterEvent(instance: any) {}

    public async getCompany(id: string, context: any) {
        this.init();
        const name = await this._getName(id, context);
        const balance = await this._getBalance(id);
        return {
            id,
            name,
            balance,
        };
    }
    private async _getName(id: string, context: any) {
        const instance = await this._getInstanceAt(id);
        return await instance.name.call({ from: context.web3.selectedAccount });
    }

    private async _getBalance(id: string) {
        return await new Promise((resolve, reject) => {
            this.web3.eth.getBalance(id, (error: Error, result: string) => {
                if (error) {
                    reject(error);
                }

                resolve(this.divideByQuintillion(Number(result)));
            });
        });
    }

    private divideByQuintillion(num: number) {
        return num / 1000 / 1000 / 1000 / 1000 / 1000 / 1000;
    }
}

export default new CompanyService();