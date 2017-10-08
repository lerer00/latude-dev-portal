import * as React from 'react';
import Property from './property';
import Spinner from '../spinner'
import './index.css';
import Ethereum from '../utilities/ethereum';

const Modal = require('react-modal');
const contract = require('truffle-contract');
const PropertyFactoryContract = require('../truffle-build/contracts/PropertyFactory.json');
const propertyFactoryContract = contract(PropertyFactoryContract);
const egoPenChecklist = require('../img/ego/pen-checklist.svg');
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoCursorHand = require('../img/ego/cursor-hand.svg');

const addPropertyModalStyles = {
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

export namespace PropertiesContainer {
  export interface Props {
    // empty
  }

  export interface State {
    loading: boolean,
    web3: any;
    properties: Array<string>;
    addPropertyModalIsOpen: boolean;
    addProperty: any;
  }
}

class PropertiesContainer extends React.Component<PropertiesContainer.Props, PropertiesContainer.State> {
  constructor() {
    super();

    this.state = {
      loading: true,
      web3: undefined,
      properties: [],
      addPropertyModalIsOpen: false,
      addProperty: {
        name: '',
        country: '',
        city: ''
      }
    };

    this.addProperty = this.addProperty.bind(this);
    this.addPropertyOnRequestClose = this.addPropertyOnRequestClose.bind(this);
    this.addPropertyOnRequestOpen = this.addPropertyOnRequestOpen.bind(this);
    this.addPropertyHandleChanges = this.addPropertyHandleChanges.bind(this);
  }

  componentWillMount() {
    var ethereum = new Ethereum();
    var web3 = ethereum.getWeb3();
    this.setState({
      web3: web3
    });
  }

  componentDidMount() {
    this.getProperties();
  }

  getProperties() {
    propertyFactoryContract.setProvider(this.state.web3.currentProvider);
    var propertyFactoryInstance;
    this.state.web3.eth.getAccounts((error: any, accounts: any) => {
      propertyFactoryContract.deployed().then((instance: any) => {
        propertyFactoryInstance = instance;

        return propertyFactoryInstance.getProperties.call();
      }).then((result: any) => {
        this.setState({
          properties: result,
          loading: false
        });
        this.forceUpdate();
      });
    });
  }

  addProperty(e: any) {
    e.preventDefault();

    if (this.state.addProperty.name === '' ||
      this.state.addProperty.country === '' ||
      this.state.addProperty.city === '')
      return;

    propertyFactoryContract.setProvider(this.state.web3.currentProvider);
    var propertyFactoryInstance;
    this.state.web3.eth.getAccounts((error: any, accounts: any) => {
      propertyFactoryContract.deployed().then((instance: any) => {
        propertyFactoryInstance = instance;

        return propertyFactoryInstance.createProperty(
          this.state.addProperty.name,
          this.state.addProperty.country,
          this.state.addProperty.city, { from: accounts[0] });
      }).then((result: any) => {
        this.getProperties();
        this.setState({
          addPropertyModalIsOpen: false,
          addProperty: {
            name: '',
            country: '',
            city: ''
          }
        })
      });;
    });
  }

  addPropertyOnRequestClose() {
    this.setState({
      addPropertyModalIsOpen: false
    });
  }

  addPropertyOnRequestOpen() {
    this.setState({
      addPropertyModalIsOpen: true
    });
  }

  addPropertyHandleChanges(property: string, e: any) {
    var tmp = this.state.addProperty;
    tmp[property] = e.target.value;
    this.setState({
      addProperty: tmp
    });
  }

  render() {
    var propertiesContent;
    if (this.state.loading)
      propertiesContent = <Spinner />
    else {
      if (this.state.properties.length > 0) {
        propertiesContent = this.state.properties.map((id) =>
          <Property web3={this.state.web3} key={id} id={id} />
        );
      } else {
        propertiesContent =
          <div className="empty">
            <img className="icon" src={egoCursorHand} />
            <p className="text">No properties found...</p>
          </div>;
      }
    }

    return (
      <div className="properties">
        <div className="content">
          <button className="add-property" onClick={this.addPropertyOnRequestOpen}>
            <img className="add-property-icon" src={egoPenChecklist} />
            <span className="add-property-text">Add property</span>
          </button>
          <br />
          <Modal
            isOpen={this.state.addPropertyModalIsOpen}
            onRequestClose={this.addPropertyOnRequestClose}
            style={addPropertyModalStyles}
            contentLabel="Modal">
            <div className="modal-header">
              <h1 className="title">Add property</h1>
              <img className="close" src={egoAxe} onClick={this.addPropertyOnRequestClose} />
            </div>
            <div className="modal-content">
              <img className="visual-tip" src={egoCheckHexagon} />
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
              <form className="addPropertyForm">
                <table>
                  <tr>
                    <td className="label"><label>Name:</label></td>
                    <td><input className="value" type="text" value={this.state.addProperty.name} onChange={(e) => this.addPropertyHandleChanges('name', e)} /></td>
                  </tr>
                  <tr>
                    <td className="label"><label>Country:</label></td>
                    <td><input className="value" type="text" value={this.state.addProperty.country} onChange={(e) => this.addPropertyHandleChanges('country', e)} /></td>
                  </tr>
                  <tr>
                    <td className="label"><label>City:</label></td>
                    <td><input className="value" type="text" value={this.state.addProperty.city} onChange={(e) => this.addPropertyHandleChanges('city', e)} /></td>
                  </tr>
                </table>
              </form>
            </div>
            <div className="modal-actions">
              <button onClick={(e) => this.addProperty(e)}>Add</button>
              <button className="addPropertyCloseButton" onClick={this.addPropertyOnRequestClose}>Close</button>
            </div>
          </Modal>
          {propertiesContent}
        </div>
      </div>
    );
  }
}

export default PropertiesContainer;
