import * as React from 'react';
import './index.css';
import Ethereum from '../utilities/ethereum';

const contract = require('truffle-contract');
const PropertyContract = require('../truffle-build/contracts/Property.json');
const propertyContract = contract(PropertyContract);

export namespace PropertyDetail {
    export interface Props {
        match: any;
    }

    export interface State {
        web3: any;
        property: any;
        balance: number;
    }
}

class PropertyDetail extends React.Component<PropertyDetail.Props, PropertyDetail.State> {
    constructor(props?: PropertyDetail.Props, context?: any) {
        super(props, context);

        this.state = {
            web3: null,
            property: {
                name: ''
            },
            balance: -1
        };
    }

    componentWillMount() {
        var ethereum = new Ethereum();
        var web3 = ethereum.getWeb3();
        this.setState({
            web3: web3
        });
    }

    componentDidMount() {
        this.getName();
    }

    getName() {
        propertyContract.setProvider(this.state.web3.currentProvider);
        var propertyInstance: any;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.id).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.getName.call();
            }).then((result: any) => {
                this.setState({
                    property: {
                        name: result,
                    }
                });
                return propertyInstance.getBalance.call();
            }).then((result: any) => {
                this.setState({
                    balance: this.state.web3.utils.fromWei(result.toNumber())
                });
            });
        });
    }

    render() {
        return (
            <section className="property-detail">
                <div className="content">
                    <div className="description">
                        <span className="address">address: {this.props.match.params.id}</span>
                        <span className="balance">balance: {this.state.balance} ether</span>
                        <p className="name">{this.state.property.name}</p>
                        <p>This place will be to display the whole asset struct plus metadata from ipfs or ipdb will do that tomorrow enough for tonight.</p>
                    </div>
                </div>
            </section>
        );
    }
}

export default PropertyDetail;