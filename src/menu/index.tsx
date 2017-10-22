import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';

const egoBuilding1 = require('../img/ego/building-1.svg');
const egoMultiPlatform = require('../img/ego/multi-platform.svg');

export namespace Menu {
    export interface Props {
        // empty
    }

    export interface State {
        // empty
    }
}

class Menu extends React.Component<Menu.Props, Menu.State> {
    render() {
        return (
            <section className="menu">
                <div className="content">
                    <NavLink exact={true} className="link" activeClassName="active" to="/">
                        <img className="icon" src={egoMultiPlatform} />
                        <p>Home</p>
                    </NavLink>
                    <NavLink className="link" activeClassName="active" to="/companies">
                        <img className="icon" src={egoBuilding1} />
                        <p>Companies</p>
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Menu;