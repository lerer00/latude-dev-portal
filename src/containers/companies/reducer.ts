import * as t from './actionTypes';
import { AnyAction } from 'redux';
import { State } from './model';
import companiesService from '../../services/companies.contract';

const initialState: State = {
    isLoading: true,
    modalOpen: false,
    companies: [],
    newCompany: {
        name: ''
    }
};

export default (state = initialState, action: AnyAction): State => {
  const update = (payload: {}, stateArg = state) => Object.assign({}, stateArg, payload);
  const isLoading = (stateArg = state) => update({ isLoading: true }, state);
  const resetNewCompany = (stateArg = state) => update({ newCompany: initialState.newCompany }, state);

  switch (action.type) {
    case t.COMPANIES_FETCHED:
      return update({
        companies: action.payload,
        isLoading: false,
      });
    case t.FETCH_COMPANIES:
      // This should be in a middleware
      companiesService.init();
      companiesService.getCompanies();
      return isLoading();
    case t.ADD:
      // This should be in a middleware
      companiesService.init();
      companiesService.addCompany(action.payload.newCompany.name, action.payload.context, action.payload.cb);
      return resetNewCompany(isLoading());
    case t.TOGGLE_MODAL:
      return update({modalOpen: action.payload});
    case t.UPDATE_NEW_COMPANY_MODAL:
      const updatedCompany = Object.assign({}, state.newCompany, {[action.payload.prop]: action.payload.value});
      return update({newCompany: updatedCompany});
    default:
      return state;
  }
};