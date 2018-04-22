import * as React from 'react';
import Select from 'react-select';
import { egoCheckHexagon, egoCloseHexagon } from '../../img/index';
import { IAmenity } from '../../models/asset/amenity';
import { assetAmenityTypes, assetAmenityBedTypes } from '../../models/asset/types';
import './index.css';

interface Props {
    addBed: (bed: any) => void;
    cancel: () => void;
}

interface State {
    amenity: IAmenity;
}

class BedSelector extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            amenity: {
                type: assetAmenityTypes.BED,
                properties: {
                    type: assetAmenityBedTypes.SINGLE,
                    number: 1
                }
            }
        };

        this.onChangeProperty = this.onChangeProperty.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
    }

    onChangeProperty(property: string, value: any) {
        var newAmenity = this.state.amenity;
        newAmenity.properties[property] = value;
        this.setState({
            amenity: newAmenity,
        });
    }

    onTypeChange(newType: any) {
        var newBed = this.state.amenity;
        newBed.properties.type = newType.value;
        this.setState({
            amenity: newBed
        });
    }

    render() {
        return (
            <div className='bed-selector'>
                <div>
                    <Select
                        name='form-field-name'
                        value={this.state.amenity.properties.type}
                        onChange={this.onTypeChange}
                        clearable={false}
                        searchable={false}
                        options={[
                            { value: assetAmenityBedTypes.SINGLE, label: 'Single bed' },
                            { value: assetAmenityBedTypes.DOUBLE, label: 'Double bed' },
                            { value: assetAmenityBedTypes.TRIPLE, label: 'Triple bed' },
                            { value: assetAmenityBedTypes.QUAD, label: 'Quad bed' },
                            { value: assetAmenityBedTypes.QUEEN, label: 'Queen bed' },
                            { value: assetAmenityBedTypes.KING, label: 'King bed' },
                            { value: assetAmenityBedTypes.TWIN, label: 'Twin bed' },
                            { value: assetAmenityBedTypes.COUCH, label: 'Couch bed' },
                        ]}
                    /></div>
                <div>
                    <input
                        className='value'
                        type='number'
                        value={this.state.amenity.properties.number}
                        onChange={(e) => this.onChangeProperty('number', parseInt(e.target.value, 10))}
                    />
                </div>
                <div>
                    <button className='action-button' type='button' onClick={(e) => { this.props.addBed(this.state.amenity); this.props.cancel(); }}><img className='save' src={egoCheckHexagon} /></button>
                    <button className='action-button' type='button' onClick={(e) => { this.props.cancel(); }}><img className='cancel' src={egoCloseHexagon} /></button>
                </div>
            </div>
        );
    }
}

export default BedSelector;