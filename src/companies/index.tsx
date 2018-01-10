import * as React from 'react';
import * as PropTypes from 'prop-types';
import Company from './company';
import { Breadcrumbs } from '../breadcrumbs';
import Spinner from '../spinner';
import './index.css';

const web3 = window['web3'];
const Modal = require('react-modal');
const { toast } = require('react-toastify');
const contract = require('truffle-contract');
const CompanyFactoryContract = require('../build/contracts/CompanyFactory.json');
const companyFactoryContract = contract(CompanyFactoryContract);
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoPenChecklist = require('../img/ego/pen-checklist.svg');
const egoCursorHand = require('../img/ego/cursor-hand.svg');
import { CompanyFactory } from '../contracts';

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
        name: 'latude inc. (todo)'
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
    companyFactoryContract.deployed().then((instance: any) => {
      instance.CompanyCreated('latest').watch(() => {
        this.getCompanies();
        this.setState({
          addCompanyModalIsOpen: false,
          addCompany: {
            name: 'latude inc. (todo)',
          }
        });
        toast.success('Success, company was added.', {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
    });
  }

  async getCompanies() {
    const companies = await (new CompanyFactory()).getCompanies({
      senderAddress: this.context.web3.selectedAccount
    }) as string[];
    this.setState({
      companies,
      loading: false
    });
    this.forceUpdate();
  }

  addCompany(e: any) {
    e.preventDefault();

    if (this.state.addCompany.name === '') {
      return;
    }
    (new CompanyFactory()).addCompany({
      name: this.state.addCompany.name,
      senderAddress: this.context.web3.selectedAccount,
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
    var companiesContent;
    if (this.state.loading) {
      companiesContent = (
        <Spinner text='loading companies...' />
      );
    } else {
      if (this.state.companies.length > 0) {
        companiesContent = this.state.companies.map((id) =>
          <Company key={id} id={id} />
        );
      } else {
        companiesContent = (
          <div className='empty'>
            <img className='icon' src={egoCursorHand} />
            <p className='text'>No companies found...</p>
          </div>
        );
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
      <div className='companies'>
        <div className='content'>
          <Breadcrumbs routes={routes} />
          <button className='add-company' onClick={this.addCompanyOnRequestOpen}>
            <img className='add-company-icon' src={egoPenChecklist} />
            <span className='add-company-text'>Add company</span>
          </button>
          <Modal
            isOpen={this.state.addCompanyModalIsOpen}
            onRequestClose={this.addCompanyOnRequestClose}
            style={addCompanyModalStyles}
            contentLabel='Modal'
          >
            <div className='modal-header'>
              <h1 className='title'>Add company</h1>
              <img className='close' src={egoAxe} onClick={this.addCompanyOnRequestClose} />
            </div>
            <div className='modal-content'>
              <img className='visual-tip' src={egoCheckHexagon} />
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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
                          onChange={(e) => this.addCompanyHandleChanges('name', e)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
            <div className='modal-actions'>
              <button className='action' onClick={(e) => this.addCompany(e)}>Add</button>
              <button className='action close' onClick={this.addCompanyOnRequestClose}>Close</button>
            </div>
          </Modal>
          {companiesContent}
        </div>
      </div>
    );
  }
}

export default Companies;