import * as t from './actionTypes';
import { AnyAction } from 'redux';
import { State } from './model';
import propertyService from '../../services/property.contract';
import Hub from '../../services/hub';

const initialState: State = {
    isLoading: true,
    asset: {
        id: '',
        name: '',
        description: '',
        active: false,
        parent: '',
        bookingsMap: [],
        bookings: [],
        amenities: [],
        price: 0,
        currency: ''
    },
    bookings: [],
    addBookingModalIsOpen: false,
    manageAssetModalIsOpen: false,
    newBooking: {
        startDate: null,
        endDate: null
    }
};

export default (state = initialState, action: AnyAction): State => {
    const update = (payload: {}, stateArg = state) => Object.assign({}, stateArg, payload);
    const isLoading = (stateArg = state) => update({ isLoading: true }, state);
    const resetNewBooking = (stateArg = state) => update({ newBooking: initialState.newBooking }, state);
    const pushToArray = (oldArr: Array<any>, newValue: any) => { return [...oldArr, newValue]; };
    const removeFromArray = (oldArr: Array<any>, objToRemove: any) => { return oldArr.filter(o => o.id !== objToRemove.id); };

    switch (action.type) {
        case t.FETCH_ASSET:
            Hub.getInstance().getAsset(action.payload.propertyContractAddress + '&' + action.payload.assetId);
            return isLoading();
        case t.ASSET_FETCHED:
            return update({
                asset: action.payload,
                isLoading: false,
            });
        case t.TOGGLE_ADD_BOOKING_MODAL:
            return update({ addBookingModalIsOpen: action.payload });
        case t.UPDATE_NEW_BOOKING:
            return update({ newBooking: action.payload.dateRange });
        case t.ADD_BOOKING:
            propertyService.init(action.payload.propertyContractAddress);
            propertyService.addBooking(action.payload.assetId, action.payload.newBooking, action.payload.context, action.payload.cb);
            return resetNewBooking(isLoading());
        case t.TOGGLE_MANAGE_ASSET_MODAL:
            return update({ manageAssetModalIsOpen: action.payload });
        case t.UPDATE_MANAGE_ASSET:
            const updatedAsset = Object.assign({}, state.asset, { [action.payload.prop]: action.payload.value });
            return update({ asset: updatedAsset });
        case t.UPDATE_MANAGE_ASSET_ADD_AMENITY:
            var addedArr = pushToArray(state.asset.amenities, action.payload.amenity);
            const updatedAssetAddedAmenity = Object.assign({}, state.asset, { amenities: addedArr });
            return update({ asset: updatedAssetAddedAmenity });
        case t.UPDATE_MANAGE_ASSET_REMOVE_AMENITY:
            var removedArr = removeFromArray(state.asset.amenities, action.payload.amenity);
            const updatedAssetRemovedAmenitys = Object.assign({}, state.asset, { amenitites: removedArr });
            return update({ asset: updatedAssetRemovedAmenitys });
        case t.SAVE_ASSET:
            Hub.getInstance().postAsset(action.payload.asset, action.payload.cb);
            return update({ manageAssetModalIsOpen: false });
        default:
            return state;
    }
};