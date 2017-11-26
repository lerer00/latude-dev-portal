import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './home';
import './App.css';
import store from './store';
class App extends React.Component {
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