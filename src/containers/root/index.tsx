import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../../containers/home';
import Properties from '../../containers/properties';
import Property from '../../containers/property';
import Asset from '../../containers/asset';
import Header from '../../layouts/header';
import Footer from '../../layouts/footer';
import Menu from '../../layouts/menu';
import './index.css';

const { ToastContainer } = require('react-toastify');
import 'react-toastify/dist/ReactToastify.min.css';
import './toast.css';

export namespace Root {
  export interface Props {
    // empty
  }

  export interface State {
    // empty
  }
}

class Root extends React.Component<Root.Props, Root.State> {
  constructor(props?: Root.Props, context?: any) {
    super(props, context);
  }

  render() {
    return (
      <div className='home'>
        <ToastContainer
          position='top-right'
          type='default'
          autoClose={4500}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          pauseOnHover={true}
        />
        <Header />
        <Menu />
        <Switch>
          <Route exact={true} path='/' component={Home} />
          <Route exact={true} path='/properties' component={Properties} />
          <Route exact={true} path='/properties/:pid' component={Property} />
          <Route exact={true} path='/properties/:pid/assets/:aid' component={Asset} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Root;
