import * as React from 'react';
import './index.css';
import Ethereum from '../utilities/ethereum';

const Modal = require('react-modal');
const contract = require('truffle-contract');
const PropertyContract = require('../truffle-build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoPenChecklist = require('../img/ego/pen-checklist.svg');

const addAssetModalStyles = {
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

export namespace PropertyDetail {
    export interface Props {
        match: any;
    }

    export interface State {
        web3: any;
        property: any;
        balance: number;
        addAsset: any;
        addAssetModalIsOpen: boolean;
    }
}

class PropertyDetail extends React.Component<PropertyDetail.Props, PropertyDetail.State> {
    constructor(props?: PropertyDetail.Props, context?: any) {
        super(props, context);

        this.state = {
            web3: null,
            property: {
                name: ''
            },
            balance: -1,
            addAsset: {
                name: 'Room 336',
                price: 150,
                currency: 'CAD'
            },
            addAssetModalIsOpen: false
        };

        this.addAsset = this.addAsset.bind(this);
        this.addAssetOnRequestClose = this.addAssetOnRequestClose.bind(this);
        this.addAssetOnRequestOpen = this.addAssetOnRequestOpen.bind(this);
        this.addAssetHandleChanges = this.addAssetHandleChanges.bind(this);
    }

    componentWillMount() {
        var ethereum = new Ethereum();
        var web3 = ethereum.getWeb3();
        this.setState({
            web3: web3
        });
    }

    componentDidMount() {
        this.getName();
    }

    getName() {
        propertyContract.setProvider(this.state.web3.currentProvider);
        var propertyInstance: any;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.id).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.name.call();
            }).then((result: any) => {
                this.setState({
                    property: {
                        name: result,
                    }
                });
                return propertyInstance.getBalance.call();
            }).then((result: any) => {
                this.setState({
                    balance: this.state.web3.utils.fromWei(result.toNumber())
                });
            });
        });
    }

    addAsset(e: any) {
        e.preventDefault();

        if (this.state.addAsset.name === '' && this.state.addAsset.price < 0 && this.state.addAsset.currency === '')
            return;

        propertyContract.setProvider(this.state.web3.currentProvider);
        var propertyInstance;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.id).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.createAsset(this.state.addAsset.name, this.state.addAsset.price, this.state.addAsset.currency, { from: accounts[0] });
            }).then((result: any) => {
                console.log(result);
                this.setState({
                    addAssetModalIsOpen: false
                })
            });;
        });
    }

    addAssetOnRequestClose() {
        this.setState({
            addAssetModalIsOpen: false
        });
    }

    addAssetOnRequestOpen() {
        this.setState({
            addAssetModalIsOpen: true
        });
    }

    addAssetHandleChanges(asset: string, e: any) {
        var tmp = this.state.addAsset;
        tmp[asset] = e.target.value;
        this.setState({
          addAsset: tmp
        });
    }

    render() {
        return (
            <section className="property-detail">
                <div className="content">
                    <button className="add-asset" onClick={this.addAssetOnRequestOpen}>
                        <img className="add-asset-icon" src={egoPenChecklist} />
                        <span className="add-asset-text">Add asset</span>
                    </button>
                    <Modal
                        isOpen={this.state.addAssetModalIsOpen}
                        onRequestClose={this.addAssetOnRequestClose}
                        style={addAssetModalStyles}
                        contentLabel="Modal">
                        <div className="modal-header">
                            <h1 className="title">Add asset</h1>
                            <img className="close" src={egoAxe} onClick={this.addAssetOnRequestClose} />
                        </div>
                        <div className="modal-content">
                            <img className="visual-tip" src={egoCheckHexagon} />
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="label"><label>Name:</label></td>
                                            <td><input className="value" type="text" value={this.state.addAsset.name} onChange={(e) => this.addAssetHandleChanges('name', e)} /></td>
                                        </tr>
                                        <tr>
                                            <td className="label"><label>Price:</label></td>
                                            <td><input className="value" type="text" value={this.state.addAsset.price} onChange={(e) => this.addAssetHandleChanges('price', e)} /></td>
                                        </tr>
                                        <tr>
                                            <td className="label"><label>Currency:</label></td>
                                            <td><input className="value" type="text" value={this.state.addAsset.currency} onChange={(e) => this.addAssetHandleChanges('currency', e)} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className="modal-actions">
                            <button className="action" onClick={(e) => this.addAsset(e)}>Add</button>
                            <button className="action close" onClick={this.addAssetOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                    <div className="description">
                        <span className="address">address: {this.props.match.params.id}</span>
                        <span className="balance">balance: {this.state.balance} ether</span>
                        <p className="name">{this.state.property.name}</p>
                        <p>This place will be to display the whole asset struct plus metadata from ipfs or ipdb will do that tomorrow enough for tonight.</p>
                    </div>
                </div>
            </section>
        );
    }
}

export default PropertyDetail;