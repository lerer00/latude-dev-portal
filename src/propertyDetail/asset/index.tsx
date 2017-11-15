import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

const egoBuilding2 = require('../../img/ego/building-2.svg');

export namespace Asset {
    export interface Props {
        url: string;
        asset: any;
    }

    export interface State {
        // empty
    }
}

class Asset extends React.Component<any, Asset.State> {
    constructor(props?: Asset.Props, context?: any) {
        super(props, context);
    }

    // will need to be moved elsewhere
    toAscii = function (hex: string) {
        var str = '',
            i = 0,
            l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) { continue; } // this is added
            str += String.fromCharCode(code);
        }
        return str;
    };

    render() {
        return (
            <section className='asset'>
                <p className='id'>Asset {this.props.asset.id}</p>
                <p className='price'>{this.props.asset.price}<span className='currency'>{this.toAscii(this.props.asset.currency)}</span></p>
                <NavLink className='detail' to={this.props.url + '/assets/' + this.props.asset.id}>
                    <img className='plus' src={egoBuilding2} />
                </NavLink>
            </section>
        );
    }
}

export default Asset;