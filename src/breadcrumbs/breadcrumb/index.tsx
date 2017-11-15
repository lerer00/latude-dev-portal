import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

export namespace Breadcrumb {
    export interface Props {
        name: string;
        path: string;
        active: boolean;
    }

    export interface State {
        // empty
    }

    export interface Context {
        // empty
    }
}

class Breadcrumb extends React.Component<Breadcrumb.Props, Breadcrumb.State> {
    constructor(props?: Breadcrumb.Props, context?: Breadcrumb.Context) {
        super(props, context);
    }

    render() {
        var breadcrumbContent;
        if (this.props.active) {
            breadcrumbContent = (
                <NavLink className='link' to={this.props.path}>
                    <p className='name'>
                        {this.props.name}
                    </p>
                </NavLink>
            );
        } else {
            breadcrumbContent = (
                <p className='disabled-link'>
                    {this.props.name}
                </p>
            );
        }

        return (
            <section className='breadcrumb'>
                {breadcrumbContent}
            </section>
        );
    }
}

export default Breadcrumb;