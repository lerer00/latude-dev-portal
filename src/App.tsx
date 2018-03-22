import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { egoNetwork, egoWarning } from './img/index';
import Home from './home';
import Authentication from './services/authentication/authentication';
import './App.css';
import store from './store';

var unknownNetwork = (
  <div className='web3-needed'>
    <div className='content'>
      <div className='modal-header'>
        <h1 className='title'>Unknown network</h1>
      </div>
      <div className='modal-content'>
        <div className='visual-tip'>
          <img className='tip' src={egoNetwork} />
          <img className='action' src={egoWarning} />
        </div>
        <p>
          This application is only deployed on the RinkeBy until a stable production version is available.
          Please switch your network to continue.
        </p>
      </div>
      <div className='modal-actions'>
        <button className='button'>Info</button>
      </div>
    </div>
  </div>
);

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
    var content;
    switch (this.context.web3.networkId) {
      // rinkeby
      case '4':
        content = <Home />;
        break;
      // ganache
      case '5777':
        content = <Home />;
        break;
      default:
        content = unknownNetwork;
    }

    return (
      <Provider store={store}>
        <div className='App'>
          <div>
            <BrowserRouter>
              {content}
            </BrowserRouter>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;