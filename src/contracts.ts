 

export namespace W3 {
    declare type BigNumber = Object;

    export type address = string;
    export type bytes = string;

    /** Truffle Contract */
    export namespace TC {
        export interface TxParams {
            from: address;
            gas: number;
            gasPrice: number;
            value: number;
        }

        export type ContractDataType = BigNumber | number | string | boolean | BigNumber[] | number[] | string[];

        export interface TransactionResult {
            /** Transaction hash. */
            tx: string;
            receipt: TransactionReceipt;
            /** This array has decoded events, while reseipt.logs has raw logs when returned from TC transaction */
            logs: Log[];
        }

        export function txParamsDefaultDeploy(from: address): TxParams {
            return {
                from: from,
                gas: 4712388,
                gasPrice: 20000000000,
                value: 0
            };
        }

        export function txParamsDefaultSend(from: address): TxParams {
            return {
                from: from,
                gas: 50000,
                gasPrice: 20000000000,
                value: 0
            };
        }
    }

    // '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{see above}],"id":1}'
    export interface JsonRPCRequest {
        jsonrpc: string;
        method: string;
        params: any[];
        id: number | string;
    }
    export interface JsonRPCResponse {
        jsonrpc: string;
        id: number | string;
        result?: any;
        error?: string;
    }

    export interface Provider {
        sendAsync(
            payload: JsonRPCRequest,
            callback: (err: Error, result: JsonRPCResponse) => void,
        ): void;
    }

    // export interface Provider {
    //     send(payload: JsonRPCRequest, callback: (e: Error, val: JsonRPCResponse) => void);
    // }

    export interface WebsocketProvider extends Provider { }
    export interface HttpProvider extends Provider { }
    export interface IpcProvider extends Provider { }
    export interface Providers {
        WebsocketProvider: new (host: string, timeout?: number) => WebsocketProvider;
        HttpProvider: new (host: string, timeout?: number) => HttpProvider;
        IpcProvider: new (path: string, net: any) => IpcProvider;
    }

    // tslint:disable-next-line:max-line-length
    export type Unit = 'kwei' | 'femtoether' | 'babbage' | 'mwei' | 'picoether' | 'lovelace' | 'qwei' | 'nanoether' | 'shannon' | 'microether' | 'szabo' | 'nano' | 'micro' | 'milliether' | 'finney' | 'milli' | 'ether' | 'kether' | 'grand' | 'mether' | 'gether' | 'tether';

    export type BlockType = 'latest' | 'pending' | 'genesis' | number;

    export interface BatchRequest {
        add(request: Request): void;
        execute(): void;
    }
    export interface Iban { }
    export interface Utils {
        BN: BigNumber; // TODO only static-definition
        isBN(obj: any): boolean;
        isBigNumber(obj: any): boolean;
        isAddress(obj: any): boolean;
        isHex(obj: any): boolean;
        // tslint:disable-next-line:member-ordering
        asciiToHex(val: string): string;
        hexToAscii(val: string): string;
        bytesToHex(val: number[]): string;
        numberToHex(val: number | BigNumber): string;
        checkAddressChecksum(address: string): boolean;
        fromAscii(val: string): string;
        fromDecimal(val: string | number | BigNumber): string;
        fromUtf8(val: string): string;
        fromWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
        hexToBytes(val: string): number[];
        hexToNumber(val: string | number | BigNumber): number;
        hexToNumberString(val: string | number | BigNumber): string;
        hexToString(val: string): string;
        hexToUtf8(val: string): string;
        keccak256(val: string): string;
        leftPad(str: string, chars: number, sign: string): string;
        padLeft(str: string, chars: number, sign: string): string;
        rightPad(str: string, chars: number, sign: string): string;
        padRight(str: string, chars: number, sign: string): string;
        sha3(val: string, val2?: string, val3?: string, val4?: string, val5?: string): string;
        soliditySha3(val: string): string;
        randomHex(bytes: number): string;
        stringToHex(val: string): string;
        toAscii(hex: string): string;
        toBN(obj: any): BigNumber;
        toChecksumAddress(val: string): string;
        toDecimal(val: any): number;
        toHex(val: any): string;
        toUtf8(val: any): string;
        toWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
        // tslint:disable-next-line:member-ordering
        unitMap: any;
    }
    export type Callback<T> = (error: Error, result: T) => void;
    export type ABIDataTypes = 'uint256' | 'boolean' | 'string' | 'bytes' | string; // TODO complete list

    export interface ABIDefinition {
        constant?: boolean;
        payable?: boolean;
        anonymous?: boolean;
        inputs?: Array<{ name: string, type: ABIDataTypes, indexed?: boolean }>;
        name?: string;
        outputs?: Array<{ name: string, type: ABIDataTypes }>;
        type: 'function' | 'constructor' | 'event' | 'fallback';
    }

    export interface CompileResult {
        code: string;
        info: {
            source: string;
            language: string;
            languageVersion: string;
            compilerVersion: string;
            abiDefinition: Array<ABIDefinition>;
        };
        userDoc: { methods: object };
        developerDoc: { methods: object };
    }

    export interface Transaction {
        hash: string;
        nonce: number;
        blockHash: string;
        blockNumber: number;
        transactionIndex: number;
        from: string;
        to: string;
        value: string;
        gasPrice: string;
        gas: number;
        input: string;
        v?: string;
        r?: string;
        s?: string;
    }
    export interface EventLog {
        event: string;
        address: string;
        returnValues: object;
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        raw?: { data: string, topics: any[] };
    }

