import * as React from 'react';
import { egoSingleBed } from '../../../../img/index';
import { IAmenity } from '../../../../models/asset/amenity';
import './index.css';
import { assetAmenityBedTypes } from '../../../../models/asset/types';

interface Props {
    amenity: IAmenity;
}

interface State {
    // empty
}

class AssetBedAmenity extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);
    }
    render() {
        var bedType;
        switch (this.props.amenity.properties.type) {
            case assetAmenityBedTypes.SINGLE:
                bedType = 'Single bed';
                break;
            case assetAmenityBedTypes.DOUBLE:
                bedType = 'Double bed';
                break;
            case assetAmenityBedTypes.TRIPLE:
                bedType = 'Triple bed';
                break;
            case assetAmenityBedTypes.QUAD:
                bedType = 'Quad bed';
                break;
            case assetAmenityBedTypes.QUEEN:
                bedType = 'Queen bed';
                break;
            case assetAmenityBedTypes.KING:
                bedType = 'King bed';
                break;
            case assetAmenityBedTypes.TWIN:
                bedType = 'Twin bed';
                break;
            case assetAmenityBedTypes.COUCH:
                bedType = 'Couch bed';
                break;
            default:
                bedType = 'Unknown';
                break;
        }

        return (
            <div className='asset-bed-amenity'>
                <img className='bed-icon' src={egoSingleBed} /><p className='bed-number'>x{this.props.amenity.properties.number}</p><p className='bed-properties'>{bedType} </p>
            </div>
        );
    }
}

export default AssetBedAmenity;