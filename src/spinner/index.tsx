import * as React from 'react';
import './index.css';

export namespace Spinner {
    export interface Props {
        // empty
    }

    export interface State {
        // empty
    }
}

class Spinner extends React.Component<Spinner.Props, Spinner.State> {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="spinner">
                <div className="bounce">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
                <p className="text">loading...</p>
            </div>
        );
    }
}

export default Spinner;