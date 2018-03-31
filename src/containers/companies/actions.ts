import * as t from './actionTypes';

export const addCompanyAction = (newCompany: any, context: any, cb: () => void) => {
    return ({
        type: t.ADD_COMPANY,
        payload: { newCompany, context, cb }
    });
};

export const toggleAddCompanyModalAction = (value: boolean) => ({
    type: t.TOGGLE_ADD_COMPANY_MODAL,
    payload: value
});

export const fetchCompaniesAction = () => {
    return {
        type: t.FETCH_COMPANIES,
        payload: null
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