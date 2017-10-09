import * as React from 'react';
import Company from './company';
import Spinner from '../spinner';
import './index.css';
import Ethereum from '../utilities/ethereum';

const Modal = require('react-modal');
const contract = require('truffle-contract');
const CompanyFactoryContract = require('../truffle-build/contracts/CompanyFactory.json');
const companyFactoryContract = contract(CompanyFactoryContract);
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoPenChecklist = require('../img/ego/pen-checklist.svg');
const egoCursorHand = require('../img/ego/cursor-hand.svg');

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

export namespace Compagnies {
  export interface Props {
    // empty
  }

  export interface State {
    loading: boolean,
    web3: any,
    companies: Array<string>,
    addCompanyModalIsOpen: boolean,
    addCompany: any
  }
}

class Compagnies extends React.Component<Compagnies.Props, Compagnies.State> {
  constructor() {
    super();

    this.state = {
      loading: true,
      web3: undefined,
      companies: [],
      addCompanyModalIsOpen: false,
      addCompany: {
        name: ''
      }
    }

    this.addCompany = this.addCompany.bind(this);
    this.addCompanyOnRequestClose = this.addCompanyOnRequestClose.bind(this);
    this.addCompanyOnRequestOpen = this.addCompanyOnRequestOpen.bind(this);
    this.addCompanyHandleChanges = this.addCompanyHandleChanges.bind(this);
  }

  componentWillMount() {
    var ethereum = new Ethereum();
    var web3 = ethereum.getWeb3();
    this.setState({
      web3: web3
    });
  }

  componentDidMount() {
    this.getCompanies();
  }

  getCompanies() {
    companyFactoryContract.setProvider(this.state.web3.currentProvider);
    var companyFactoryInstance;
    this.state.web3.eth.getAccounts((error: any, accounts: any) => {
      companyFactoryContract.deployed().then((instance: any) => {
        companyFactoryInstance = instance;

        return companyFactoryInstance.getCompanies.call();
      }).then((result: any) => {
        this.setState({
          companies: result,
          loading: false
        });
        this.forceUpdate();
      });
    });
  }

  addCompany(e: any) {
    e.preventDefault();

    if (this.state.addCompany.name === '')
      return;

    companyFactoryContract.setProvider(this.state.web3.currentProvider);
    var companyFactoryInstance;
    this.state.web3.eth.getAccounts((error: any, accounts: any) => {
      companyFactoryContract.deployed().then((instance: any) => {
        companyFactoryInstance = instance;

        return companyFactoryInstance.createCompany(
          this.state.addCompany.name, { from: accounts[0] });
      }).then((result: any) => {
        this.getCompanies();
        this.setState({
          addCompanyModalIsOpen: false,
          addCompany: {
            name: '',
          }
        })
      });;
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

  addCompanyHandleChanges(company: string, e: any) {
    var tmp = this.state.addCompany;
    tmp[company] = e.target.value;
    this.setState({
      addCompany: tmp
    });
  }

  render() {
    var companiesContent;
    if (this.state.loading)
      companiesContent = <Spinner />
    else {
      if (this.state.companies.length > 0) {
        companiesContent = this.state.companies.map((id) =>
          <Company web3={this.state.web3} key={id} id={id} />
        );
      } else {
        companiesContent =
          <div className="empty">
            <img className="icon" src={egoCursorHand} />
            <p className="text">No companies found...</p>
          </div>;
      }
    }

    return (
      <div className="companies">
        <div className="content">
          <button className="add-company" onClick={this.addCompanyOnRequestOpen}>
            <img className="add-company-icon" src={egoPenChecklist} />
            <span className="add-company-text">Add company</span>
          </button>
          <Modal
            isOpen={this.state.addCompanyModalIsOpen}
            onRequestClose={this.addCompanyOnRequestClose}
            style={addCompanyModalStyles}
            contentLabel="Modal">
            <div className="modal-header">
              <h1 className="title">Add company</h1>
              <img className="close" src={egoAxe} onClick={this.addCompanyOnRequestClose} />
            </div>
            <div className="modal-content">
              <img className="visual-tip" src={egoCheckHexagon} />
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
              <form className="addCompanyForm">
                <table>
                  <tbody>
                    <tr>
                      <td className="label"><label>Name:</label></td>
                      <td><input className="value" type="text" value={this.state.addCompany.name} onChange={(e) => this.addCompanyHandleChanges('name', e)} /></td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
            <div className="modal-actions">
              <button onClick={(e) => this.addCompany(e)}>Add</button>
              <button className="addCompanyCloseButton" onClick={this.addCompanyOnRequestClose}>Close</button>
            </div>
          </Modal>
          {companiesContent}
        </div>
      </div>
    );
  }
}

export default Compagnies;
