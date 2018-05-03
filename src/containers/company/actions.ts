import * as t from './actionTypes';
import { Context } from './model';

export const addPropertyAction = (companyContractAddress: string, newProperty: any, context: Context, cb: () => void) => {
    return ({
        type: t.ADD_PROPERTY,
        payload: {
            companyContractAddress,
            newProperty,
            context,
            cb
        }
    });
};

export const toggleAddPropertyModalAction = (value: boolean) => ({
    type: t.TOGGLE_ADD_PROPERTY_MODAL,
    payload: value
});

export const fetchPropertiesAction = (companyContractAddress: string, context: Context) => {
    return {
        type: t.FETCH_PROPERTIES,
        payload: {
            companyContractAddress,
            context
        }
    };
};

export const propertiesFetched = (properties: any[]) => ({
    type: t.PROPERTIES_FETCHED,
    payload: properties,
});

export const updateNewPropertyAction = (prop: string, value: string) => ({
    type: t.UPDATE_NEW_PROPERTY,
    payload: {
        prop,
        value,
    }
}); 