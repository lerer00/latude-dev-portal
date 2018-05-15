import * as React from 'react';
import * as PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import Asset from '../../components/tiles/asset';
import EmptySearch from '../../components/emptySearch';
import { Dispatch } from 'redux';
import { Breadcrumbs } from '../../breadcrumbs';
import { egoWarningTriangle } from '../../img/index';
import { Button, IButtonState } from '../../components/button';
import { connect } from 'react-redux';
import { IProperty } from '../../models/property';
import './index.css';

const { toast } = require('react-toastify');
import { Props, State, AssetModel, Context } from './model';
import {
    fetchPropertyAction, fetchAssetsAction, addAssetAction, toggleAddAssetModalAction,
    updateNewAssetAction, toggleManagePropertyModalAction, savePropertyAction, updateManagePropertyAction,
    updateManagePropertyAmenitiesAction, updateManagePropertyImagesAction, updateManagePropertyLocationAction,
    toggleDeletePropertyModalAction,
    deletePropertyActionResult,
    fetchPropertyOwnerAction,
    fetchPropertyBalanceAction
} from './actions';
import AddAssetModal from '../../components/modals/addAssetModal';
import ManagePropertyModal from '../../components/modals/managePropertyModal';
import YesNoModal from '../../components/modals/yesNoModal';

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
        this.props.fetchOwner(this.props.match.params.pid, this.context);
        this.props.fetchBalance(this.props.match.params.pid);
    }

    render() {
        const routes: Breadcrumbs.Crumb[] = [
            {
                name: 'Properties',
                path: '/properties/',
                active: true,
            },
            {
                name: this.props.match.params.pid,
                path: '/properties/' + this.props.match.params.pid,
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

        console.log(this.props);

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
                        <p className='name'>{this.props.property.name}</p>
                        <p className='description'>{this.props.property.description}</p>
                        <div className='assets'>
                            {content}
                        </div>
                    </div>
                    <div className='danger-zone'>
                        <h1 className='title'>Danger Zone</h1>
                        <div className='danger-zone-table'>
                            <div className='danger-zone-table-content spacer-bottom'>
                                <div>
                                    <h1>Delete this property</h1>
                                    <p>Remove this property from the blockchain, this is irreversible.</p>
                                </div>
                                <Button text='Delete property' state={IButtonState.error} action={this.props.openDeletePropertyModal} />
                            </div>
                            <div className='danger-zone-table-content'>
                                <div>
                                    <h1>Withdraw fund</h1>
                                    <p>Retreive funds from the smart contract, this is irreversible. Current balance is {this.props.balance} and owner is {this.props.owner}</p>
                                </div>
                                <Button text='Withdraw funds' state={IButtonState.error} action={this.props.openWithdrawFundModal} />
                            </div>
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

                    <YesNoModal
                        title={'Delete Property'}
                        modalIsOpen={this.props.deletePropertyModalIsOpen}
                        modalClose={this.props.closeDeletePropertyModal}
                        actionYes={() => this.props.deletePropertyYes(this.props.match.params.pid, this.context)}
                        actionCancel={this.props.deletePropertyCancel}
                    >
                        <div className='visual-tip'>
                            <img className='tip' src={egoWarningTriangle} />
                        </div>
                        <p>
                            WARNING! You are about to DELETE this property. This will indeed have irreversible effects, here's the list.
                        </p>
                        <ul className='warning-list'>
                            <li>The contract will be deleted from the blockchain.</li>
                            <li>All remaining funds will be returned to the contract owner.</li>
                            <li>This is not reversible by any means.</li>
                        </ul>
                        <p>
                            Do you want still to proceed and DELETE this property?
                        </p>
                    </YesNoModal>

                    <YesNoModal
                        title={'Withdraw Fund'}
                        modalIsOpen={this.props.withdrawFundModalIsOpen}
                        modalClose={this.props.closeWithdrawFundModal}
                        actionYes={() => this.props.withdrawFund(this.props.match.params.pid, this.context)}
                        actionCancel={this.props.deletePropertyCancel}
                    >
                        <div className='visual-tip'>
                            <img className='tip' src={egoWarningTriangle} />
                        </div>
                        <p>
                            ! You are about to DELETE this property. This will indeed have irreversible effects, here's the list.
                        </p>
                        <ul className='warning-list'>
                            <li>The contract will be deleted from the blockchain.</li>
                            <li>All remaining funds will be returned to the contract owner.</li>
                            <li>This is not reversible by any means.</li>
                        </ul>
                        <p>
                            Do you want still to proceed and DELETE this property?
                        </p>
                    </YesNoModal>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const propertyState: State = state['property'];
    return {
        isLoading: propertyState.isLoading,
        owner: propertyState.owner,
        balance: propertyState.balance,
        property: propertyState.property,
        propertyImages: propertyState.propertyImages,
        assets: propertyState.assets,
        addAssetModalIsOpen: propertyState.addAssetModalIsOpen,
        managePropertyModalIsOpen: propertyState.managePropertyModalIsOpen,
        deletePropertyModalIsOpen: propertyState.deletePropertyModalIsOpen,
        newAsset: propertyState.newAsset
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        // assets
        fetchAssets: (propertyContractAddress: string, context: Context) => { dispatch(fetchAssetsAction(propertyContractAddress, context)); },

        // property
        fetchProperty: (propertyContractAddress: string) => { dispatch(fetchPropertyAction(propertyContractAddress)); },

        // owner
        fetchOwner: (propertyContractAddress: string, context: Context) => { dispatch(fetchPropertyOwnerAction(propertyContractAddress, context)); },

        // balance
        fetchBalance: (propertyContractAddress: string, context: Context) => { dispatch(fetchPropertyBalanceAction(propertyContractAddress, context)); },

        // add asset modal
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

        // manage property modal
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
        },

        // delete property modal
        openDeletePropertyModal: () => { dispatch(toggleDeletePropertyModalAction(true)); },
        closeDeletePropertyModal: () => { dispatch(toggleDeletePropertyModalAction(false)); },
        deletePropertyYes: (propertyContractAddress: string, context: Context) => {
            dispatch(deletePropertyActionResult(true, propertyContractAddress, context, () => {
                toast.success('Success, property was deleted.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
        },
        deletePropertyCancel: () => {
            dispatch(deletePropertyActionResult(false));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);