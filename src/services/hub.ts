import axios from 'axios';
import store from '../store';
import Authentication from '../services/authentication/authentication';

class HubService {
    private _instance: HubService;
    private _authentication: any;

    public getInstance(): HubService {
        if (!this._instance) {
            this._instance = new HubService();
            this._instance._authentication = Authentication.getInstance();
        }
        return this._instance;
    }

    public async getProperty(id: string) {
        var property = await axios.get(process.env.REACT_APP_HUB_URL + '/properties/' + id);
        store.dispatch({ type: 'property/PROPERTY_FETCHED', payload: property.data });
        return property.data;
    }

    public async postProperty(property: any) {
        var result = await axios.post(process.env.REACT_APP_HUB_URL + '/properties/' + property.id, property, { headers: { 'Authorization': this._authentication.getAuthenticationToken() } });
        return result;
    }

    public async postPropertyImages(propertyId: string, files: Array<any>) {
        var formData = new FormData();
        files.forEach((file: File) => {
            formData.append('photos', file);
        });

        var result = await axios.post(process.env.REACT_APP_HUB_URL + '/properties/' + propertyId + '/upload', formData, { headers: { 'Authorization': this._authentication.getAuthenticationToken(), 'Content-Type': 'multipart/form-data' } });
        return result;
    }

    public async getAsset(id: string) {
        var asset = await axios.get(process.env.REACT_APP_HUB_URL + '/assets/' + id);
        store.dispatch({ type: 'asset/ASSET_FETCHED', payload: asset.data });
        return asset.data;
    }

    public async postAsset(asset: any, cb: () => {}) {
        var result = await axios.post(process.env.REACT_APP_HUB_URL + '/assets/' + asset.id, asset, { headers: { 'Authorization': this._authentication.getAuthenticationToken() } });
        cb();
        return result;
    }
}

export default new HubService();