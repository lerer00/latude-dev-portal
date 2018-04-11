import * as React from 'react';
import { egoCloseHexagon, egoBuilding10, egoAddHexagon1 } from '../../../img/index';
import './index.css';

const Modal = require('react-modal');

const addPropertyModalStyles = {
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
    property: {
        name: string;
    };
    modalClose: () => void;
    addProperty: (event: any) => void;
    updateProperty: (prop: string, value: string) => void;
}

class AddPropertyModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={addPropertyModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Add property</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
                </div>
                <div className='modal-content'>
                    <div className='visual-tip'>
                        <img className='tip' src={egoBuilding10} />
                        <img className='action' src={egoAddHexagon1} />
                    </div>
                    <p className='description'>Those are only basic information needed to create a property.
                        You'll always be able to manage this property freely after creation.
                                In order for everyone to see it, you'll need to activate it first.</p>
                    <form className='add-property-modal-form'>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='label'><label>Name:</label></td>
                                    <td>
                                        <input
                                            className='value'
                                            type='text'
                                            value={this.props.property.name}
                                            placeholder='insert property name'
                                            onChange={(e) => this.props.updateProperty('name', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='modal-actions'>
                    <button className='button' onClick={(e) => this.props.addProperty(e)}>Add</button>
                    <button className='action close' onClick={this.props.modalClose}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default AddPropertyModal;