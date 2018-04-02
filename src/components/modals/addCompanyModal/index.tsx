import * as React from 'react';
const Modal = require('react-modal');
import { egoCloseHexagon, egoAddHexagon1, egoBuilding3 } from '../../../img/index';
import './index.css';

const addCompanyModalStyles = {
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
    company: {
        name: string;
    };
    modalClose: () => void;
    addCompany: (event: any) => void;
    updateCompany: (prop: string, value: string) => void;
}

class AddCompanyModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={addCompanyModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Add company</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
                </div>
                <div className='modal-content'>
                    <div className='visual-tip'>
                        <img className='tip' src={egoBuilding3} />
                        <img className='action' src={egoAddHexagon1} />
                    </div>
                    <p className='description'>Create the contract who will act as your company on the blockchain.
               This is only for architectural purpose since every property will now be created within this company.</p>
                    <form className='add-company-modal-form'>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='label'><label>Name:</label></td>
                                    <td>
                                        <input
                                            className='value'
                                            type='text'
                                            value={this.props.company.name}
                                            placeholder='insert company name'
                                            onChange={(e) => this.props.updateCompany('name', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='modal-actions'>
                    <button className='button' onClick={(e) => this.props.addCompany(e)}>Add</button>
                    <button className='action close' onClick={this.props.modalClose}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default AddCompanyModal;