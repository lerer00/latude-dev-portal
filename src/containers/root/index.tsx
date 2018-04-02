import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../../containers/home';
import Companies from '../../containers/companies';
import Company from '../../containers/company';
import Property from '../../containers/property';
import AssetDetail from '../../assetDetail';
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
          <Route exact={true} path='/companies' component={Companies} />
          <Route exact={true} path='/companies/:cid' component={Company} />
          <Route exact={true} path='/companies/:cid/properties/:pid' component={Property} />
          <Route exact={true} path='/companies/:cid/properties/:pid/assets/:aid' component={AssetDetail} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Root;
