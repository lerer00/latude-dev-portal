import * as t from './actionTypes';
import { Context } from './model';

export const addCompanyAction = (newCompany: any, context: Context, cb: () => void) => {
    return ({
        type: t.ADD_COMPANY,
        payload: { newCompany, context, cb }
    });
};

export const toggleAddCompanyModalAction = (value: boolean) => ({
    type: t.TOGGLE_ADD_COMPANY_MODAL,
    payload: value
});

export const fetchCompaniesAction = (context: Context) => {
    return {
        type: t.FETCH_COMPANIES,
        payload: { context }
    };
};

export const companiesFetchedAction = (companies: any[]) => ({
    type: t.COMPANIES_FETCHED,
    payload: companies,
});

export const updateNewCompanyAction = (prop: string, value: string) => ({
    type: t.UPDATE_NEW_COMPANY,
    payload: {
        prop,
        value,
    }
}); 