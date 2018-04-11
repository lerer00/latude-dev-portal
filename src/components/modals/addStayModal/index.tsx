import * as React from 'react';
import { egoCloseHexagon, egoCalendar2, egoAddHexagon1 } from '../../../img/index';
import './index.css';

const Modal = require('react-modal');
const DateRange = require('react-date-range').DateRange;

const assStayModalStyles = {
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
    stay: {
        startDate: string;
        endDate: string;
    };
    modalClose: () => void;
    addStay: (event: any) => void;
    updateStay: (prop: string, value: string) => void;
}

class AddStayModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={assStayModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Add stay</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
                </div>
                <div className='modal-content'>
                    <div className='visual-tip'>
                        <img className='tip' src={egoCalendar2} />
                        <img className='action' src={egoAddHexagon1} />
                    </div>
                    <p className='description'>
                        Add a stay for this asset.
                        Choose a starting and ending date.
                        Note that the last day is not included within your stay, it's the date your are checking out.
                            </p>
                    <DateRange
                        className='select-range'
                        calendars={1}
                        onInit={this.props.updateStay}
                        onChange={this.props.updateStay}
                    />
                </div>
                <div className='modal-actions'>
                    <button className='button' onClick={(e) => this.props.addStay(e)}>Save</button>
                    <button className='action close' onClick={this.props.modalClose}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default AddStayModal;