import * as React from 'react';
import Toggle from 'react-toggle';
import Dropzone from 'react-dropzone';
import { egoCloseHexagon, egoLocation, egoUpload, egoAdd } from '../../../img/index';
import { IProperty } from '../../../models/property';
import './index.css';
const Modal = require('react-modal');

const ReactMapboxGl = require('react-mapbox-gl').default;
const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    attributionControl: false,
    logoPosition: 'bottom-left'
});

const managePropertyModalStyles = {
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

interface Props {
    modalIsOpen: boolean;
    property: IProperty;
    propertyImages: Array<File>;
    modalClose: () => void;
    saveProperty: (event: any) => void;
    updateProperty: (prop: string, value: any) => void;
    updatePropertyAmenities: (prop: string, value: any) => void;
    updatePropertyLocation: (coordinates: Array<number>, type: string) => void;
    updatePropertyImages: (files: Array<File>) => void;
}

class ManagePropertyModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={managePropertyModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Manage property</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
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
                            center={this.props.property.location.coordinates}
                            onDragEnd={(map: any, event: React.SyntheticEvent<any>) => {
                                var center = map.getCenter();
                                this.props.updatePropertyLocation([center.lng, center.lat], 'Point');
                            }}
                            onZoomEnd={(map: any, event: React.SyntheticEvent<any>) => {
                                var center = map.getCenter();
                                this.props.updatePropertyLocation([center.lng, center.lat], 'Point');
                            }}
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
                                            value={this.props.property.name}
                                            placeholder='name'
                                            onChange={(e) => this.props.updateProperty('name', e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td ><label>Description:</label></td>
                                    <td>
                                        <input
                                            className='value'
                                            type='text'
                                            value={this.props.property.description}
                                            placeholder='description'
                                            onChange={(e) => this.props.updateProperty('description', e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Disabled access:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.accessibility.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('accessibility', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Computers available:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.computers.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('computers', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Conference venues:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.conferenceVenues.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('conferenceVenues', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Library:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.library.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('library', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Lockers:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.lockers.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('lockers', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Pet allowed:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.pet.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('pet', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Restaurants:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.restaurants.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('restaurants', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td ><label>Smoke free:</label></td>
                                    <td >
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.smoking.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('smoking', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-amenity'>
                                    <td><label>Wifi available:</label></td>
                                    <td>
                                        <Toggle
                                            defaultChecked={this.props.property.amenities.wifi.value}
                                            icons={false}
                                            onChange={(e) => this.props.updatePropertyAmenities('wifi', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr className='manage-property-modal-upload-images'>
                                    <td><label>Upload images:</label></td>
                                    <td>
                                        <Dropzone className='manage-property-modal-upload-images-drop-zone' onDrop={this.props.updatePropertyImages} accept='image/*'>
                                            <p><img src={egoUpload} /> Drag or click here to upload some images.</p>
                                        </Dropzone>
                                        <ul className='manage-property-modal-upload-images-drop-zone-files'>
                                            {this.props.propertyImages &&
                                                this.props.propertyImages.map(i =>
                                                    <li className='manage-property-modal-upload-images-drop-zone-file' key={i.name}>
                                                        <img src={egoAdd} />
                                                        <span>{i.name} - {i.size} bytes</span>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </td>
                                </tr>
                                {this.props.property.images.length > 0 && <tr className='manage-property-modal-current-images-container'>
                                    <td >Current images: </td>
                                    <td className='manage-property-modal-current-images'>
                                        {
                                            this.props.property.images.map((image: string, index: number) => {
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
                    <button className='button' onClick={(e) => this.props.saveProperty(e)}>Save</button>
                    <button className='action close' onClick={this.props.modalClose}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default ManagePropertyModal;