import * as React from 'react';
import { egoCloseHexagon, egoStoreMobile, egoDataTransfer } from '../../../img/index';
import { IAsset } from '../../../models/asset';
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
}

class ManageAssetModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={manageAssetModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Manage asset</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
                </div>
                <div className='modal-content'>
                    <div className='visual-tip'>
                        <img className='tip' src={egoStoreMobile} />
                        <img className='action' src={egoDataTransfer} />
                    </div>
                    <p className='description'>Set details about this current asset. Some are read-only and cannot be modified.</p>
                    <form className='add-stay-modal-form'>
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
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='modal-actions'>
                    <button className='button' onClick={(e) => this.props.saveAsset(e)}>Save</button>
                    <button className='action close' onClick={this.props.modalClose}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default ManageAssetModal;