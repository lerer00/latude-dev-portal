import * as React from 'react';
import * as PropTypes from 'prop-types';
import './index.css';
import { NavLink } from 'react-router-dom';
import { egoCogDouble } from '../../../img/index';

const web3 = window['web3'];
const contract = require('truffle-contract');
const CompanyContract = require('latude-contracts/build/contracts/Company.json');
const companyContract = contract(CompanyContract);

export namespace Company {
    export interface Props {
        id: string;
    }

    export interface State {
        name: string;
        balance: number;
    }
}

class Company extends React.Component<Company.Props, Company.State> {
    constructor(props?: Company.Props, context?: any) {
        super(props, context);

        this.state = {
            name: '',
            balance: -1
        };
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentDidMount() {
        companyContract.setProvider(web3.currentProvider);
        this.getName();
        this.getBalance();
    }

    getName() {
        companyContract.at(this.props.id).then((instance: any) => {
            return instance.name.call({ from: this.context.web3.selectedAccount });
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
            <section className='company'>
                <div className='description'>
                    <span className='address'>address: {this.props.id}</span>
                    <span className='balance'>balance: {this.state.balance} ether</span>
                    <p className='name'>{this.state.name}</p>
                    <NavLink className='detail' to={'/companies/' + this.props.id}>
                        <img className='plus' src={egoCogDouble} />
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Company;