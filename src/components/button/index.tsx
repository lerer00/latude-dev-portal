import * as React from 'react';
import './index.css';

export namespace Button {
    export interface Props extends IButton {
        // empty
    }

    export interface State {
        // empty
    }

    export interface Context {
        // empty
    }
}

export interface IButton {
    text: string;
    state: IButtonState;
    action: Function;
}

export enum IButtonState {
    default = 0,
    success = 1,
    error = 2,
    warning = 3,
    info = 4
}

export class Button extends React.Component<Button.Props, Button.State> {
    constructor(props?: Button.Props, context?: Button.Context) {
        super(props, context);

        this.executeAction = this.executeAction.bind(this);
    }

    executeAction() {
        this.props.action();
    }

    render() {
        var wantedStyles = undefined;
        switch (this.props.state) {
            case IButtonState.default:
                wantedStyles = 'button default';
                break;
            case IButtonState.success:
                wantedStyles = 'button success';
                break;
            case IButtonState.error:
                wantedStyles = 'button error';
                break;
            case IButtonState.warning:
                wantedStyles = 'button warning';
                break;
            case IButtonState.info:
                wantedStyles = 'button info';
                break;
            default:
                wantedStyles = 'button default';
                break;
        }

        return (
            <button className={wantedStyles} onClick={() => this.executeAction()}>
                <span className='button-text'>{this.props.text}</span>
            </button>
        );
    }
}