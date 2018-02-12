import * as React from 'react';
import * as PropTypes from 'prop-types';
import Asset from './asset';
import { Breadcrumbs } from '../breadcrumbs';
import Spinner from '../spinner';
import './index.css';

const web3 = window['web3'];
const Modal = require('react-modal');
const { toast } = require('react-toastify');
const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
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
        name: string;
        assets: Array<any>;
        assetsLoading: boolean;
        balance: number;
        addAsset: any;
        addAssetModalIsOpen: boolean;
        manageAssetModalIsOpen: boolean;
    }
}

class PropertyDetail extends React.Component<PropertyDetail.Props, PropertyDetail.State> {
    constructor(props?: PropertyDetail.Props, context?: any) {
        super(props, context);

        this.state = {
            name: '',
            balance: -1,
            assets: [],
            assetsLoading: false,
            addAsset: {
                price: 0,
                currency: 'CAD'
            },
            addAssetModalIsOpen: false,
            manageAssetModalIsOpen: false
        };

        this.addAsset = this.addAsset.bind(this);
        this.addAssetOnRequestClose = this.addAssetOnRequestClose.bind(this);
        this.addAssetOnRequestOpen = this.addAssetOnRequestOpen.bind(this);
        this.addAssetHandleChanges = this.addAssetHandleChanges.bind(this);
        this.saveAsset = this.saveAsset.bind(this);
        this.manageAssetOnRequestClose = this.manageAssetOnRequestClose.bind(this);
        this.manageAssetOnRequestOpen = this.manageAssetOnRequestOpen.bind(this);
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentDidMount() {
        propertyContract.setProvider(web3.currentProvider);
        this.getName();
        this.getBalance();
        this.getAssets();
    }

    getName() {
        var propertyInstance: any;
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            propertyInstance = instance;
            return propertyInstance.name.call({ from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                name: result
            });
        });
    }

    getBalance() {
        return web3.eth.getBalance(this.props.match.params.pid, (error: any, balance: any) => {
            this.setState({
                balance: balance.toNumber() / 1000 / 1000 / 1000 / 1000 / 1000 / 1000
            });
        });
    }

    addAsset(e: any) {
        e.preventDefault();

        if (this.state.addAsset.price < 0 && this.state.addAsset.currency === '') {
            return;
        }

        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.addAsset(this.state.addAsset.price, this.state.addAsset.currency, { from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                addAssetModalIsOpen: false
            }, () => {
                // This is only until the total mess of events is resolved...
                setTimeout(() => {
                    this.getAssets();

                    // Notify user from success.
                    toast.success('Success, asset was added.', {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }, 1500);
            });
        });
    }

    saveAsset(e: any) {
        e.preventDefault();

        var data = this.toHex('latude');
        web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [this.context.web3.selectedAccount, data] },
            function (err: any, result: any) {
                console.log(result);
            });

        this.setState({
            manageAssetModalIsOpen: false
        });
    }

    toHex(s: string) {
        var hex = '';
        for (var i = 0; i < s.length; i++) { hex += '' + s.charCodeAt(i).toString(16); }
        return `0x${hex}`;
    }

    getAssets() {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.numberOfAssets.call({ from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                assets: []
            }, () => {
                for (var i = 0; i < result.toNumber(); i++) {
                    this.getAsset(i);
                }
            });
        });
    }

    getAsset(id: number) {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.getAsset.call(id, { from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            var asset: any = { id: result[0].toNumber(), price: result[1].toNumber(), currency: result[2], stays: result[3] };
            this.setState({
                assets: this.state.assets.concat([asset])
            });
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

    manageAssetOnRequestClose() {
        this.setState({
            manageAssetModalIsOpen: false
        });
    }

    manageAssetOnRequestOpen() {
        this.setState({
            manageAssetModalIsOpen: true
        });
    }

    manageAssetHandleChanges(asset: string, e: any) {
        console.log(asset);
    }

    render() {
        var assetsContent;
        if (this.state.assetsLoading) {
            assetsContent = (
                <Spinner text='loading assets...' />
            );
        } else {
            if (this.state.assets.length > 0) {
                assetsContent = this.state.assets.map((asset) => <Asset key={asset.id} url={this.props.match.url} asset={asset} />
                );
            } else {
                assetsContent = (
                    <div className='empty'>
                        <img className='icon' src={egoCursorHand} />
                        <p className='text'>No assets found...</p>
                    </div>
                );
            }
        }

        const routes: Breadcrumbs.Crumb[] = [
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
        ];

        return (
            <section className='property-detail'>
                <div className='content'>
                    <Breadcrumbs routes={routes} />
                    <button className='add-asset' onClick={this.addAssetOnRequestOpen}>
                        <img className='add-asset-icon' src={egoPenChecklist} />
                        <span className='add-asset-text'>Add asset</span>
                    </button>
                    <button className='add-asset' onClick={this.manageAssetOnRequestOpen}>
                        <img className='add-asset-icon' src={egoPenChecklist} />
                        <span className='add-asset-text'>Manage asset</span>
                    </button>
                    <Modal
                        isOpen={this.state.addAssetModalIsOpen}
                        onRequestClose={this.addAssetOnRequestClose}
                        style={addAssetModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Add asset</h1>
                            <img className='close' src={egoAxe} onClick={this.addAssetOnRequestClose} />
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
                                            <td className='label'><label>Price:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.addAsset.price}
                                                    onChange={(e) => this.addAssetHandleChanges('price', e)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Currency:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.addAsset.currency}
                                                    onChange={(e) => this.addAssetHandleChanges('currency', e)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className='modal-actions'>
                            <button className='action' onClick={(e) => this.addAsset(e)}>Add</button>
                            <button className='action close' onClick={this.addAssetOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.manageAssetModalIsOpen}
                        onRequestClose={this.manageAssetOnRequestClose}
                        style={addAssetModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Manage asset</h1>
                            <img className='close' src={egoAxe} onClick={this.manageAssetOnRequestClose} />
                        </div>
                        <div className='modal-content'>
                            <img className='visual-tip' src={egoCheckHexagon} />
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                        <div className='modal-actions'>
                            <button className='action' onClick={(e) => this.saveAsset(e)}>Save</button>
                            <button className='action close' onClick={this.manageAssetOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                    <div className='description'>
                        <span className='address'>address: {this.props.match.params.pid}</span>
                        <span className='balance'>balance: {this.state.balance} ether</span>
                        <p className='name'>{this.state.name}</p>
                        <p>
                            This place will be to display the whole asset struct plus
                            metadata from ipfs or ipdb will do that tomorrow enough
                            for tonight.
                        </p>
                        <div className='assets'>
                            {assetsContent}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default PropertyDetail;