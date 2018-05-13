import * as React from 'react';
import './index.css';
import { egoCloseHexagon } from '../../../img/index';
const Modal = require('react-modal');

const yesNoModalStyles = {
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
    title: string;
    modalIsOpen: boolean;
    modalClose: () => void;
    actionYes: () => void;
    actionCancel: () => void;
}

class YesNoModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={yesNoModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>{this.props.title}</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
                </div>
                <div className='modal-content'>
                    {this.props.children}
                </div>
                <div className='modal-actions'>
                    <button className='button error' onClick={this.props.actionYes}><span className='button-text'>Yes</span></button>
                    <button className='action close' onClick={this.props.actionCancel}>Cancel</button>
                </div>
            </Modal>
        );
    }
}

export default YesNoModal;