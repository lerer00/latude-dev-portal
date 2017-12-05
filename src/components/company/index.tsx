import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { egoLighthouse } from '../../img/index';

export namespace Company {
    export interface Props {
        company: {
            id: string;
            name: string;
            balance: number;
        };
    }
}

class Company extends React.Component<Company.Props> {
    constructor(props?: Company.Props) {
        super(props);
    }

    render() {
        return (
            <section className='company'>
                <div className='description'>
                    <span className='address'>address: {this.props.company.id}</span>
                    <span className='balance'>balance: {this.props.company.balance} ether</span>
                    <p className='name'>{this.props.company.name}</p>
                    <NavLink className='detail' to={'/companies/' + this.props.company.id}>
                        <img className='plus' src={egoLighthouse} />
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Company;