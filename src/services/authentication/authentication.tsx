import axios from 'axios';

const moment = require('moment');
const Web3 = window['web3'];

interface IExpirableToken {
    token: string;
    timestamp: number;
}

interface IAuthenticatePayload {
    signature: string;
    owner: string;
}

interface IWeb3Signature {
    id: number;
    jsonrpc: string;
    result: string;
}

class Authentication {
    private static _instance: Authentication;
    private web3: any;
    private constructor() {
        // singleton constructor cannot be called
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new Authentication();
        }

        return this._instance;
    }

    public setWeb3(web3: any) {
        this.web3 = web3;
    }

    public login() {
        return this.getAuthenticationPayload().then((result: IAuthenticatePayload) => {
            return axios.post(process.env.REACT_APP_HUB_URL + '/authenticate', result);
        }).then((result) => {
            this.createAuthenticationStorage(result.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    private getAuthenticationPayload(): Promise<any> {
        return this.getUserSignature().then((result: any) => {
            return {
                signature: result.result,
                owner: this.web3.selectedAccount
            };
        }).catch((error) => {
            console.log(error);
        });
    }

    private getUserSignature(): Promise<IWeb3Signature> {
        return new Promise((resolve, reject) => {
            var data = this.toHex('latude');
            return Web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [this.web3.selectedAccount, data] },
                function (error: any, result: IWeb3Signature) {
                    if (error != null) {
                        reject(error);
                    }

                    resolve(result);
                });
        });
    }

    public logout() {
        this.deleteAuthenticationStorage();
    }

    public isLogin(): boolean {
        var authenticationToken = this.getAuthenticationToken();
        if (authenticationToken === null) {
            return false;
        }
        return true;
    }

    public getSelectedAccount(): string {
        if (!this.web3) {
            return 'searching...';
        }
        return this.web3.selectedAccount;
    }

    public getAuthenticationToken(): string | null {
        var authenticationToken = localStorage.getItem('authentication');
        if (authenticationToken === null)
            return null;

        var decodeToken: IExpirableToken = JSON.parse(atob(authenticationToken));
        if (decodeToken.timestamp < moment().unix()) {
            this.deleteAuthenticationStorage();
            return null;
        } else {
            return decodeToken.token;
        }
    }

    private createAuthenticationStorage(data: any) {
        var token: IExpirableToken = {
            token: data.token.toString(),
            timestamp: moment().add(1, 'days').unix()
        };
        localStorage.setItem('authentication', btoa(JSON.stringify(token)));
    }

    private deleteAuthenticationStorage() {
        localStorage.removeItem('authentication');
    }

    private toHex(s: string) {
        var hex = '';
        for (var i = 0; i < s.length; i++) { hex += '' + s.charCodeAt(i).toString(16); }
        return `0x${hex}`;
    }
}

export default Authentication;