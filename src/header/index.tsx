import * as React from 'react';
import * as PropTypes from 'prop-types';
import Authentication from '../services/sessions/authentication';
import './index.css';

const egoLogout = require('../img/ego/logout-1.svg');

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

    componentDidMount() {
        // this.checkAuthenticationState();
    }

    checkAuthenticationState() {
        var authentication = new Authentication(this.context.web3);
        if (!authentication.isAuthenticate) {
            authentication.authenticate();
        }
    }

    render() {
        return (
            <header className='header'>
                <div className='content'>
                    <h1 className='title'>latude</h1>
                    <p className='subtitle'>owner</p>
                    <div className='right-menu'>
                        <div className='login-action'>
                            <img src={egoLogout} />
                        </div>
                        {/* <div className='logout-action'>
                            <img src={egoLogout} />
                        </div> */}
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;