import * as t from './actionTypes';
import { AnyAction } from 'redux';
import { State } from './model';
import propertyService from '../../services/property.contract';
import Hub from '../../services/hub';

const initialState: State = {
    isLoading: true,
    property: {
        active: false,
        comments: [],
        description: '',
        id: '',
        location: {
            coordinates: [0, 0],
            type: ''
        },
        amenities: {
            accessibility: {
                value: false
            },
            computers: {
                value: false
            },
            conferenceVenues: {
                value: false
            },
            library: {
                value: false
            },
            lockers: {
                value: false
            },
            pet: {
                value: false
            },
            restaurants: {
                value: false
            },
            smoking: {
                value: false
            },
            wifi: {
                value: false
            }
        },
        name: '',
        parent: '',
        rating: 0,
        images: []
    },
    propertyImages: [],
    assets: [],
    addAssetModalIsOpen: false,
    managePropertyModalIsOpen: false,
    newAsset: {
        price: 0,
        currency: 'CAD',
    }
};

export default (state = initialState, action: AnyAction): State => {
    const update = (payload: {}, stateArg = state) => Object.assign({}, stateArg, payload);
    const isLoading = (stateArg = state) => update({ isLoading: true }, state);
    const resetNewAsset = (stateArg = state) => update({ newProperty: initialState.newAsset }, state);

    switch (action.type) {
        case t.FETCH_ASSETS:
            propertyService.init(action.payload.propertyContractAddress);
            propertyService.getAssets(action.payload.context);
            return isLoading();
        case t.ASSETS_FETCHED:
            return update({
                assets: action.payload,
                isLoading: false,
            });
        case t.FETCH_PROPERTY:
            Hub.getInstance().getProperty(action.payload.propertyContractAddress);
            return isLoading();
        case t.PROPERTY_FETCHED:
            return update({
                property: action.payload,
                isLoading: false,
            });
        case t.TOGGLE_ADD_ASSET_MODAL:
            return update({ addAssetModalIsOpen: action.payload });
        case t.UPDATE_NEW_ASSET:
            const updatedAsset = Object.assign({}, state.newAsset, { [action.payload.prop]: action.payload.value });
            return update({ newAsset: updatedAsset });
        case t.ADD_ASSET:
            propertyService.init(action.payload.propertyContractAddress);
            propertyService.addAsset(action.payload.newAsset, action.payload.context, action.payload.cb);
            return resetNewAsset(isLoading());
        case t.TOGGLE_MANAGE_PROPERTY_MODAL:
            return update({ managePropertyModalIsOpen: action.payload });
        case t.UPDATE_MANAGE_PROPERTY:
            const updatedProperty = Object.assign({}, state.property, { [action.payload.prop]: action.payload.value });
            return update({ property: updatedProperty });
        case t.UPDATE_MANAGE_PROPERTY_AMENITIES:
            const updatedAmenities = Object.assign({}, state.property.amenities, { [action.payload.prop]: { value: action.payload.value } });
            return update({
                property: {
                    ...state.property,
                    amenities: updatedAmenities
                }
            });
        case t.UPDATE_MANAGE_PROPERTY_LOCATION:
            const updatedLocation = Object.assign({}, state.property.location, { coordinates: action.payload.coordinates, type: action.payload.type });
            console.log(updatedLocation);
            return update({
                property: {
                    ...state.property,
                    location: updatedLocation
                }
            });
        case t.UPDATE_MANAGE_PROPERTY_IMAGES:
            return update({ propertyImages: action.payload.files });
        case t.SAVE_PROPERTY:
            Hub.getInstance().postProperty(action.payload.property);

            if (action.payload.images.length > 0)
                Hub.getInstance().postPropertyImages(action.payload.property.id, action.payload.images);

            return update({
                managePropertyModalIsOpen: false,
                propertyImages: []
            });
        default:
            return state;
    }
};