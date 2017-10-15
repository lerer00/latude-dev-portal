import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Compagnies from '../companies';
import CompanyDetail from '../companyDetail';
import PropertyDetail from '../propertyDetail';
import Header from '../header';
import Footer from '../footer';
import Default from './default';
import Menu from '../menu';
import './index.css';

const { ToastContainer } = require('react-toastify');
// const ipfsAPI = require('ipfs-api')
// const bl = require('bl');
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

  // init(){
  //   var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
  //   const files = [
  //     {
  //       path: '/src/home/myfile.json',
  //       content: "{\"name\": \"Stessie\"}"
  //     }
  //   ]
  //   ipfs.files.add(files, null, (err: any, result: any) => {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log(result)
  //     this.getFile(result[0].hash);
  //   })
  // }

  // getFile(hash: string){
  //   var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
  //   ipfs.files.cat(hash, (err: any, stream: any) => {
  //     if (err) {
  //       throw err;
  //     }
  //     stream.pipe(bl((e: any, d: any) => {
  //       if(e){
  //         throw err;
  //       }
  //       console.log(d.toString());
  //       var x = JSON.parse(d.toString());
  //       console.log(x);
  //     }));
  //   });
  // }

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
          <Route exact={true} path="/compagnies/:address" component={CompanyDetail} />
          <Route exact={true} path="/compagnies/:address/properties/:id" component={PropertyDetail} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Home;
