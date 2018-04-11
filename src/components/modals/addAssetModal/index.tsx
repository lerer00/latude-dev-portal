import * as React from 'react';
import Select from 'react-select';
import { egoCloseHexagon, egoStoreMobile, egoAddHexagon1 } from '../../../img/index';
import 'react-select/dist/react-select.css';
import './index.css';

const Modal = require('react-modal');

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

interface Props {
    modalIsOpen: boolean;
    asset: {
        price: number;
        currency: string;
    };
    modalClose: () => void;
    addAsset: (event: any) => void;
    updateAsset: (prop: string, value: string) => void;
}

class AddAssetModal extends React.Component<Props> {
    constructor() {
        super();

        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    }

    handleCurrencyChange = (selectedCurrency: any) => {
        this.props.updateAsset('currency', selectedCurrency.value);
    }

    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.modalClose}
                style={addAssetModalStyles}
                contentLabel='Modal'
            >
                <div className='modal-header'>
                    <h1 className='title'>Add asset</h1>
                    <img className='close' src={egoCloseHexagon} onClick={this.props.modalClose} />
                </div>
                <div className='modal-content'>
                    <div className='visual-tip'>
                        <img className='tip' src={egoStoreMobile} />
                        <img className='action' src={egoAddHexagon1} />
                    </div>
                    <p className='description'>
                        Price and Currency are the only needed information we need to create you asset smart contract.
                        Further details can be added afterward.
                    </p>
                    <form className='add-asset-modal-form'>
                        <table>
                            <tbody>
                                <tr>
                                    <td ><label>Currency:</label></td>
                                    <td>
                                        <Select
                                            name='form-field-name'
                                            value={this.props.asset.currency}
                                            onChange={this.handleCurrencyChange}
                                            clearable={false}
                                            searchable={false}
                                            options={[
                                                { value: 'CAD', label: 'CAD' },
                                                { value: 'USD', label: 'USD' },
                                            ]}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td ><label>Price:</label></td>
                                    <td>
                                        <input
                                            className='value'
                                            type='text'
                                            value={this.props.asset.price}
                                            placeholder='asset value for 1 night'
                                            onChange={(e) => this.props.updateAsset('price', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='modal-actions'>
                    <button className='button' onClick={(e) => this.props.addAsset(e)}>Add</button>
                    <button className='action close' onClick={this.props.modalClose}>Close</button>
                </div>
            </Modal>
        );
    }
}

export default AddAssetModal;