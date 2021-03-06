import * as React from 'react';
import LoginControl from '../../components/loginControl';
import { NavLink } from 'react-router-dom';
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
    render() {
        return (
            <header className='header'>
                <div className='container'>
                    <div className='left content'>
                        <NavLink className='title' to={'/'} >
                            latude
                        </NavLink>
                        <p className='subtitle'>owner</p>
                    </div>
                    <div className='right content'>
                        <LoginControl />
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;