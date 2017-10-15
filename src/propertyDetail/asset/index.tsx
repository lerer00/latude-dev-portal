import * as React from 'react';
import './index.css';

export namespace Asset {
    export interface Props {
        web3: any;
        id: string;
        price: number;
        currency: string;
    }

    export interface State {
        // empty
    }
}

class Asset extends React.Component<Asset.Props, Asset.State> {
    constructor(props?: Asset.Props, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <section className="asset">
                <p className="id">{this.props.id}</p>
                <p className="price">{this.props.price}<span className="currency">{this.props.currency}</span></p>
                <p className="bookings">bookings: {Math.floor((Math.random() * 10) + 1)}</p>
            </section>
        );
    }
}

export default Asset;