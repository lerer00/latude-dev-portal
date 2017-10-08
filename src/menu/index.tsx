import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';

const egoBuilding1 = require('../img/ego/building-1.svg');
const egoBuilding2 = require('../img/ego/building-2.svg');
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
                    <NavLink className="link" activeClassName="active" to="/compagnies">
                        <img className="icon" src={egoBuilding1} />
                        <p>Companies</p>
                    </NavLink>
                    <NavLink className="link" activeClassName="active" to="/properties">
                        <img className="icon" src={egoBuilding2} />
                        <p>Properties</p>
                    </NavLink>
                </div>
            </section>
        );
    }
}

export default Menu;