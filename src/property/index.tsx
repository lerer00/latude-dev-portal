import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const egoSun1 = require('../img/ego/sun-1.svg');

export namespace Property {
    export interface Props {
        company: string;
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
                name: ''
            },
            balance: -1
        };
    }

    componentWillMount() {
        this.getName();
    }

    getName() {
        var propertyInstance: any;
        propertyContract.setProvider(this.props.web3.currentProvider);
        propertyContract.at(this.props.id).then((instance: any) => {
            propertyInstance = instance;

            return propertyInstance.name.call();
        }).then((result: any) => {
            this.setState({
                property: {
                    name: result,
                }
            });
            return propertyInstance.getBalance.call();
        }).then((result: any) => {
            this.setState({
                balance: this.props.web3.utils.fromWei(result.toNumber())
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
                    <NavLink className="detail" to={"/companies/" + this.props.company + "/properties/" + this.props.id}>
                        <img className="plus" src={egoSun1} />
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Property;