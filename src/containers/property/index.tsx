import * as React from 'react';
import * as PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import Asset from '../../components/tiles/asset';
import EmptySearch from '../../components/emptySearch';
import { Dispatch } from 'redux';
import { Breadcrumbs } from '../../breadcrumbs';
import { Button, IButtonState } from '../../components/button';
import { connect } from 'react-redux';
import { IProperty } from '../../models/property';
import './index.css';

const { toast } = require('react-toastify');
import { Props, State, AssetModel, Context } from './model';
import {
    fetchPropertyAction, fetchAssetsAction, addAssetAction, toggleAddAssetModalAction,
    updateNewAssetAction, toggleManagePropertyModalAction, savePropertyAction, updateManagePropertyAction,
    updateManagePropertyAmenitiesAction, updateManagePropertyImagesAction, updateManagePropertyLocationAction
} from './actions';
import AddAssetModal from '../../components/modals/addAssetModal';
import ManagePropertyModal from '../../components/modals/managePropertyModal';

class Property extends React.Component<Props> {
    static contextTypes = {
        web3: PropTypes.object
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.fetchProperty(this.props.match.params.pid);
        this.props.fetchAssets(this.props.match.params.pid, this.context);
    }

    render() {
        const routes: Breadcrumbs.Crumb[] = [
            {
                name: 'Companies',
                path: '/companies',
                active: true,
            },
            {
                name: this.props.match.params.cid,
                path: '/companies/' + this.props.match.params.cid,
                active: true,
            },
            {
                name: 'Properties',
                path: '/companies/' + this.props.match.params.cid + '/properties/',
                active: false,
            },
            {
                name: this.props.match.params.pid,
                path: '/companies/' + this.props.match.params.cid + '/properties/' + this.props.match.params.pid,
                active: true,
            },
        ];

        var content;
        if (this.props.isLoading) {
            content = (
                <Spinner text='loading assets...' />
            );
        } else {
            if (this.props.assets.length > 0) {
                content = this.props.assets.map((asset) => <Asset key={asset.id} url={this.props.match.url} asset={asset} />
                );
            } else {
                content = <EmptySearch text='You do not have any assets...' />;
            }
        }

        return (
            <section className='property-detail'>
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='actions'>
                        <Button text='Add asset' state={IButtonState.default} action={this.props.openAddAssetModal} />
                        <Button text='Manage property' state={IButtonState.default} action={this.props.openManagePropertyModal} />
                    </div>
                    <div className='content'>
                        <span className='address'>address: {this.props.match.params.pid}</span>
                        {/* <span className='balance'>balance: {this.props.property.balance} ether</span> */}
                        <p className='name'>{this.props.property.name}</p>
                        <p className='description'>{this.props.property.description}</p>
                        <div className='assets'>
                            {content}
                        </div>
                    </div>

                    <AddAssetModal
                        modalIsOpen={this.props.addAssetModalIsOpen}
                        modalClose={this.props.closeAddAssetModal}
                        asset={this.props.newAsset}
                        addAsset={() => this.props.addAsset(this.props.match.params.pid, this.props.newAsset, this.context)}
                        updateAsset={this.props.updateNewAsset}
                    />
                    <ManagePropertyModal
                        modalIsOpen={this.props.managePropertyModalIsOpen}
                        modalClose={this.props.closeManagePropertyModal}
                        saveProperty={() => this.props.saveProperty(this.props.property, this.props.propertyImages)}
                        property={this.props.property}
                        propertyImages={this.props.propertyImages}
                        updateProperty={this.props.updateProperty}
                        updatePropertyAmenities={this.props.updatePropertyAmenities}
                        updatePropertyLocation={this.props.updatePropertyLocation}
                        updatePropertyImages={this.props.updatePropertyImages}
                    />
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const propertyState: State = state['property'];
    return {
        isLoading: propertyState.isLoading,
        property: propertyState.property,
        propertyImages: propertyState.propertyImages,
        assets: propertyState.assets,
        addAssetModalIsOpen: propertyState.addAssetModalIsOpen,
        managePropertyModalIsOpen: propertyState.managePropertyModalIsOpen,
        newAsset: propertyState.newAsset
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        fetchAssets: (propertyContractAddress: string, context: Context) => { dispatch(fetchAssetsAction(propertyContractAddress, context)); },
        fetchProperty: (propertyContractAddress: string) => { dispatch(fetchPropertyAction(propertyContractAddress)); },

        openAddAssetModal: () => { dispatch(toggleAddAssetModalAction(true)); },
        closeAddAssetModal: () => { dispatch(toggleAddAssetModalAction(false)); },
        updateNewAsset: (prop: string, value: string) => { dispatch(updateNewAssetAction(prop, value)); },
        addAsset: (propertyContractAddress: string, newAsset: AssetModel, context: Context) => {
            dispatch(addAssetAction(propertyContractAddress, newAsset, context, () => {
                toast.success('Success, asset was added.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
            dispatch(toggleAddAssetModalAction(false));
        },

        openManagePropertyModal: () => { dispatch(toggleManagePropertyModalAction(true)); },
        closeManagePropertyModal: () => { dispatch(toggleManagePropertyModalAction(false)); },
        updateProperty: (prop: string, value: any) => { dispatch(updateManagePropertyAction(prop, value)); },
        updatePropertyAmenities: (prop: string, value: any) => { dispatch(updateManagePropertyAmenitiesAction(prop, value)); },
        updatePropertyLocation: (coordinates: Array<number>, type: string) => { dispatch(updateManagePropertyLocationAction(coordinates, type)); },
        updatePropertyImages: (files: Array<File>) => { dispatch(updateManagePropertyImagesAction(files)); },
        saveProperty: (property: IProperty, images: Array<File>, context: Context) => {
            dispatch(savePropertyAction(property, images, () => {
                toast.success('Success, property saved.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);