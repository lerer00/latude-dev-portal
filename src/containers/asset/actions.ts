import * as t from './actionTypes';
import { Context } from './model';

// Asset fetch...
export const fetchAssetAction = (propertyContractAddress: string, assetId: string) => {
    return {
        type: t.FETCH_ASSET,
        payload: {
            propertyContractAddress,
            assetId
        }
    };
};
export const assetFetched = (asset: any) => ({
    type: t.ASSET_FETCHED,
    payload: asset,
});

// Toggle, update and save new booking.
export const toggleAddBookingModalAction = (value: boolean) => ({
    type: t.TOGGLE_ADD_BOOKING_MODAL,
    payload: value
});
export const updateNewBookingAction = (dateRange: any) => ({
    type: t.UPDATE_NEW_BOOKING,
    payload: {
        dateRange
    }
});
export const addBookingAction = (propertyContractAddress: string, assetId: string, newBooking: any, context: Context, cb: () => void) => {
    return ({
        type: t.ADD_BOOKING,
        payload: {
            propertyContractAddress,
            assetId,
            newBooking,
            context,
            cb
        }
    });
};

// Toggle, update and save current asset.
export const toggleManageAssetModalAction = (value: boolean) => ({
    type: t.TOGGLE_MANAGE_ASSET_MODAL,
    payload: value
});
export const updateManageAssetAction = (prop: string, value: string) => ({
    type: t.UPDATE_MANAGE_ASSET,
    payload: {
        prop,
        value,
    }
});
export const updateManageAssetAddAmenityAction = (amenity: any) => ({
    type: t.UPDATE_MANAGE_ASSET_ADD_AMENITY,
    payload: {
        amenity
    }
});
export const updateManageAssetRemoveAmenityAction = (amenity: any) => ({
    type: t.UPDATE_MANAGE_ASSET_REMOVE_AMENITY,
    payload: {
        amenity
    }
});
export const saveAssetAction = (asset: any, cb: () => void) => {
    return ({
        type: t.SAVE_ASSET,
        payload: {
            asset,
            cb
        }
    });
};