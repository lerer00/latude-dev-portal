const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const web3 = window['web3'];
import store from '../store';

class PropertyService {
    private _instance: Promise<any>;
    private _propertyContractAddress: string;

    public init(contractAddress: string) {
        propertyContract.setProvider(web3.currentProvider);
        this._propertyContractAddress = contractAddress;
    }

    public getInstance(): Promise<any> {
        if (!this._instance) {
            this._instance = propertyContract.at(this._propertyContractAddress);
            this._instance.then((instance) => {
                // instance.PropertyCreated('latest').watch((error: Error, result: any) => {
                //     store.dispatch({ type: 'company/FETCH_PROPERTIES' });
                //     console.log(result);
                // });
            });
        }
        return this._instance;
    }

    public async getAssets() {
        const instance = await this.getInstance();
        const numberOfAssets = await instance.numberOfAssets.call();
        var assets: Array<any> = [];
        for (let i = 0; i < numberOfAssets; i++) {
            var asset = await instance.getAsset(i);
            assets.push({
                id: asset[0].toNumber(),
                price: asset[1].toNumber(),
                currency: asset[2],
                stays: asset[3]
            });
        }
        store.dispatch({ type: 'property/ASSETS_FETCHED', payload: assets });
        return assets;
    }

    public async addAsset(asset: any, context: any, cb: () => void) {
        const instance = await this.getInstance();
        instance.addAsset(asset.price, asset.currency, { from: context.web3.selectedAccount })
            .then(() => {
                cb();
            });
    }

    public async getStay(assetId: string, stayId: string) {
        const instance = await this.getInstance();
        const stay = await instance.getStay.call(assetId, stayId);

        return stay;
    }

    public async addStay(assetId: string, stay: any, context: any, cb: () => void) {
        const durationInDays = stay.endDate.diff(stay.startDate, 'days');
        const instance = await this.getInstance();
        const price = await instance.getStayPriceInWei.call(assetId, durationInDays);

        const start = stay.startDate.unix();
        const end = stay.endDate.unix();

        instance.addStay(assetId, start, end,
            {
                from: context.web3.selectedAccount,
                value: price
            }).then(() => {
                cb();
            });

    }
}

export default new PropertyService();