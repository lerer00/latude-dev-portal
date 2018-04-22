import * as React from 'react';
import Bed from '../assetAmenity/amenity/bed';
import './index.css';

interface Props {
    amenity: any;
}

interface State {
    // empty
}

class AssetAmenity extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);
    }
    render() {
        var amenity;
        switch (this.props.amenity.type) {
            case 0:
                amenity = <Bed amenity={this.props.amenity} />;
                break;
            default:
                break;
        }

        return (
            <div className='asset-amenity'>
                {amenity}
            </div>
        );
    }
}

export default AssetAmenity;