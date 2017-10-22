import * as React from 'react';
import Breadcrumb from './breadcrumb'
import './index.css';

export interface IBreabcrumb {
    name: string,
    path: string,
    active: boolean
}

export namespace Breadcrumbs {
    export interface Props {
        routes: Array<IBreabcrumb>
    }

    export interface State {
        breadcrumbs: any
    }
}

class Breadcrumbs extends React.Component<Breadcrumbs.Props, Breadcrumbs.State> {
    constructor(props?: Breadcrumbs.Props, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <section className="breadcrumbs">
                {this.props.routes.map((route) => <Breadcrumb key={route.path} active={route.active} name={route.name} path={route.path} />)}
            </section>
        );
    }
}

export default Breadcrumbs;