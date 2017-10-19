import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

const egoBuilding2 = require('../../img/ego/building-2.svg');

export namespace Asset {
    export interface Props {
        web3: any;
        id: number;
        name: string;
        price: number;
        currency: string;
        url: string;
    }

    export interface State {
        // empty
    }
}

class Asset extends React.Component<any, Asset.State> {
    constructor(props?: Asset.Props, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <section className="asset">
                <p className="id">{this.props.name}</p>
                <p className="price">{this.props.price}<span className="currency">{this.props.currency}</span></p>
                <p className="bookings">bookings: {Math.floor((Math.random() * 10) + 1)}</p>
                <NavLink className="detail" to={this.props.url + "/assets/" + this.props.id}>
                    <img className="plus" src={egoBuilding2} />
                </NavLink>
            </section>
        );
    }
}

export default Asset;