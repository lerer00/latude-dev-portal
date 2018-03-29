import * as React from 'react';
import * as PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import Asset from './asset';
import EmptySearch from '../components/emptySearch';
import { Breadcrumbs } from '../breadcrumbs';
import { Button, IButtonState } from '../components/button';
import {
    egoCloseHexagon, egoAddHexagon1, egoStoreMobile, egoLocation,
    egoUpload, egoAdd
} from '../img/index';
import { IProperty } from '../models/property';
import Spinner from '../components/spinner';
import Authentication from '../services/authentication/authentication';
import HubRequest from '../services/rest/hubRequest';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import './index.css';
import './managePropertyModal.css';
import './addAssetModal.css';

const web3 = window['web3'];
const Modal = require('react-modal');
const { toast } = require('react-toastify');
const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);
const ReactMapboxGl = require('react-mapbox-gl').default;

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

const managePropertyModalStyles = {
    content: {
        padding: '16px',
        width: '800px',
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
    },
    xxx: {
        backgroundColor: 'red'
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
        files: Array<any>;
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
                amenities: {
                    accessibility: {
                        value: false
                    },
                    computers: {
                        value: false
                    },
                    conferenceVenues: {
                        value: false
                    },
                    library: {
                        value: false
                    },
                    lockers: {
                        value: false
                    },
                    pet: {
                        value: false
                    },
                    restaurants: {
                        value: false
                    },
                    smoking: {
                        value: false
                    },
                    wifi: {
                        value: false
                    }
                },
                name: '',
                parent: '',
                rating: 0,
                images: []
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
            },
            files: []
        };

        this.addAsset = this.addAsset.bind(this);
        this.addAssetOnRequestClose = this.addAssetOnRequestClose.bind(this);
        this.addAssetOnRequestOpen = this.addAssetOnRequestOpen.bind(this);
        this.addAssetHandleChanges = this.addAssetHandleChanges.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.managePropertyOnRequestClose = this.managePropertyOnRequestClose.bind(this);
        this.managePropertyOnRequestOpen = this.managePropertyOnRequestOpen.bind(this);
        this.onMapZoomDragEnd = this.onMapZoomDragEnd.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentWillMount() {
        this.getPropertyDetail();
    }

    componentDidMount() {
        propertyContract.setProvider(web3.currentProvider);
        this.getName();
        this.getBalance();
        this.getAssets();
    }

    getPropertyDetail() {
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
            return hubRequest.postPropertyImages(this.state.property.id, this.state.files);
        }).then((result) => {
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

    onDrop(files: any) {
        this.setState({
            files: files
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
                            <div className='visual-tip'>
                                <img className='tip' src={egoStoreMobile} />
                                <img className='action' src={egoAddHexagon1} />
                            </div>
                            <p className='description'>
                                Price and Currency is the only needed information we need to create you asset smart contract.
                                Further details can be added afterward.
                            </p>
                            <form className='add-asset-modal-form'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td ><label>Price:</label></td>
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
                                            <td ><label>Currency:</label></td>
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
                            <button className='button' onClick={(e) => this.addAsset(e)}>Add</button>
                            <button className='action close' onClick={this.addAssetOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.managePropertyModalIsOpen}
                        onRequestClose={this.managePropertyOnRequestClose}
                        style={managePropertyModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Manage property</h1>
                            <img className='close' src={egoCloseHexagon} onClick={this.managePropertyOnRequestClose} />
                        </div>
                        <div className='modal-content'>
                            <div className='manage-property-modal-map-selector'>
                                <img className='manage-property-modal-map-cursor' src={egoLocation} />
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
                            <form className='manage-property-modal-form'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><label>Name:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.property.name}
                                                    placeholder='name'
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.name = e.target.value;
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td ><label>Description:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.property.description}
                                                    placeholder='description'
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.description = e.target.value;
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Disabled access:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.accessibility.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.accessibility = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Computers available:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.computers.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.computers = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Conference venues:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.conferenceVenues.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.conferenceVenues = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Library:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.library.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.library = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Lockers:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.lockers.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.lockers = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Pet allowed:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.pet.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.pet = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Restaurants:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.restaurants.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.restaurants = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td ><label>Smoke free:</label></td>
                                            <td >
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.smoking.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.smoking = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-amenity'>
                                            <td><label>Wifi available:</label></td>
                                            <td>
                                                <Toggle
                                                    defaultChecked={this.state.property.amenities.wifi.value}
                                                    icons={false}
                                                    onChange={(e) => {
                                                        var tmp = this.state.property;
                                                        tmp.amenities.wifi = {
                                                            value: e.target.checked
                                                        };
                                                        this.setState({
                                                            property: tmp
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='manage-property-modal-upload-images'>
                                            <td><label>Upload images:</label></td>
                                            <td>
                                                <Dropzone className='manage-property-modal-upload-images-drop-zone' onDrop={this.onDrop} accept='image/*'>
                                                    <p><img src={egoUpload} /> Drag or click here to upload some images.</p>
                                                </Dropzone>
                                                <ul className='manage-property-modal-upload-images-drop-zone-files'>
                                                    {this.state.files &&
                                                        this.state.files.map(f =>
                                                            <li className='manage-property-modal-upload-images-drop-zone-file' key={f.name}>
                                                                <img src={egoAdd} />
                                                                <span>{f.name} - {f.size} bytes</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </td>
                                        </tr>
                                        {this.state.property.images.length > 0 && <tr className='manage-property-modal-current-images-container'>
                                            <td >Current images: </td>
                                            <td className='manage-property-modal-current-images'>
                                                {
                                                    this.state.property.images.map((image: string, index: number) => {
                                                        return <div className='manage-property-modal-current-image-container' key={index}>
                                                            <img className='manage-property-modal-current-image' src={image} />
                                                        </div>;
                                                    })
                                                }
                                            </td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className='modal-actions'>
                            <button className='button' onClick={(e) => this.saveProperty(e)}>Save</button>
                            <button className='action close' onClick={this.managePropertyOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}

export default PropertyDetail;