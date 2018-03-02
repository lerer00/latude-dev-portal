import * as React from 'react';
import Authentication from '../../services/authentication/authentication';
import { Button, IButtonState } from '../button';
import './index.css';

export namespace LoginControl {
    export interface Props {
        // empty
    }

    export interface State {
        isLogin: boolean;
    }
}

class LoginControl extends React.Component<LoginControl.Props, LoginControl.State> {
    constructor(props?: LoginControl.Props, context?: any) {
        super(props, context);

        this.state = {
            isLogin: false
        };

        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLoginClick() {
        Authentication.getInstance().login().then((result: any) => {
            this.setState({
                isLogin: true
            });
        }).catch((error: any) => {
            this.setState({
                isLogin: false
            });
        });
    }

    handleLogoutClick() {
        Authentication.getInstance().logout();
        this.setState({
            isLogin: false
        });
    }

    componentDidMount() {
        this.setState({
            isLogin: Authentication.getInstance().isLogin()
        });
    }

    render() {
        let greeting = null;
        if (this.state.isLogin) {
            greeting = (
                <div>
                    <p className='greeter'> current account:
                        <span>
                            {Authentication.getInstance().getSelectedAccount()}
                        </span>
                    </p>
                    <Button text='Logout' state={IButtonState.error} action={this.handleLogoutClick} />
                </div>);
        } else {
            greeting = <Button text='Login' state={IButtonState.default} action={this.handleLoginClick} />;
        }

        return (
            <div className='login-control'>
                {greeting}
            </div>
        );
    }
}

export default LoginControl;