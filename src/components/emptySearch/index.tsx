import * as React from 'react';
import './index.css';

const egoCursorHand = require('../../img/ego/cursor-hand.svg');

export namespace EmptySearch {
    export interface Props {
        text: string;
    }

    export interface State {
        // empty
    }
}

class EmptySearch extends React.Component<EmptySearch.Props, EmptySearch.State> {
    constructor(props?: EmptySearch.Props, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <div className='empty-search'>
                <img className='icon' src={egoCursorHand} />
                <p className='text'>{this.props.text}</p>
            </div>
        );
    }
}

export default EmptySearch;