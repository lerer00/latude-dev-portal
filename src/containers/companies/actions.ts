import * as t from './actionTypes';

export const addAction = (newCompany: any, context: any, cb: () => void) => {
    return ({
        type: t.ADD,
        payload: { newCompany, context, cb }
    });
}

export const toggleModalAction = (value: boolean) => ({
    type: t.TOGGLE_MODAL,
    payload: value
});

export const companiesFetched = (companies: any[]) => ({
    type: t.COMPANIES_FETCHED,
    payload: companies,
});

export const fetchCompaniesAction = () => {
    return {
        type: t.FETCH_COMPANIES,
        payload: null
    };
};

export const updateNewCompanyAction = (prop: string, value: string) => ({
    type: t.UPDATE_NEW_COMPANY_MODAL,
    payload: {
        prop,
        value,
    }
});