    export interface TransactionReceipt {
        transactionHash: string;
        transactionIndex: number;
        blockHash: string;
        blockNumber: number;
        from: string;
        to: string;
        contractAddress: string;
        cumulativeGasUsed: number;
        gasUsed: number;
        logs?: Log[];
        events?: {
            [eventName: string]: EventLog
        };
    }
    export interface BlockHeader {
        number: number;
        hash: string;
        parentHash: string;
        nonce: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionRoot: string;
        stateRoot: string;
        receiptRoot: string;
        miner: string;
        extraData: string;
        gasLimit: number;
        gasUsed: number;
        timestamp: number;
    }
    export interface Block extends BlockHeader {
        transactions: Array<Transaction>;
        size: number;
        difficulty: number;
        totalDifficulty: number;
        uncles: Array<string>;
    }

    export interface Logs {
        fromBlock?: number;
        address?: string;
        topics?: Array<string | string[]>;

    }

    /**  */
    export interface Log {
        /** true when the log was removed, due to a chain reorganization. false if its a valid log. */
        removed?: boolean;
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        address: string;
        data?: string;
        topics?: Array<string>;

        /** Truffle-contract returns this as 'mined' */
        type?: string;

        /** Event name decoded by Truffle-contract */
        event?: string;
        /** Args passed to a Truffle-contract method */
        args?: any;
    }

    export interface Subscribe<T> {
        subscription: {
            id: string;
            subscribe(callback?: Callback<Subscribe<T>>): Subscribe<T>;
            unsubscribe(callback?: Callback<boolean>): void | boolean;
            // tslint:disable-next-line:member-ordering
            arguments: object;
        };
        /*  on(type: "data" , handler:(data:Transaction)=>void): void
          on(type: "changed" , handler:(data:Logs)=>void): void
          on(type: "error" , handler:(data:Error)=>void): void
          on(type: "block" , handler:(data:BlockHeader)=>void): void
          */
        on(type: 'data', handler: (data: T) => void): void;
        on(type: 'changed', handler: (data: T) => void): void;
        on(type: 'error', handler: (data: Error) => void): void;
    }

    export interface Account {
        address: string;
        privateKey: string;
        publicKey: string;

    }

    export interface PrivateKey {
        address: string;
        Crypto: {
            cipher: string,
            ciphertext: string,
            cipherparams: {
                iv: string
            },
            kdf: string,
            kdfparams: {
                dklen: number,
                n: number,
                p: number,
                r: number,
                salt: string
            },
            mac: string
        };
        id: string;
        version: number;
    }

    export interface Signature {
        message: string;
        hash: string;
        r: string;
        s: string;
        v: string;
    }
    export interface Tx {
        nonce?: string | number;
        chainId?: string | number;
        from?: string;
        to?: string;
        data?: string;
        value?: string | number;
        gas?: string | number;
        gasPrice?: string | number;
    }

    export interface ContractOptions {
        address: string;
        jsonInterface: ABIDefinition[];
        from?: string;
        gas?: string | number | BigNumber;
        gasPrice?: number;
        data?: string;
    }

