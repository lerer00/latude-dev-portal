import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Compagnies from '../companies';
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

export namespace Home {
  export interface Props {
    // empty
  }

  export interface State {
    web3: any;
  }
}

class Home extends React.Component<Home.Props, Home.State> {
  constructor(props?: Home.Props, context?: any){
    super(props, context);
  }

  render() {
    return (
      <div className="home">
        <ToastContainer
          position="top-right"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <Header />
        <Menu />
        <Switch>
          <Route exact={true} path="/" component={Default} />
          <Route exact={true} path="/compagnies" component={Compagnies} />
          <Route exact={true} path="/compagnies/:cid" component={CompanyDetail} />
          <Route exact={true} path="/compagnies/:cid/properties/:pid" component={PropertyDetail} />
          <Route exact={true} path="/compagnies/:cid/properties/:pid/assets/:aid" component={AssetDetail} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Home;
