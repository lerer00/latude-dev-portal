import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Companies from '../companies';
import CompanyDetail from '../companyDetail';
import PropertyDetail from '../propertyDetail';
import AssetDetail from '../assetDetail';
import Header from '../header';
import Footer from '../footer';
import Default from './default';
import Menu from '../menu';
import './index.css';

const { ToastContainer } = require('react-toastify');
import 'react-toastify/dist/ReactToastify.min.css';
import './toast.css';

export namespace Home {
  export interface Props {
    // empty
  }

  export interface State {
    // empty
  }
}

class Home extends React.Component<Home.Props, Home.State> {
  constructor(props?: Home.Props, context?: any) {
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
          <Route exact={true} path='/' component={Default} />
          <Route exact={true} path='/companies' component={Companies} />
          <Route exact={true} path='/companies/:cid' component={CompanyDetail} />
          <Route exact={true} path='/companies/:cid/properties/:pid' component={PropertyDetail} />
          <Route exact={true} path='/companies/:cid/properties/:pid/assets/:aid' component={AssetDetail} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Home;
