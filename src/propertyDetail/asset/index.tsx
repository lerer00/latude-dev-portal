import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

const egoBuilding2 = require('../../img/ego/building-2.svg');

export namespace Asset {
    export interface Props {
        url: string;
        asset: any
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
                <p className="id">Asset {this.props.asset.id}</p>
                <p className="price">{this.props.asset.price}<span className="currency">{this.props.asset.currency}</span></p>
                <NavLink className="detail" to={this.props.url + "/assets/" + this.props.asset.id}>
                    <img className="plus" src={egoBuilding2} />
                </NavLink>
            </section>
        );
    }
}

export default Asset;