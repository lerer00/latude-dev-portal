import axios from 'axios';
const Web3 = window['web3'];

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
    public isAuthenticate: boolean = false;
    public web3: any;

    constructor(web3: any) {
        this.web3 = web3;
    }

    public authenticate() {
        this.getAuthenticatePayload().then((result: IAuthenticatePayload) => {
            return axios.post('http://localhost:3001/authenticate', result);
        }).then((result) => {
            console.log(result);
            if (result.status === 200) {
                this.createAuthenticateCookie(result.data);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    private createAuthenticateCookie(data: any) {
        console.log('CREATE COOKIE', data);
    }

    private getAuthenticatePayload(): Promise<any> {
        return this.getUserSignature().then((result: any) => {
            console.log(result);
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

    private toHex(s: string) {
        var hex = '';
        for (var i = 0; i < s.length; i++) { hex += '' + s.charCodeAt(i).toString(16); }
        return `0x${hex}`;
    }
}

export default Authentication;