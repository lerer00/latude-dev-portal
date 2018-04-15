import axios from 'axios';
import { IProperty } from '../../models/property';
import { IAsset } from '../../models/asset';

class HubRequest {
    private authentication: any;

    constructor(authentication: any) {
        this.authentication = authentication;
    }

    public getProperty(id: string) {
        return axios.get(process.env.REACT_APP_HUB_URL + '/properties/' + id);
    }

    public postProperty(property: IProperty) {
        return axios.post(process.env.REACT_APP_HUB_URL + '/properties/' + property.id, property, { headers: { 'Authorization': this.authentication.getAuthenticationToken() } })
            .then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
    }

    public postPropertyImages(id: string, files: Array<any>) {
        var formData = new FormData();
        files.forEach((file: File) => {
            formData.append('photos', file);
        });

        return axios.post(process.env.REACT_APP_HUB_URL + '/properties/' + id + '/upload', formData, { headers: { 'Authorization': this.authentication.getAuthenticationToken(), 'Content-Type': 'multipart/form-data' } })
            .then((result) => {
                console.log('Upload images', result);
            }).catch((error) => {
                console.log(error);
            });
    }

    public postAsset(asset: IAsset) {
        return axios.post(process.env.REACT_APP_HUB_URL + '/assets/' + asset.id, asset, { headers: { 'Authorization': this.authentication.getAuthenticationToken() } })
            .then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
    }
}

export default HubRequest;