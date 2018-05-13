import * as React from 'react';
import * as PropTypes from 'prop-types';
import './index.css';
import { NavLink } from 'react-router-dom';
import { egoCogDouble } from '../../../img/index';

const web3 = window['web3'];
const contract = require('truffle-contract');
const PropertyContract = require('latude-contracts/build/contracts/Property.json');
const propertyContract = contract(PropertyContract);

export namespace Property {
    export interface Props {
        id: string;
    }

    export interface State {
        status: IPropertyStatus;
        id: string;
        balance: number;
    }
}

enum IPropertyStatus {
    created = 0,
    deleted = 1,
}

class Property extends React.Component<Property.Props, Property.State> {
    constructor(props?: Property.Props, context?: any) {
        super(props, context);

        this.state = {
            status: IPropertyStatus.created,
            id: '',
            balance: -1
        };
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentDidMount() {
        this.getid();
        this.getBalance();
    }

    getid() {
        var propertyInstance: any;
        propertyContract.setProvider(web3.currentProvider);

        propertyContract.at(this.props.id).then((instance: any) => {
            propertyInstance = instance;

            return propertyInstance.id.call({ from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                id: result
            });
        }).catch((error: any) => {
            this.setState({
                status: IPropertyStatus.deleted
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
            <section className={'property ' + (this.state.status === IPropertyStatus.created ? 'created' : 'deleted')}>
                <div className='description'>
                    <span className='address'>address: {this.props.id}</span>
                    <span className='balance'>balance: {this.state.balance} ether</span>
                    <p className='identifier'>{this.state.id}</p>
                    <NavLink className='detail' to={'/properties/' + this.props.id}>
                        <img className='plus' src={egoCogDouble} />
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Property;