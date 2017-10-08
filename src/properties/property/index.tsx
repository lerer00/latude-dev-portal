import * as React from 'react';
import './index.css';

const contract = require('truffle-contract');
const PropertyContract = require('../../truffle-build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const egoLocation = require('../../img/ego/location.svg');

export namespace Property {
    export interface Props {
        web3: any;
        id: string;
    }

    export interface State {
        property: any;
        balance: number;
    }
}

class Property extends React.Component<Property.Props, Property.State> {
    constructor(props?: Property.Props, context?: any) {
        super(props, context);

        this.state = {
            property: {
                name: '',
                country: '',
                city: ''
            },
            balance: -1
        };
    }

    componentWillMount() {
        this.getPartial();
    }

    getPartial() {
        propertyContract.setProvider(this.props.web3.currentProvider);
        var propertyInstance: any;
        this.props.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.id).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.getPartial.call();
            }).then((result: any) => {
                this.setState({
                    property: {
                        name: result[0],
                        country: result[1],
                        city: result[2]
                    }
                });
                return propertyInstance.getBalance.call();
            }).then((result: any) => {
                this.setState({
                    balance: this.props.web3.utils.fromWei(result.toNumber())
                });
            });
        });
    }

    render() {
        return (
            <section className="property">
                <div className="description">
                    <span className="address">address: {this.props.id}</span>
                    <span className="balance">balance: {this.state.balance} ether</span>
                    <p className="name">{this.state.property.name}</p>
                    <p className="location">
                        <img src={egoLocation} className="icon" alt="flag" />
                        {this.state.property.country},{''}{this.state.property.city}
                    </p>
                </div>
            </section>
        );
    }
}

export default Property;