import * as React from 'react';
import './index.css';

export namespace Spinner {
    export interface Props {
        text: string;
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
            <div className='spinner'>
                <div className='bounce'>
                    <div className='bounce1' />
                    <div className='bounce2' />
                    <div className='bounce3' />
                </div>
                <p className='text'>{this.props.text}</p>
            </div>
        );
    }
}

export default Spinner;