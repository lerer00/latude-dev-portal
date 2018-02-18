import * as React from 'react';
import * as PropTypes from 'prop-types';
import './index.css';

export namespace Header {
    export interface Props {
        // empty
    }

    export interface State {
        // empty
    }
}

class Header extends React.Component<Header.Props, Header.State> {
    constructor(props?: Header.Props, context?: any) {
        super(props, context);
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    render() {
        return (
            <header className='header'>
                <div className='content'>
                    <h1 className='title'>latude</h1>
                    <p className='subtitle'>owner</p>
                </div>
            </header>
        );
    }
}

export default Header;