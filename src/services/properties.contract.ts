const contract = require('truffle-contract');
const PropertyFactoryContract = require('latude-contracts/build/contracts/PropertyFactory.json');
const propertyFactoryContract = contract(PropertyFactoryContract);
const web3 = window['web3'];
import store from '../store';

class PropertiesService {
    public init() {
        propertyFactoryContract.setProvider(web3.currentProvider);
    }

    private _instance: Promise<any>;
    public getInstance(): Promise<any> {
        if (!this._instance) {
            this._instance = propertyFactoryContract.at(process.env.REACT_APP_LOCAL_PROPERTY_FACTORY);
            this._instance.then((instance) => {
                // instance.propertyCreated('latest').watch((error: Error, result: any) => {
                //     store.dispatch({ type: 'properties/FETCH_PROPERTIES' });
                //     console.log(result);
                // });
            });
        }
        return this._instance;
    }

    public async getProperties(context: any) {
        const instance = await this.getInstance();
        const properties = await instance.getProperties.call({ from: context.web3.selectedAccount });
        store.dispatch({ type: 'properties/PROPERTIES_FETCHED', payload: properties });
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

export default new PropertiesService();