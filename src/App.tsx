import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import './App.css';

class App extends React.Component {
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