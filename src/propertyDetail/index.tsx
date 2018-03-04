import * as React from 'react';
import * as PropTypes from 'prop-types';
import Asset from './asset';
import EmptySearch from '../components/emptySearch';
import { Breadcrumbs } from '../breadcrumbs';
import { Button, IButtonState } from '../components/button';
import { IProperty } from '../models/property';
import Spinner from '../spinner';
import Authentication from '../services/authentication/authentication';
import HubRequest from '../services/rest/hubRequest';
import axios from 'axios';
import './index.css';

const web3 = window['web3'];
const Modal = require('react-modal');
const { toast } = require('react-toastify');
const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const ReactMapboxGl = require('react-mapbox-gl').default;
const egoCloseHexagon = require('../img/ego/close-hexagon.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoLocation = require('../img/ego/location.svg');
const egoConstructionFence = require('../img/ego/caution-fence.svg');

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    attributionControl: false,
    logoPosition: 'bottom-left'
});

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
        property: IProperty;
        name: string;
        assets: Array<any>;
        assetsLoading: boolean;
        balance: number;
        addAsset: any;
        addAssetModalIsOpen: boolean;
        managePropertyModalIsOpen: boolean;
        mapOptions: any;
    }
}

class PropertyDetail extends React.Component<PropertyDetail.Props, PropertyDetail.State> {
    constructor(props?: PropertyDetail.Props, context?: any) {
        super(props, context);

        this.state = {
            property: {
                active: false,
                comments: [],
                description: '',
                id: '',
                location: {
                    coordinates: [],
                    type: ''
                },
                name: '',
                parent: '',
                rating: ''
            },
            name: '',
            balance: -1,
            assets: [],
            assetsLoading: false,
            addAsset: {
                price: undefined,
                currency: ''
            },
            addAssetModalIsOpen: false,
            managePropertyModalIsOpen: false,
            mapOptions: {
                zoom: [8],
                center: [-122.419416, 37.774929]
            }
        };

        this.addAsset = this.addAsset.bind(this);
        this.addAssetOnRequestClose = this.addAssetOnRequestClose.bind(this);
        this.addAssetOnRequestOpen = this.addAssetOnRequestOpen.bind(this);
        this.addAssetHandleChanges = this.addAssetHandleChanges.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.managePropertyOnRequestClose = this.managePropertyOnRequestClose.bind(this);
        this.managePropertyOnRequestOpen = this.managePropertyOnRequestOpen.bind(this);
        this.onMapZoomDragEnd = this.onMapZoomDragEnd.bind(this);
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentWillMount() {
        // call hub to retrieve current information for that property
        axios.get(process.env.REACT_APP_HUB_URL + '/properties/' + this.props.match.params.pid).then((result) => {
            this.setState({
                mapOptions: {
                    center: result.data.location.coordinates
                },
                property: result.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

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

    saveProperty(e: any) {
        e.preventDefault();

        var hubRequest = new HubRequest(Authentication.getInstance());
        hubRequest.postProperty(this.state.property).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });

        this.setState({
            mapOptions: {
                center: this.state.property.location.coordinates
            },
            managePropertyModalIsOpen: false
        });
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

    managePropertyOnRequestClose() {
        this.setState({
            managePropertyModalIsOpen: false
        });
    }

    managePropertyOnRequestOpen() {
        this.setState({
            managePropertyModalIsOpen: true
        });
    }

    managePropertyHandleChanges(property: string, e: any) {
        var tmp = this.state.property;
        tmp[property] = e.target.value;
        this.setState({
            property: tmp
        });
    }

    onMapZoomDragEnd(map: any, event: any) {
        var center = map.getCenter();
        var tmp = this.state.property;
        tmp.location = {
            coordinates: [center.lng, center.lat],
            type: 'Point'
        };
        this.setState({
            property: tmp
        });
    }

    render() {
        var content;
        if (this.state.assetsLoading) {
            content = (
                <Spinner text='loading assets...' />
            );
        } else {
            if (this.state.assets.length > 0) {
                content = this.state.assets.map((asset) => <Asset key={asset.id} url={this.props.match.url} asset={asset} />
                );
            } else {
                content = <EmptySearch text='You do not have any assets...' />;
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
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='actions'>
                        <Button text='Add asset' state={IButtonState.default} action={this.addAssetOnRequestOpen} />
                        <Button text='Manage property' state={IButtonState.default} action={this.managePropertyOnRequestOpen} />
                    </div>
                    <div className='content'>
                        <span className='address'>address: {this.props.match.params.pid}</span>
                        <span className='balance'>balance: {this.state.balance} ether</span>
                        <p className='name'>{this.state.property.name || this.state.name}</p>
                        <p className='description'>{this.state.property.description}</p>
                        <div className='assets'>
                            {content}
                        </div>
                    </div>

                    <Modal
                        isOpen={this.state.addAssetModalIsOpen}
                        onRequestClose={this.addAssetOnRequestClose}
                        style={addAssetModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Add asset</h1>
                            <img className='close' src={egoCloseHexagon} onClick={this.addAssetOnRequestClose} />
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
                                                    placeholder='asset value for 1 night'
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
                                                    placeholder='desired currency'
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
                        isOpen={this.state.managePropertyModalIsOpen}
                        onRequestClose={this.managePropertyOnRequestClose}
                        style={addAssetModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Manage property</h1>
                            <img className='close' src={egoCloseHexagon} onClick={this.managePropertyOnRequestClose} />
                        </div>
                        <div className='modal-content'>
                            <div className='map-selector'>
                                <p>Drag the map to your property location. Please be as precise as possible.</p>
                                <img className='map-cursor' src={egoLocation} />
                                <Map
                                    style='mapbox://styles/mapbox/streets-v9'
                                    containerStyle={{
                                        height: '280px',
                                        width: '100%'
                                    }}
                                    center={this.state.mapOptions.center}
                                    zoom={this.state.mapOptions.zoom}
                                    onDragEnd={(map: any, event: React.SyntheticEvent<any>) => { this.onMapZoomDragEnd(map, event); }}
                                    onZoomEnd={(map: any, event: React.SyntheticEvent<any>) => { this.onMapZoomDragEnd(map, event); }}
                                />
                            </div>
                            <form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='label'><label>Name:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.property.name}
                                                    placeholder='name'
                                                    onChange={(e) => this.managePropertyHandleChanges('name', e)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Description:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.property.description}
                                                    placeholder='description'
                                                    onChange={(e) => this.managePropertyHandleChanges('description', e)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Images:</label></td>
                                            <td>
                                                <p><img className='under-construction' src={egoConstructionFence} /> Work in progress...</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Facilities:</label></td>
                                            <td>
                                                <p><img className='under-construction' src={egoConstructionFence} /> Work in progress...</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Accepted paiement:</label></td>
                                            <td>
                                                <p><img className='under-construction' src={egoConstructionFence} /> Work in progress...</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Landmarks:</label></td>
                                            <td>
                                                <p><img className='under-construction' src={egoConstructionFence} /> Work in progress...</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Restaurant on site:</label></td>
                                            <td>
                                                <p><img className='under-construction' src={egoConstructionFence} /> Work in progress...</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'><label>Pets allowed:</label></td>
                                            <td>
                                                <p><img className='under-construction' src={egoConstructionFence} /> Work in progress...</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className='modal-actions'>
                            <button className='action' onClick={(e) => this.saveProperty(e)}>Save</button>
                            <button className='action close' onClick={this.managePropertyOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}

export default PropertyDetail;