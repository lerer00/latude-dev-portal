import * as t from './actionTypes';
import { Context } from './model';

// Assets fetch...
export const fetchAssetsAction = (propertyContractAddress: string, context: Context) => {
    return {
        type: t.FETCH_ASSETS,
        payload: {
            propertyContractAddress,
            context
        }
    };
};
export const assetsFetched = (assets: any[]) => ({
    type: t.ASSETS_FETCHED,
    payload: assets,
});

// Property fetch...
export const fetchPropertyAction = (propertyContractAddress: string) => {
    return {
        type: t.FETCH_PROPERTY,
        payload: { propertyContractAddress }
    };
};
export const propertyFetched = (property: any) => ({
    type: t.PROPERTY_FETCHED,
    payload: property,
});

// Toggle, update and save new asset.
export const toggleAddAssetModalAction = (value: boolean) => ({
    type: t.TOGGLE_ADD_ASSET_MODAL,
    payload: value
});
export const updateNewAssetAction = (prop: string, value: string) => ({
    type: t.UPDATE_NEW_ASSET,
    payload: {
        prop,
        value,
    }
});
export const addAssetAction = (propertyContractAddress: string, newAsset: any, context: Context, cb: () => void) => {
    return ({
        type: t.ADD_ASSET,
        payload: {
            propertyContractAddress,
            newAsset,
            context,
            cb
        }
    });
};

// Toggle, update and save current property.
export const toggleManagePropertyModalAction = (value: boolean) => ({
    type: t.TOGGLE_MANAGE_PROPERTY_MODAL,
    payload: value
});
export const updateManagePropertyAction = (prop: string, value: string) => ({
    type: t.UPDATE_MANAGE_PROPERTY,
    payload: {
        prop,
        value,
    }
});
export const updateManagePropertyAmenitiesAction = (prop: string, value: string) => ({
    type: t.UPDATE_MANAGE_PROPERTY_AMENITIES,
    payload: {
        prop,
        value,
    }
});
export const updateManagePropertyLocationAction = (coordinates: Array<number>, type: string) => ({
    type: t.UPDATE_MANAGE_PROPERTY_LOCATION,
    payload: {
        coordinates,
        type,
    }
});
export const updateManagePropertyImagesAction = (files: Array<File>) => ({
    type: t.UPDATE_MANAGE_PROPERTY_IMAGES,
    payload: {
        files
    }
});
export const savePropertyAction = (property: any, images: Array<File>, cb: () => void) => {
    return ({
        type: t.SAVE_PROPERTY,
        payload: {
            property,
            images,
            cb
        }
    });
};

// Toggle, update and save new asset.
export const toggleDeletePropertyModalAction = (value: boolean) => ({
    type: t.TOGGLE_DELETE_PROPERTY_MODAL,
    payload: value
});
export const deletePropertyActionResult = (result: boolean, propertyContractAddress?: string, context?: Context, cb?: () => void) => ({
    type: t.DELETE_PROPERTY_ACTION_RESULT,
    payload: {
        result,
        propertyContractAddress,
        context,
        cb
    }
});