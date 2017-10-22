import * as React from 'react';
import Asset from './asset';
import Breadcrumbs from '../breadcrumbs'
import Spinner from '../spinner';
import './index.css';
import Ethereum from '../utilities/ethereum';

const Modal = require('react-modal');
const contract = require('truffle-contract');
const PropertyContract = require('../truffle-build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoPenChecklist = require('../img/ego/pen-checklist.svg');
const egoCursorHand = require('../img/ego/cursor-hand.svg');

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
        assets: Array<any>;
        assetsLoading: boolean;
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
            assets: [],
            assetsLoading: false,
            balance: -1,
            addAsset: {
                id: 'Room 336',
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
        propertyContract.setProvider(this.state.web3.currentProvider);
        this.getName();
        this.getAssets();
    }

    getName() {
        var propertyInstance: any;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.pid).then((instance: any) => {
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

        if (this.state.addAsset.id === '' && this.state.addAsset.price < 0 && this.state.addAsset.currency === '')
            return;

        var propertyInstance;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.pid).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.addAsset(this.state.addAsset.id, this.state.addAsset.price, this.state.addAsset.currency, { from: accounts[0] });
            }).then((result: any) => {
                this.setState({
                    addAssetModalIsOpen: false
                })
            });;
        });
    }

    getAssets() {
        var propertyInstance;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.pid).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.numberOfAssets.call();
            }).then((result: any) => {
                for (var i = 0; i < result.toNumber(); i++) {
                    this.getAsset(i);
                }
            });;
        });
    }

    getAsset(id: number) {
        var propertyInstance;
        this.state.web3.eth.getAccounts((error: any, accounts: any) => {
            propertyContract.at(this.props.match.params.pid).then((instance: any) => {
                propertyInstance = instance;

                return propertyInstance.getAsset.call(id);
            }).then((result: any) => {
                var asset: any = { id: result[0].toNumber(), name: result[1], price: result[2].toNumber(), currency: result[3], stay: result[4] };
                this.setState({
                    assets: this.state.assets.concat([asset])
                });
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
        var assetsContent;
        if (this.state.assetsLoading)
            assetsContent = <Spinner text="loading assets..." />
        else {
            if (this.state.assets.length > 0) {
                assetsContent = this.state.assets.map((asset) => <Asset web3={this.state.web3} key={asset.id} id={asset.id} name={asset.name} price={asset.price} currency={asset.currency} url={this.props.match.url} />
                );
            } else {
                assetsContent =
                    <div className="empty">
                        <img className="icon" src={egoCursorHand} />
                        <p className="text">No assets found...</p>
                    </div>;
            }
        }

        const routes: any = [
            {
                name: 'Companies',
                path: '/companies',
                active: true,
            },
            {
                name: this.props.match.params.cid,
                path: '/companies/' + this.props.match.params.cid,
                active: true,
            },
            {
                name: 'Properties',
                path: '/companies/' + this.props.match.params.cid + '/properties/',
                active: false,
            },
            {
                name: this.props.match.params.pid,
                path: '/companies/' + this.props.match.params.cid + '/properties/' + this.props.match.params.pid,
                active: true,
            },
        ]

        return (
            <section className="property-detail">
                <div className="content">
                    <Breadcrumbs routes={routes} />
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
                                            <td className="label"><label>Id:</label></td>
                                            <td><input className="value" type="text" value={this.state.addAsset.id} onChange={(e) => this.addAssetHandleChanges('id', e)} /></td>
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
                        <span className="address">address: {this.props.match.params.pid}</span>
                        <span className="balance">balance: {this.state.balance} ether</span>
                        <p className="name">{this.state.property.name}</p>
                        <p>This place will be to display the whole asset struct plus metadata from ipfs or ipdb will do that tomorrow enough for tonight.</p>
                        <div className="assets">
                            {assetsContent}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default PropertyDetail;