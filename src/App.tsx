import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import Authentication from './services/authentication/authentication';
import './App.css';

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
      <div className='App'>
        <div>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;