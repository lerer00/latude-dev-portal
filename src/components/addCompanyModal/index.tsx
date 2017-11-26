import * as React from 'react';
const Modal = require('react-modal');
import { egoAxe, egoCheckHexagon } from '../../img/index';

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
    modalOpen: boolean;
    closeAddCompanyModal: () => void;
    updateNewCompany: (prop: string, value: string) => void;
    newCompany: {
        name: string;
    };
    addCompany: () => void;

}

class AddCompanyModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                isOpen={this.props.modalOpen}
                style={addCompanyModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Add company</h1>
                    <img className='close' onClick={this.props.closeAddCompanyModal} src={egoAxe} />
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
                                    <td className='label'><label>Name:</label></td>
                                    <td>
                                        <input
                                            className='value'
                                            type='text'
                                            value={this.props.newCompany.name}
                                            onChange={(e) => this.props.updateNewCompany('name', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='modal-actions'>
                    <button className='action' onClick={this.props.addCompany}>Add</button>
                    <button className='action close' onClick={this.props.closeAddCompanyModal}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default AddCompanyModal;