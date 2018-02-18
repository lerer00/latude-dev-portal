import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import Authentication from './services/sessions/authentication';
import './App.css';

class App extends React.Component {
  constructor(props?: any, context?: any) {
    super(props, context);
  }

  static contextTypes = {
    web3: PropTypes.object
  };

  componentDidMount() {
    var authentication = new Authentication(this.context.web3);
    if (authentication.isAuthenticated()) {
      return;
    }

    authentication.authenticate()
      .then((result) => {
        console.log('Authentication success: ' + result);
      })
      .catch((error) => {
        console.log('Authentication error: ' + error);
      });
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