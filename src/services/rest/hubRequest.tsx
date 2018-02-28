import axios from 'axios';

class HubRequest {
    private authentication: any;

    constructor(authentication: any) {
        this.authentication = authentication;
    }

    public postProperty(property: any) {
        return axios.post(process.env.REACT_APP_HUB_URL + '/properties/' + property.id, property, { headers: { 'Authorization': this.authentication.getAuthenticationToken() } })
            .then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
    }
}

export default HubRequest;