    export type PromiEventType = 'transactionHash' | 'receipt' | 'confirmation' | 'error';
    export interface PromiEvent<T> extends Promise<T> {
        once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
        once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
        once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;
        once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
        // tslint:disable-next-line:max-line-length
        once(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>;
        on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
        on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
        on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;
        on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
        // tslint:disable-next-line:max-line-length
        on(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>;
    }
    export interface EventEmitter {
        on(type: 'data', handler: (event: EventLog) => void): EventEmitter;
        on(type: 'changed', handler: (receipt: EventLog) => void): EventEmitter;
        on(type: 'error', handler: (error: Error) => void): EventEmitter;
        // tslint:disable-next-line:max-line-length
        on(type: 'error' | 'data' | 'changed', handler: (error: Error | TransactionReceipt | string) => void): EventEmitter;
    }

    export interface TransactionObject<T> {
        arguments: any[];
        call(tx?: Tx): Promise<T>;
        send(tx?: Tx): PromiEvent<T>;
        estimateGas(tx?: Tx): Promise<number>;
        encodeABI(): string;
    }

    export interface Contract {
        options: ContractOptions;
        methods: {
            [fnName: string]: (...args: any[]) => TransactionObject<any>
        };
        deploy(options: {
            data: string
            arguments: any[]
        }): TransactionObject<Contract>;
        // tslint:disable-next-line:member-ordering
        events: {
            [eventName: string]: (options?: {
                filter?: object
                fromBlock?: BlockType
                topics?: any[]
            }, cb?: Callback<EventLog>) => EventEmitter
            // tslint:disable-next-line:max-line-length
            allEvents: (options?: { filter?: object, fromBlock?: BlockType, topics?: any[] }, cb?: Callback<EventLog>) => EventEmitter
        };

    }

    export interface Eth {
        readonly defaultAccount: string;
        readonly defaultBlock: BlockType;
        BatchRequest: new () => BatchRequest;
        Iban: new (address: string) => Iban;
        Contract: new (jsonInterface: any[], address?: string, options?: {
            from?: string
            gas?: string | number | BigNumber
            gasPrice?: number
            data?: string
        }) => Contract;
        abi: {
            decodeLog(inputs: object, hexString: string, topics: string[]): object
            encodeParameter(type: string, parameter: any): string
            encodeParameters(types: string[], paramaters: any[]): string
            encodeEventSignature(name: string | object): string
            encodeFunctionCall(jsonInterface: object, parameters: any[]): string
            encodeFunctionSignature(name: string | object): string
            decodeParameter(type: string, hex: string): any
            decodeParameters(types: string[], hex: string): any
        };
        accounts: {
            'new'(entropy?: string): Account
            privateToAccount(privKey: string): Account
            publicToAddress(key: string): string
            // tslint:disable-next-line:max-line-length
            signTransaction(tx: Tx, privateKey: string, returnSignature?: boolean, cb?: (err: Error, result: string | Signature) => void): Promise<string> | Signature;
            recoverTransaction(signature: string | Signature): string
            sign(data: string, privateKey: string, returnSignature?: boolean): string | Signature
            recover(signature: string | Signature): string
            encrypt(privateKey: string, password: string): PrivateKey
            decrypt(privateKey: PrivateKey, password: string): Account
            // tslint:disable-next-line:member-ordering
            wallet: {
                'new'(numberOfAccounts: number, entropy: string): Account[]
                add(account: string | Account): any
                remove(account: string | number): any
                save(password: string, keyname?: string): string
                load(password: string, keyname: string): any
                clear(): any
            }
        };
        call(callObject: Tx, defaultBloc?: BlockType, callBack?: Callback<string>): Promise<string>;
        clearSubscriptions(): boolean;
        subscribe(type: 'logs', options?: Logs, callback?: Callback<Subscribe<Log>>): Promise<Subscribe<Log>>;
        subscribe(type: 'syncing', callback?: Callback<Subscribe<any>>): Promise<Subscribe<any>>;
        // tslint:disable-next-line:max-line-length
        subscribe(type: 'newBlockHeaders', callback?: Callback<Subscribe<BlockHeader>>): Promise<Subscribe<BlockHeader>>;
        subscribe(type: 'pendingTransactions', callback?: Callback<Subscribe<Transaction>>): Promise<Subscribe<Transaction>>;
        // tslint:disable-next-line:max-line-length
        subscribe(type: 'pendingTransactions' | 'newBlockHeaders' | 'syncing' | 'logs', options?: Logs, callback?: Callback<Subscribe<Transaction | BlockHeader | any>>): Promise<Subscribe<Transaction | BlockHeader | any>>;

        unsubscribe(callBack: Callback<boolean>): void | boolean;
        // tslint:disable-next-line:member-ordering
        compile: {
            solidity(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
            lll(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
            serpent(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
        };
        // tslint:disable-next-line:member-ordering
        currentProvider: Provider;
        estimateGas(tx: Tx, callback?: Callback<number>): Promise<number>;
        getAccounts(cb?: Callback<Array<string>>): Promise<Array<string>>;
        getBalance(address: string, defaultBlock?: BlockType, cb?: Callback<number>): Promise<number>;
        // tslint:disable-next-line:variable-name
        getBlock(number: BlockType, returnTransactionObjects?: boolean, cb?: Callback<Block>): Promise<Block>;
        getBlockNumber(callback?: Callback<number>): Promise<number>;
        // tslint:disable-next-line:variable-name
        getBlockTransactionCount(number: BlockType | string, cb?: Callback<number>): Promise<number>;
        // tslint:disable-next-line:variable-name
        getBlockUncleCount(number: BlockType | string, cb?: Callback<number>): Promise<number>;
        getCode(address: string, defaultBlock?: BlockType, cb?: Callback<string>): Promise<string>;
        getCoinbase(cb?: Callback<string>): Promise<string>;
        getCompilers(cb?: Callback<string[]>): Promise<string[]>;
        getGasPrice(cb?: Callback<number>): Promise<number>;
        getHashrate(cb?: Callback<number>): Promise<number>;
        getPastLogs(options: {
            fromBlock?: BlockType
            toBlock?: BlockType
            address: string
            topics?: Array<string | Array<string>>
        }, cb?: Callback<Array<Log>>): Promise<Array<Log>>;
        getProtocolVersion(cb?: Callback<string>): Promise<string>;
        getStorageAt(address: string, defaultBlock?: BlockType, cb?: Callback<string>): Promise<string>;
        getTransactionReceipt(hash: string, cb?: Callback<TransactionReceipt>): Promise<TransactionReceipt>;
        getTransaction(hash: string, cb?: Callback<Transaction>): Promise<Transaction>;
        getTransactionCount(address: string, defaultBlock?: BlockType, cb?: Callback<number>): Promise<number>;
        getTransactionFromBlock(block: BlockType, index: number, cb?: Callback<Transaction>): Promise<Transaction>;
        // tslint:disable-next-line:max-line-length
        getUncle(blockHashOrBlockNumber: BlockType | string, uncleIndex: number, returnTransactionObjects?: boolean, cb?: Callback<Block>): Promise<Block>;
        getWork(cb?: Callback<Array<string>>): Promise<Array<string>>;
        // tslint:disable-next-line:member-ordering
        givenProvider: Provider;
        isMining(cb?: Callback<boolean>): Promise<boolean>;
        isSyncing(cb?: Callback<boolean>): Promise<boolean>;
        // tslint:disable-next-line:member-ordering
        net: Net;
        // tslint:disable-next-line:member-ordering
        sendSignedTransaction(data: string, cb?: Callback<string>): PromiEvent<TransactionReceipt>;
        sendTransaction(tx: Tx, cb?: Callback<string>): PromiEvent<TransactionReceipt>;
        submitWork(nonce: string, powHash: string, digest: string, cb?: Callback<boolean>): Promise<boolean>;
        sign(address: string, dataToSign: string, cb?: Callback<string>): Promise<string>;
    }

    export interface SyncingState {
        startingBlock: number;
        currentBlock: number;
        highestBlock: number;
    }

    export type SyncingResult = false | SyncingState;

    export interface Version0 {
        api: string;
        network: string;
        node: string;
        ethereum: string;
        whisper: string;
        getNetwork(callback: (err: Error, networkId: string) => void): void;
        getNode(callback: (err: Error, nodeVersion: string) => void): void;
        getEthereum(callback: (err: Error, ethereum: string) => void): void;
        getWhisper(callback: (err: Error, whisper: string) => void): void;
    }
    export interface Net { }

    export interface Shh { }

    export interface Bzz { }

    export const duration = {
        seconds: function (val: number) { return val; },
        minutes: function (val: number) { return val * this.seconds(60); },
        hours: function (val: number) { return val * this.minutes(60); },
        days: function (val: number) { return val * this.hours(24); },
        weeks: function (val: number) { return val * this.days(7); },
        years: function (val: number) { return val * this.days(365); }
    };
}

const contract = require('truffle-contract');
const web3 = window['web3'];

export abstract class StaticWeb3Contract {
    private contract: any;
    protected web3 = web3;

    private _instance: Promise<any>;

    constructor(contractAbi: any) {
        this.contract = contract(contractAbi);
    }

    protected init() {
        this.contract.setProvider(web3.currentProvider);
    }

    protected _getInstance(): Promise<any> {
        this.init();
        if (!this._instance) {
            this._instance = this.contract.deployed();
        }
        return this._instance;
    }

    public async $getBalance(id: string) {
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

export abstract class Web3Contract {
    private contract: any;
    protected web3 = web3;

    private _instance: Promise<any>;

    constructor(private at: string, contractAbi: string) {
        this.contract = contract(contractAbi);
    }

    protected init() {
        this.contract.setProvider(web3.currentProvider);
    }

    protected _getInstance(): Promise<any> {
        this.init();
        if (!this._instance) {
            this._instance = this.contract.at(this.at);
        }
        return this._instance;
    }

    public async $getBalance() {
        return await new Promise((resolve, reject) => {
            this.web3.eth.getBalance(this.at, (error: Error, result: string) => {
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

            export class Authority extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Authority","networks":{},"abi":[{"constant":true,"inputs":[{"name":"caller","type":"address"},{"name":"target","type":"address"},{"name":"sig","type":"bytes4"}],"name":"canCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async canCall(params: {caller: string;
target: string;
sig: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.canCall.call(params.caller, params.target, params.sig, { from: params.options.from })
            }
        
            private _canCallWatcher = {
                watch: async (cb: (args: {caller: string;target: string;sig: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.canCall('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get canCallEvent() {
                return this._canCallWatcher;
            }
        }
            export class Company extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Company","networks":{},"abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"addProperty","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getProperties","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"properties","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_owner","type":"address"},{"name":"_exchangeContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"}]})    
                }
        

            

            public async name(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.name.call({ from: params.options.from })
            }
        
            private _nameWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.name('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get nameEvent() {
                return this._nameWatcher;
            }
        

            

            public async terminate(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.terminate({ from: params.options.from })
            }
        
            private _terminateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.terminate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get terminateEvent() {
                return this._terminateWatcher;
            }
        

            

            public async setOwner(params: {newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setOwner(params.newOwner, { from: params.options.from })
            }
        
            private _setOwnerWatcher = {
                watch: async (cb: (args: {newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setOwner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setOwnerEvent() {
                return this._setOwnerWatcher;
            }
        

            

            public async exchangeContract(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.exchangeContract.call({ from: params.options.from })
            }
        
            private _exchangeContractWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.exchangeContract('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get exchangeContractEvent() {
                return this._exchangeContractWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async addProperty(params: {_name: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.addProperty(params._name, { from: params.options.from })
            }
        
            private _addPropertyWatcher = {
                watch: async (cb: (args: {_name: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.addProperty('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get addPropertyEvent() {
                return this._addPropertyWatcher;
            }
        

            

            public async authority(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.authority.call({ from: params.options.from })
            }
        
            private _authorityWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.authority('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get authorityEvent() {
                return this._authorityWatcher;
            }
        

            

            public async getProperties(params: {options: { from: string }}): Promise<string[] | null> {
                const instance = await this._getInstance();
                return await instance.getProperties.call({ from: params.options.from })
            }
        
            private _getPropertiesWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.getProperties('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getPropertiesEvent() {
                return this._getPropertiesWatcher;
            }
        

            

            public async properties(params: {param0: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.properties.call(params.param0, { from: params.options.from })
            }
        
            private _propertiesWatcher = {
                watch: async (cb: (args: {param0: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.properties('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get propertiesEvent() {
                return this._propertiesWatcher;
            }
        }
            export class CompanyAuthority extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"CompanyAuthority","networks":{},"abi":[{"constant":true,"inputs":[{"name":"caller","type":"address"},{"name":"target","type":"address"},{"name":"sig","type":"bytes4"}],"name":"canCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async canCall(params: {caller: string;
target: string;
sig: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.canCall.call(params.caller, params.target, params.sig, { from: params.options.from })
            }
        
            private _canCallWatcher = {
                watch: async (cb: (args: {caller: string;target: string;sig: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.canCall('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get canCallEvent() {
                return this._canCallWatcher;
            }
        }
            export class Authorization extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Authorization","networks":{},"abi":[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]})    
                }
        

            

            public async terminate(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.terminate({ from: params.options.from })
            }
        
            private _terminateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.terminate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get terminateEvent() {
                return this._terminateWatcher;
            }
        

            

            public async setOwner(params: {newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setOwner(params.newOwner, { from: params.options.from })
            }
        
            private _setOwnerWatcher = {
                watch: async (cb: (args: {newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setOwner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setOwnerEvent() {
                return this._setOwnerWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async authority(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.authority.call({ from: params.options.from })
            }
        
            private _authorityWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.authority('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get authorityEvent() {
                return this._authorityWatcher;
            }
        }
            export class CompanyFactory extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"CompanyFactory","networks":{"1512492879106":{"events":{},"links":{},"address":"0x8f1fca2d7b94c3b9d02020d285aa249a99a53e75"}},"abi":[{"constant":true,"inputs":[],"name":"getCompanies","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"addCompany","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_exchangeContract","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"}],"name":"companyCreated","type":"event"}]})    
                }
        

            

            public async getCompanies(params: {options: { from: string }}): Promise<string[] | null> {
                const instance = await this._getInstance();
                return await instance.getCompanies.call({ from: params.options.from })
            }
        
            private _getCompaniesWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.getCompanies('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getCompaniesEvent() {
                return this._getCompaniesWatcher;
            }
        

            

            public async exchangeContract(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.exchangeContract.call({ from: params.options.from })
            }
        
            private _exchangeContractWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.exchangeContract('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get exchangeContractEvent() {
                return this._exchangeContractWatcher;
            }
        

            

            public async addCompany(params: {name: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.addCompany(params.name, { from: params.options.from })
            }
        
            private _addCompanyWatcher = {
                watch: async (cb: (args: {name: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.addCompany('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get addCompanyEvent() {
                return this._addCompanyWatcher;
            }
        
            private _companyCreatedWatcher = {
                watch: async (cb: (args: {name: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.companyCreated('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get companyCreatedEvent() {
                return this._companyCreatedWatcher;
            }
        }
            export class Migrations extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Migrations","networks":{"1512492879106":{"events":{},"links":{},"address":"0x17d746ebeaf69edaa1b234d1fb6f1b4bd939efeb"}},"abi":[{"constant":false,"inputs":[{"name":"new_address","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"last_completed_migration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"completed","type":"uint256"}],"name":"setCompleted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]})    
                }
        

            

            public async upgrade(params: {new_address: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.upgrade(params.new_address, { from: params.options.from })
            }
        
            private _upgradeWatcher = {
                watch: async (cb: (args: {new_address: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.upgrade('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get upgradeEvent() {
                return this._upgradeWatcher;
            }
        

            

            public async last_completed_migration(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.last_completed_migration.call({ from: params.options.from })
            }
        
            private _last_completed_migrationWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.last_completed_migration('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get last_completed_migrationEvent() {
                return this._last_completed_migrationWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async setCompleted(params: {completed: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setCompleted(params.completed, { from: params.options.from })
            }
        
            private _setCompletedWatcher = {
                watch: async (cb: (args: {completed: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setCompleted('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setCompletedEvent() {
                return this._setCompletedWatcher;
            }
        }
            export class ExchangeRates extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"ExchangeRates","networks":{"1512492879106":{"events":{},"links":{},"address":"0x33e3f62341a241beade677c619702aa1657d2a38"}},"abi":[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_currency","type":"bytes32"}],"name":"getCurrencyRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"currencies","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_currency","type":"bytes32"}],"name":"isCurrencyAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newDelay","type":"uint256"}],"name":"setDelay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}]})    
                }
        

            

            public async terminate(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.terminate({ from: params.options.from })
            }
        
            private _terminateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.terminate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get terminateEvent() {
                return this._terminateWatcher;
            }
        

            

            public async setOwner(params: {newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setOwner(params.newOwner, { from: params.options.from })
            }
        
            private _setOwnerWatcher = {
                watch: async (cb: (args: {newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setOwner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setOwnerEvent() {
                return this._setOwnerWatcher;
            }
        

            

            public async getCurrencyRate(params: {_currency: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.getCurrencyRate.call(params._currency, { from: params.options.from })
            }
        
            private _getCurrencyRateWatcher = {
                watch: async (cb: (args: {_currency: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getCurrencyRate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getCurrencyRateEvent() {
                return this._getCurrencyRateWatcher;
            }
        

            

            public async isCurrencyAllowed(params: {_currency: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.isCurrencyAllowed.call(params._currency, { from: params.options.from })
            }
        
            private _isCurrencyAllowedWatcher = {
                watch: async (cb: (args: {_currency: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.isCurrencyAllowed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get isCurrencyAllowedEvent() {
                return this._isCurrencyAllowedWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async authority(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.authority.call({ from: params.options.from })
            }
        
            private _authorityWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.authority('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get authorityEvent() {
                return this._authorityWatcher;
            }
        

            

            public async setDelay(params: {newDelay: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setDelay(params.newDelay, { from: params.options.from })
            }
        
            private _setDelayWatcher = {
                watch: async (cb: (args: {newDelay: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setDelay('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setDelayEvent() {
                return this._setDelayWatcher;
            }
        }
            export class PropertyAuthority extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"PropertyAuthority","networks":{},"abi":[{"constant":true,"inputs":[{"name":"caller","type":"address"},{"name":"target","type":"address"},{"name":"sig","type":"bytes4"}],"name":"canCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async canCall(params: {caller: string;
target: string;
sig: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.canCall.call(params.caller, params.target, params.sig, { from: params.options.from })
            }
        
            private _canCallWatcher = {
                watch: async (cb: (args: {caller: string;target: string;sig: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.canCall('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get canCallEvent() {
                return this._canCallWatcher;
            }
        }
            export class StayLinkedList extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"StayLinkedList","networks":{},"abi":[{"constant":true,"inputs":[{"name":"assetId","type":"uint256"},{"name":"from","type":"uint256"},{"name":"to","type":"uint256"}],"name":"getNodesBetween","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async getNodesBetween(params: {assetId: string;
from: string;
to: string;
options: { from: string }}): Promise<string[] | null> {
                const instance = await this._getInstance();
                return await instance.getNodesBetween.call(params.assetId, params.from, params.to, { from: params.options.from })
            }
        
            private _getNodesBetweenWatcher = {
                watch: async (cb: (args: {assetId: string;from: string;to: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getNodesBetween('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getNodesBetweenEvent() {
                return this._getNodesBetweenWatcher;
            }
        }
            export class Property extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Property","networks":{},"abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"assetId","type":"uint256"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"}],"name":"addStay","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"assetId","type":"uint256"},{"name":"stayId","type":"uint256"}],"name":"getStay","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"assetId","type":"uint256"},{"name":"from","type":"uint256"},{"name":"to","type":"uint256"}],"name":"getStays","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"currency","type":"bytes32"}],"name":"addAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"lastMetadataHashForAsset","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"hash","type":"string"}],"name":"addMetadataHashForAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"stays","outputs":[{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"user","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"assetId","type":"uint256"},{"name":"from","type":"uint256"},{"name":"to","type":"uint256"}],"name":"getNodesBetween","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getAsset","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfAssets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"assetId","type":"uint256"},{"name":"stayDurationInDays","type":"uint256"}],"name":"getStayPriceInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_owner","type":"address"},{"name":"_exchangeContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"}]})    
                }
        

            

            public async name(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.name.call({ from: params.options.from })
            }
        
            private _nameWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.name('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get nameEvent() {
                return this._nameWatcher;
            }
        

            

            public async terminate(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.terminate({ from: params.options.from })
            }
        
            private _terminateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.terminate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get terminateEvent() {
                return this._terminateWatcher;
            }
        

            

            public async addStay(params: {assetId: string;
startTime: string;
endTime: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.addStay(params.assetId, params.startTime, params.endTime, { from: params.options.from })
            }
        
            private _addStayWatcher = {
                watch: async (cb: (args: {assetId: string;startTime: string;endTime: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.addStay('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get addStayEvent() {
                return this._addStayWatcher;
            }
        

            

            public async setOwner(params: {newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setOwner(params.newOwner, { from: params.options.from })
            }
        
            private _setOwnerWatcher = {
                watch: async (cb: (args: {newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setOwner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setOwnerEvent() {
                return this._setOwnerWatcher;
            }
        

            

            public async getStay(params: {assetId: string;
stayId: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.getStay.call(params.assetId, params.stayId, { from: params.options.from })
            }
        
            private _getStayWatcher = {
                watch: async (cb: (args: {assetId: string;stayId: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getStay('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getStayEvent() {
                return this._getStayWatcher;
            }
        

            

            public async getStays(params: {assetId: string;
from: string;
to: string;
options: { from: string }}): Promise<string[] | null> {
                const instance = await this._getInstance();
                return await instance.getStays.call(params.assetId, params.from, params.to, { from: params.options.from })
            }
        
            private _getStaysWatcher = {
                watch: async (cb: (args: {assetId: string;from: string;to: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getStays('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getStaysEvent() {
                return this._getStaysWatcher;
            }
        

            

            public async addAsset(params: {price: string;
currency: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.addAsset(params.price, params.currency, { from: params.options.from })
            }
        
            private _addAssetWatcher = {
                watch: async (cb: (args: {price: string;currency: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.addAsset('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get addAssetEvent() {
                return this._addAssetWatcher;
            }
        

            

            public async lastMetadataHashForAsset(params: {id: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.lastMetadataHashForAsset.call(params.id, { from: params.options.from })
            }
        
            private _lastMetadataHashForAssetWatcher = {
                watch: async (cb: (args: {id: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.lastMetadataHashForAsset('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get lastMetadataHashForAssetEvent() {
                return this._lastMetadataHashForAssetWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async addMetadataHashForAsset(params: {id: string;
hash: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.addMetadataHashForAsset(params.id, params.hash, { from: params.options.from })
            }
        
            private _addMetadataHashForAssetWatcher = {
                watch: async (cb: (args: {id: string;hash: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.addMetadataHashForAsset('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get addMetadataHashForAssetEvent() {
                return this._addMetadataHashForAssetWatcher;
            }
        

            

            public async authority(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.authority.call({ from: params.options.from })
            }
        
            private _authorityWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.authority('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get authorityEvent() {
                return this._authorityWatcher;
            }
        

            

            public async stays(params: {param0: string;
param1: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.stays.call(params.param0, params.param1, { from: params.options.from })
            }
        
            private _staysWatcher = {
                watch: async (cb: (args: {param0: string;param1: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.stays('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get staysEvent() {
                return this._staysWatcher;
            }
        

            

            public async getNodesBetween(params: {assetId: string;
from: string;
to: string;
options: { from: string }}): Promise<string[] | null> {
                const instance = await this._getInstance();
                return await instance.getNodesBetween.call(params.assetId, params.from, params.to, { from: params.options.from })
            }
        
            private _getNodesBetweenWatcher = {
                watch: async (cb: (args: {assetId: string;from: string;to: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getNodesBetween('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getNodesBetweenEvent() {
                return this._getNodesBetweenWatcher;
            }
        

            

            public async getAsset(params: {id: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.getAsset.call(params.id, { from: params.options.from })
            }
        
            private _getAssetWatcher = {
                watch: async (cb: (args: {id: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getAsset('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getAssetEvent() {
                return this._getAssetWatcher;
            }
        

            

            public async numberOfAssets(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.numberOfAssets.call({ from: params.options.from })
            }
        
            private _numberOfAssetsWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.numberOfAssets('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get numberOfAssetsEvent() {
                return this._numberOfAssetsWatcher;
            }
        

            

            public async getStayPriceInWei(params: {assetId: string;
stayDurationInDays: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.getStayPriceInWei.call(params.assetId, params.stayDurationInDays, { from: params.options.from })
            }
        
            private _getStayPriceInWeiWatcher = {
                watch: async (cb: (args: {assetId: string;stayDurationInDays: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getStayPriceInWei('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getStayPriceInWeiEvent() {
                return this._getStayPriceInWeiWatcher;
            }
        }
            export class strings extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"strings","networks":{},"abi":[]})    
                }
        }
            export class OraclizeAddrResolverI extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"OraclizeAddrResolverI","networks":{},"abi":[{"constant":false,"inputs":[],"name":"getAddress","outputs":[{"name":"_addr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async getAddress(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.getAddress({ from: params.options.from })
            }
        
            private _getAddressWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.getAddress('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getAddressEvent() {
                return this._getAddressWatcher;
            }
        }
            export class usingOraclize extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"usingOraclize","networks":{},"abi":[{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        }
            export class OraclizeI extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"OraclizeI","networks":{},"abi":[{"constant":false,"inputs":[{"name":"_datasource","type":"string"},{"name":"gaslimit","type":"uint256"}],"name":"getPrice","outputs":[{"name":"_dsprice","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_datasource","type":"string"}],"name":"getPrice","outputs":[{"name":"_dsprice","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_coupon","type":"string"}],"name":"useCoupon","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proofType","type":"bytes1"}],"name":"setProofType","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_timestamp","type":"uint256"},{"name":"_datasource","type":"string"},{"name":"_arg1","type":"string"},{"name":"_arg2","type":"string"}],"name":"query2","outputs":[{"name":"_id","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_timestamp","type":"uint256"},{"name":"_datasource","type":"string"},{"name":"_argN","type":"bytes"}],"name":"queryN","outputs":[{"name":"_id","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_timestamp","type":"uint256"},{"name":"_datasource","type":"string"},{"name":"_arg1","type":"string"},{"name":"_arg2","type":"string"},{"name":"_gaslimit","type":"uint256"}],"name":"query2_withGasLimit","outputs":[{"name":"_id","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"randomDS_getSessionPubKeyHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_timestamp","type":"uint256"},{"name":"_datasource","type":"string"},{"name":"_arg","type":"string"}],"name":"query","outputs":[{"name":"_id","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"cbAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_timestamp","type":"uint256"},{"name":"_datasource","type":"string"},{"name":"_arg","type":"string"},{"name":"_gaslimit","type":"uint256"}],"name":"query_withGasLimit","outputs":[{"name":"_id","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_timestamp","type":"uint256"},{"name":"_datasource","type":"string"},{"name":"_argN","type":"bytes"},{"name":"_gaslimit","type":"uint256"}],"name":"queryN_withGasLimit","outputs":[{"name":"_id","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_gasPrice","type":"uint256"}],"name":"setCustomGasPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_config","type":"bytes32"}],"name":"setConfig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            
            private $getPriceGuard0(params: any): params is {_datasource: string;
gaslimit: string;
options: { from: string }} {
                return '_datasource' in params && 'gaslimit' in params
            }
        

            private $getPriceGuard1(params: any): params is {_datasource: string;
options: { from: string }} {
                return '_datasource' in params
            }
        

            public async getPrice(params: {_datasource: string;
gaslimit: string;
options: { from: string }} | {_datasource: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                
                if(this.$getPriceGuard0(params)) {
                    return await instance.getPrice(params._datasource, params.gaslimit, { from: params.options.from })
                }
            

                if(this.$getPriceGuard1(params)) {
                    return await instance.getPrice(params._datasource, { from: params.options.from })
                }
            
return null
            }
        
            private _getPriceWatcher = {
                watch: async (cb: (args: {_datasource: string;gaslimit: string} | {_datasource: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.getPrice('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get getPriceEvent() {
                return this._getPriceWatcher;
            }
        

            

            public async useCoupon(params: {_coupon: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.useCoupon(params._coupon, { from: params.options.from })
            }
        
            private _useCouponWatcher = {
                watch: async (cb: (args: {_coupon: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.useCoupon('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get useCouponEvent() {
                return this._useCouponWatcher;
            }
        

            

            public async setProofType(params: {_proofType: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setProofType(params._proofType, { from: params.options.from })
            }
        
            private _setProofTypeWatcher = {
                watch: async (cb: (args: {_proofType: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setProofType('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setProofTypeEvent() {
                return this._setProofTypeWatcher;
            }
        

            

            public async query2(params: {_timestamp: string;
_datasource: string;
_arg1: string;
_arg2: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.query2(params._timestamp, params._datasource, params._arg1, params._arg2, { from: params.options.from })
            }
        
            private _query2Watcher = {
                watch: async (cb: (args: {_timestamp: string;_datasource: string;_arg1: string;_arg2: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.query2('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get query2Event() {
                return this._query2Watcher;
            }
        

            

            public async queryN(params: {_timestamp: string;
_datasource: string;
_argN: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.queryN(params._timestamp, params._datasource, params._argN, { from: params.options.from })
            }
        
            private _queryNWatcher = {
                watch: async (cb: (args: {_timestamp: string;_datasource: string;_argN: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.queryN('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get queryNEvent() {
                return this._queryNWatcher;
            }
        

            

            public async query2_withGasLimit(params: {_timestamp: string;
_datasource: string;
_arg1: string;
_arg2: string;
_gaslimit: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.query2_withGasLimit(params._timestamp, params._datasource, params._arg1, params._arg2, params._gaslimit, { from: params.options.from })
            }
        
            private _query2_withGasLimitWatcher = {
                watch: async (cb: (args: {_timestamp: string;_datasource: string;_arg1: string;_arg2: string;_gaslimit: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.query2_withGasLimit('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get query2_withGasLimitEvent() {
                return this._query2_withGasLimitWatcher;
            }
        

            

            public async randomDS_getSessionPubKeyHash(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.randomDS_getSessionPubKeyHash({ from: params.options.from })
            }
        
            private _randomDS_getSessionPubKeyHashWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.randomDS_getSessionPubKeyHash('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get randomDS_getSessionPubKeyHashEvent() {
                return this._randomDS_getSessionPubKeyHashWatcher;
            }
        

            

            public async query(params: {_timestamp: string;
_datasource: string;
_arg: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.query(params._timestamp, params._datasource, params._arg, { from: params.options.from })
            }
        
            private _queryWatcher = {
                watch: async (cb: (args: {_timestamp: string;_datasource: string;_arg: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.query('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get queryEvent() {
                return this._queryWatcher;
            }
        

            

            public async cbAddress(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.cbAddress.call({ from: params.options.from })
            }
        
            private _cbAddressWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.cbAddress('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get cbAddressEvent() {
                return this._cbAddressWatcher;
            }
        

            

            public async query_withGasLimit(params: {_timestamp: string;
_datasource: string;
_arg: string;
_gaslimit: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.query_withGasLimit(params._timestamp, params._datasource, params._arg, params._gaslimit, { from: params.options.from })
            }
        
            private _query_withGasLimitWatcher = {
                watch: async (cb: (args: {_timestamp: string;_datasource: string;_arg: string;_gaslimit: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.query_withGasLimit('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get query_withGasLimitEvent() {
                return this._query_withGasLimitWatcher;
            }
        

            

            public async queryN_withGasLimit(params: {_timestamp: string;
_datasource: string;
_argN: string;
_gaslimit: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.queryN_withGasLimit(params._timestamp, params._datasource, params._argN, params._gaslimit, { from: params.options.from })
            }
        
            private _queryN_withGasLimitWatcher = {
                watch: async (cb: (args: {_timestamp: string;_datasource: string;_argN: string;_gaslimit: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.queryN_withGasLimit('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get queryN_withGasLimitEvent() {
                return this._queryN_withGasLimitWatcher;
            }
        

            

            public async setCustomGasPrice(params: {_gasPrice: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setCustomGasPrice(params._gasPrice, { from: params.options.from })
            }
        
            private _setCustomGasPriceWatcher = {
                watch: async (cb: (args: {_gasPrice: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setCustomGasPrice('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setCustomGasPriceEvent() {
                return this._setCustomGasPriceWatcher;
            }
        

            

            public async setConfig(params: {_config: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setConfig(params._config, { from: params.options.from })
            }
        
            private _setConfigWatcher = {
                watch: async (cb: (args: {_config: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setConfig('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setConfigEvent() {
                return this._setConfigWatcher;
            }
        }