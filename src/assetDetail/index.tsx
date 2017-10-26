import * as React from 'react';
import * as PropTypes from 'prop-types';
import Breadcrumbs from '../breadcrumbs'
import Spinner from '../spinner';
import Ethereum from '../utilities/ethereum';
import './index.css';

const Modal = require('react-modal');
const ipfsAPI = require('ipfs-api')
const bl = require('bl');
const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoPenChecklist = require('../img/ego/pen-checklist.svg');
const egoCursorHand = require('../img/ego/cursor-hand.svg');

const manageAssetModalStyles = {
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

export namespace AssetDetail {
    export interface Props {
        match: any;
    }

    export interface State {
        loading: boolean,
        dataFound: boolean,
        web3: any,
        ipfs: any,
        manageAssetModalIsOpen: boolean,
        asset: any
    }
}

class AssetDetail extends React.Component<AssetDetail.Props, AssetDetail.State> {
    constructor(props?: AssetDetail.Props, context?: any) {
        super(props, context);

        this.state = {
            loading: true,
            dataFound: false,
            web3: null,
            ipfs: ipfsAPI('localhost', '5001', { protocol: 'http' }),
            manageAssetModalIsOpen: false,
            asset: {
                name: '',
                description: '',
                type: ''
            }
        }

        this.upsertAsset = this.upsertAsset.bind(this);
        this.manageAssetOnRequestClose = this.manageAssetOnRequestClose.bind(this);
        this.manageAssetOnRequestOpen = this.manageAssetOnRequestOpen.bind(this);
        this.manageAssetHandleChanges = this.manageAssetHandleChanges.bind(this);
    }

    static contextTypes = {
        web3: PropTypes.object
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
        this.retrieveLastAssetHash();
    }

    addAssetHash(hash: string) {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.addMetadataHashForAsset(this.props.match.params.aid, hash, { from: this.context.web3.accounts[0] });
        }).then((hash: string) => {
            this.manageAssetOnRequestClose();
        });
    }

    retrieveLastAssetHash() {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.lastMetadataHashForAsset.call(this.props.match.params.aid);
        }).then((hash: string) => {
            this.setState({
                loading: false,
                dataFound: true
            })
            this.getFile(hash);
        }).catch((error: any) => {
            this.setState({
                loading: false,
                dataFound: false
            })
        });
    }

    getFile(hash: string) {
        this.state.ipfs.files.cat(hash, (err: any, stream: any) => {
            if (err) {
                throw err;
            }
            stream.pipe(bl((e: any, d: any) => {
                if (e) {
                    throw err;
                }

                this.setState({
                    asset: JSON.parse(d.toString())
                });
            }));
        });
    }

    upsertAsset(e: any) {
        e.preventDefault();

        const files = [
            {
                path: this.props.match.url + '.json',
                content: JSON.stringify(this.state.asset)
            }
        ]
        this.state.ipfs.files.add(files, null, (err: any, result: any) => {
            if (err)
                throw err;

            this.addAssetHash(result[0].hash);
        })
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

    manageAssetHandleChanges(company: string, e: any) {
        var tmp = this.state.asset;
        tmp[company] = e.target.value;
        this.setState({
            asset: tmp
        });
    }

    render() {
        var assetContent;
        if (this.state.loading)
            assetContent = <Spinner text="loading asset..." />
        else {
            if (this.state.dataFound) {
                assetContent = <div className="informations">
                    <h1 className="asset-name">{this.state.asset.name}</h1>
                    <p className="asset-description">{this.state.asset.description}</p>
                    <p className="asset-type">Type: {this.state.asset.type}</p>
                </div>
            } else {
                assetContent =
                    <div className="empty">
                        <img className="icon" src={egoCursorHand} />
                        <p className="text">No data were found please add some more informations before continuing...</p>
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
            {
                name: 'Assets',
                path: '/companies/' + this.props.match.params.cid + '/properties/' + this.props.match.params.pid + '/assets',
                active: false,
            },
            {
                name: this.props.match.params.aid,
                path: '/companies/' + this.props.match.params.cid + '/properties/' + this.props.match.params.pid + '/assets/' + this.props.match.params.aid,
                active: true,
            },
        ]

        return (
            <section className="asset-detail">
                <div className="content">
                    <Breadcrumbs routes={routes} />
                    <button className="manage-asset" onClick={this.manageAssetOnRequestOpen}>
                        <img className="manage-asset-icon" src={egoPenChecklist} />
                        <span className="manage-asset-text">Manage asset</span>
                    </button>
                    <Modal
                        isOpen={this.state.manageAssetModalIsOpen}
                        onRequestClose={this.manageAssetOnRequestClose}
                        style={manageAssetModalStyles}
                        contentLabel="Modal">
                        <div className="modal-header">
                            <h1 className="title">Manage asset</h1>
                            <img className="close" src={egoAxe} onClick={this.manageAssetOnRequestClose} />
                        </div>
                        <div className="modal-content">
                            <img className="visual-tip" src={egoCheckHexagon} />
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="label"><label>Name:</label></td>
                                            <td><input className="value" type="text" value={this.state.asset.name} onChange={(e) => this.manageAssetHandleChanges('name', e)} /></td>
                                        </tr>
                                        <tr>
                                            <td className="label"><label>Description:</label></td>
                                            <td><input className="value" type="text" value={this.state.asset.description} onChange={(e) => this.manageAssetHandleChanges('description', e)} /></td>
                                        </tr>
                                        <tr>
                                            <td className="label"><label>Type:</label></td>
                                            <td><input className="value" type="text" value={this.state.asset.type} onChange={(e) => this.manageAssetHandleChanges('type', e)} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className="modal-actions">
                            <button className="action" onClick={(e) => this.upsertAsset(e)}>Save</button>
                            <button className="action close" onClick={this.manageAssetOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                    {assetContent}
                </div>
            </section>
        );
    }
}

export default AssetDetail;