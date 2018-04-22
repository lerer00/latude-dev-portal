import * as React from 'react';
import { egoCloseHexagon, egoStoreMobile, egoDataTransfer } from '../../../img/index';
import { IAsset } from '../../../models/asset';
import { Button, IButtonState } from '../../../components/button';
import AssetAmenity from '../../assetAmenity';
import BedSelector from '../../bedSelector';
import './index.css';

const Modal = require('react-modal');

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

interface Props {
    modalIsOpen: boolean;
    asset: IAsset;
    modalClose: () => void;
    saveAsset: (event: any) => void;
    updateAsset: (prop: string, value: any) => void;
    addAmenity: (amenity: any) => void;
    removeAmenity: (amenity: any) => void;
}

interface State {
    bedSelectorActive: boolean;
}

class ManageAssetModal extends React.Component<Props, State> {
    constructor(props?: any, context?: any) {
        super(props, context);

        this.state = {
            bedSelectorActive: false
        };

        this.addAmenity = this.addAmenity.bind(this);
        this.removeAmenity = this.removeAmenity.bind(this);
        this.close = this.close.bind(this);
    }

    addAmenity() {
        this.setState({
            bedSelectorActive: true
        });
    }

    removeAmenity() {
        this.setState({
            bedSelectorActive: false
        });
    }

    close() {
        this.setState({
            bedSelectorActive: false
        });

        this.props.modalClose();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.close}
                style={manageAssetModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Manage asset</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.close} />
                </div>
                <div className='modal-content'>
                    <div className='visual-tip'>
                        <img className='tip' src={egoStoreMobile} />
                        <img className='action' src={egoDataTransfer} />
                    </div>
                    <p className='description'>Set details about this current asset. Some are read-only and cannot be modified.</p>
                    <form className='manage-asset-modal-form'>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='label'><label>Description:</label></td>
                                    <td>
                                        <input
                                            className='value'
                                            type='text'
                                            value={this.props.asset.description}
                                            placeholder='small description'
                                            onChange={(e) => this.props.updateAsset('description', e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='label'><label>Amenities:</label></td>
                                    <td>
                                        <div className='asset-amenities'>
                                        {console.log(this.props.asset)}
                                            {this.props.asset.amenities.length > 0 && this.props.asset.amenities.map((amenity, index) =>
                                                <AssetAmenity key={index} amenity={amenity} />
                                            )}
                                        </div>
                                        {this.state.bedSelectorActive && <BedSelector addBed={this.props.addAmenity} cancel={this.removeAmenity} />}
                                        {!this.state.bedSelectorActive && <Button text='Add bed' state={IButtonState.default} action={this.addAmenity} />}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='modal-actions'>
                    <button className='button' onClick={(e) => this.props.saveAsset(e)}>Save</button>
                    <button className='action close' onClick={this.close}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default ManageAssetModal;