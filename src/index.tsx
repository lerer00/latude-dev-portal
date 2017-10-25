import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import './index.css';

const { Web3Provider } = require('react-web3');
const egowindowLock = require('./img/ego/window-lock.svg');
import './missingProvider.css';

var unlockWalletHtml = <div className='web3-needed'>
  <div className='content'>
    <img className='icon' src={egowindowLock} />
    <h1 className='title'>Web3 account is locked.</h1>
    <p className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
</div>;
var web3NeededHtml = <div className='web3-needed'>
  <div className='content'>
    <img className='icon' src={egowindowLock} />
    <h1 className='title'>Web3 provider is needed.</h1>
    <p className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
</div>

ReactDOM.render(
  <Web3Provider
    accountUnavailableScreen={() => unlockWalletHtml}
    web3UnavailableScreen={() => web3NeededHtml}>
    <App />
  </Web3Provider>,
  document.getElementById('root') as HTMLElement
);