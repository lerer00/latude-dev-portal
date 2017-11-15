import * as React from 'react';
import Breadcrumb from './breadcrumb';
import './index.css';

export namespace Breadcrumbs {
    export interface Props {
        routes: Array<Crumb>;
    }

    export interface State {
        // empty
    }

    export interface Context {
        // empty
    }

    export interface Crumb {
        name: string;
        path: string;
        active: boolean;
    }
}

export class Breadcrumbs extends React.Component<Breadcrumbs.Props, Breadcrumbs.State> {
    constructor(props?: Breadcrumbs.Props, context?: Breadcrumbs.Context) {
        super(props, context);
    }

    render() {
        return (
            <section className='breadcrumbs'>
                {this.props.routes.map((route) => <Breadcrumb key={route.path} active={route.active} name={route.name} path={route.path} />)}
            </section>
        );
    }
}