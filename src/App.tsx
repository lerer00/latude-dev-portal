import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './home';
import Authentication from './services/authentication/authentication';
import './App.css';
import store from './store';

class App extends React.Component {
  constructor(props?: any, context?: any) {
    super(props, context);
  }

  static contextTypes = {
    web3: PropTypes.object
  };

  componentWillMount() {
    Authentication.getInstance().setWeb3(this.context.web3);
  }

  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <div>
            <BrowserRouter>
              <Home />
            </BrowserRouter>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;