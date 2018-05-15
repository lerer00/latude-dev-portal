const contract = require('truffle-contract');
const PropertyContract = require('latude-contracts/build/contracts/Property.json');
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

    public async getInstance(): Promise<any> {
        this._instance = await propertyContract.at(this._propertyContractAddress);
        return this._instance;
    }

    public async owner(context: any) {
        const instance = await this.getInstance();
        const owner = await instance.owner.call({ from: context.web3.selectedAccount });
        store.dispatch({ type: 'property/PROPERTY_OWNER_FETCHED', payload: owner });
        return owner;
    }

    public async balance() {
        const balance: any = await this.getBalance();
        store.dispatch({ type: 'property/PROPERTY_BALANCE_FETCHED', payload: balance.toNumber() });
        return balance.toNumber();
    }

    public async getAssets(context: any) {
        const instance = await this.getInstance();
        const numberOfAssets = await instance.numberOfAssets.call({ from: context.web3.selectedAccount });
        var assets: Array<any> = [];
        for (let i = 0; i < numberOfAssets; i++) {
            var asset = await instance.getAsset(i);
            assets.push({
                id: asset[0].toNumber(),
                price: asset[1].toNumber(),
                currency: asset[2],
                bookings: asset[3]
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

    public async addBooking(assetId: string, booking: any, context: any, cb: () => void) {
        const durationInDays = booking.endDate.diff(booking.startDate, 'days');
        const instance = await this.getInstance();
        const price = await instance.getBookingPriceInWei.call(assetId, durationInDays, { from: context.web3.selectedAccount });

        const start = booking.startDate.unix();
        const end = booking.endDate.unix();

        instance.addBooking(assetId, start, end,
            {
                from: context.web3.selectedAccount,
                value: price
            }).then(() => {
                cb();
            });

    }

    public async selfdestruct(context: any, cb: () => void) {
        const instance = await this.getInstance();
        instance.terminate({ from: context.web3.selectedAccount })
            .then(() => {
                cb();
            });
    }

    private getBalance() {
        return new Promise((resolve: any, reject: any) => {
            web3.eth.getBalance(this._propertyContractAddress, function (error: any, result: any) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export default new PropertyService();