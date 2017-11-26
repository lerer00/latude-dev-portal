import * as React from 'react';
import * as PropTypes from 'prop-types';
import './index.css';
import { NavLink } from 'react-router-dom';

const web3 = window['web3'];
const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const egoSun1 = require('../img/ego/sun-1.svg');

export namespace Property {
    export interface Props {
        company: string;
        id: string;
    }

    export interface State {
        name: string;
        balance: number;
    }
}

class Property extends React.Component<Property.Props, Property.State> {
    constructor(props?: Property.Props, context?: any) {
        super(props, context);

        this.state = {
            name: '',
            balance: -1
        };
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentWillMount() {
        this.getName();
        this.getBalance();
    }

    getName() {
        var propertyInstance: any;
        propertyContract.setProvider(web3.currentProvider);
        propertyContract.at(this.props.id).then((instance: any) => {
            propertyInstance = instance;

            return propertyInstance.name.call({ from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                name: result
            });
        });
    }

    getBalance() {
        return web3.eth.getBalance(this.props.id, (error: any, balance: any) => {
            this.setState({
                balance: balance.toNumber() / 1000 / 1000 / 1000 / 1000 / 1000 / 1000
            });
        });
    }

    render() {
        return (
            <section className='property'>
                <div className='description'>
                    <span className='address'>address: {this.props.id}</span>
                    <span className='balance'>balance: {this.state.balance} ether</span>
                    <p className='name'>{this.state.name}</p>
                    <NavLink className='detail' to={'/companies/' + this.props.company + '/properties/' + this.props.id}>
                        <img className='plus' src={egoSun1} />
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Property;