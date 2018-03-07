import * as React from 'react';
import * as PropTypes from 'prop-types';
import Company from './company';
import EmptySearch from '../components/emptySearch';
import { Breadcrumbs } from '../breadcrumbs';
import { Button, IButtonState } from '../components/button';
import Spinner from '../spinner';
import './index.css';

const web3 = window['web3'];
const Modal = require('react-modal');
// const { toast } = require('react-toastify');
const contract = require('truffle-contract');
const CompanyFactoryContract = require('../build/contracts/CompanyFactory.json');
const companyFactoryContract = contract(CompanyFactoryContract);
const egoCloseHexagon = require('../img/ego/close-hexagon.svg');
const egoBuilding3 = require('../img/ego/building-3.svg');
const egoAddHexagon1 = require('../img/ego/add-hexagon-1.svg');

const addCompanyModalStyles = {
  content: {
    padding: '16px',
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    overflow: 'none',
    borderRadius: '3px',
    borderColor: '#C0C0C0',
    boxShadow: '3px 3px 15px #7F7F7F',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  }
};

export namespace Companies {
  export interface Props {
    // empty
  }

  export interface State {
    loading: boolean;
    companies: Array<string>;
    addCompanyModalIsOpen: boolean;
    addCompany: any;
  }
}

class Companies extends React.Component<Companies.Props, Companies.State> {
  constructor() {
    super();

    this.state = {
      loading: true,
      companies: [],
      addCompanyModalIsOpen: false,
      addCompany: {
        name: ''
      }
    };

    this.addCompany = this.addCompany.bind(this);
    this.addCompanyOnRequestClose = this.addCompanyOnRequestClose.bind(this);
    this.addCompanyOnRequestOpen = this.addCompanyOnRequestOpen.bind(this);
    this.addCompanyHandleChanges = this.addCompanyHandleChanges.bind(this);
  }

  static contextTypes = {
    web3: PropTypes.object
  };

  componentWillMount() {
    companyFactoryContract.setProvider(web3.currentProvider);
    this.getCompanies();
    // companyFactoryContract.deployed().then((instance: any) => {
    //   instance.CompanyCreated('latest').watch(() => {
    //     this.getCompanies();
    //     this.setState({
    //       addCompanyModalIsOpen: false,
    //       addCompany: {
    //         name: 'latude inc.',
    //       }
    //     });
    //     toast.success('Success, company was added.', {
    //       position: toast.POSITION.BOTTOM_RIGHT
    //     });
    //   });
    // });
  }

  getCompanies() {
    companyFactoryContract.deployed().then((instance: any) => {
      return instance.getCompanies.call({ from: this.context.web3.selectedAccount });
    }).then((result: any) => {
      this.setState({
        companies: result,
        loading: false
      });
      this.forceUpdate();
    });
  }

  addCompany(e: any) {
    e.preventDefault();

    if (this.state.addCompany.name === '') {
      return;
    }

    companyFactoryContract.deployed().then((instance: any) => {
      return instance.addCompany(this.state.addCompany.name, { from: this.context.web3.selectedAccount });
    });
  }

  addCompanyOnRequestClose() {
    this.setState({
      addCompanyModalIsOpen: false
    });
  }

  addCompanyOnRequestOpen() {
    this.setState({
      addCompanyModalIsOpen: true
    });
  }

  addCompanyHandleChanges(propertyName: string, event: any) {
    var tmp = this.state.addCompany;
    tmp[propertyName] = event.target.value;
    this.setState({
      addCompany: tmp
    });
  }

  render() {
    var content;
    if (this.state.loading) {
      content = (
        <Spinner text='loading companies...' />
      );
    } else {
      if (this.state.companies.length > 0) {
        content = this.state.companies.map((id) =>
          <Company key={id} id={id} />
        );
      } else {
        content = <EmptySearch text='You do not have any companies...' />;
      }
    }

    const routes: Breadcrumbs.Crumb[] = [
      {
        name: 'Companies',
        path: '/companies',
        active: true,
      }
    ];

    return (
      <div className='companies' >
        <div className='container'>
          <Breadcrumbs routes={routes} />
          <div className='actions'>
            <Button text='Add company' state={IButtonState.default} action={this.addCompanyOnRequestOpen} />
          </div>
          <div className='content'>
            {content}
          </div>

          <Modal
            isOpen={this.state.addCompanyModalIsOpen}
            onRequestClose={this.addCompanyOnRequestClose}
            style={addCompanyModalStyles}
            contentLabel='Modal'
          >
            <div className='modal-header'>
              <h1 className='title'>Add company</h1>
              <img className='close' src={egoCloseHexagon} onClick={this.addCompanyOnRequestClose} />
            </div>
            <div className='modal-content'>
              <div className='visual-tip'>
                <img className='tip' src={egoBuilding3} />
                <img className='action' src={egoAddHexagon1} />
              </div>
              <p className='description'>Create the contract who will act as your company on the blockchain.
               This is only for architectural purpose since every property will now be created within this company.</p>
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td className='label'><label>Name:</label></td>
                      <td>
                        <input
                          className='value'
                          type='text'
                          value={this.state.addCompany.name}
                          placeholder='insert company name'
                          onChange={(e) => this.addCompanyHandleChanges('name', e)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
            <div className='modal-actions'>
              <button className='button' onClick={(e) => this.addCompany(e)}>Add</button>
              <button className='action close' onClick={this.addCompanyOnRequestClose}>Close</button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Companies;