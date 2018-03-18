import axios from 'axios';
import { IProperty } from '../../models/property';
import { IAsset } from '../../models/asset';

class HubRequest {
    private authentication: any;

    constructor(authentication: any) {
        this.authentication = authentication;
    }

    public postProperty(property: IProperty) {
        return axios.post(process.env.REACT_APP_HUB_URL + '/properties/' + property.id, property, { headers: { 'Authorization': this.authentication.getAuthenticationToken() } })
            .then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
    }

    public postAsset(asset: IAsset) {
        console.log(asset);
        return axios.post(process.env.REACT_APP_HUB_URL + '/assets/' + asset.id, asset, { headers: { 'Authorization': this.authentication.getAuthenticationToken() } })
            .then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
    }
}

export default HubRequest;