import * as t from './actionTypes';
import { AnyAction } from 'redux';
import { State } from './model';
import companiesService from '../../services/companies.contract';

const initialState: State = {
  isLoading: true,
  addCompanyModalIsOpen: false,
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
    case t.ADD_COMPANY:
      companiesService.init();
      companiesService.addCompany(action.payload.newCompany.name, action.payload.context, action.payload.cb);
      return resetNewCompany(isLoading());
    case t.TOGGLE_ADD_COMPANY_MODAL:
      return update({ addCompanyModalIsOpen: action.payload });
    case t.FETCH_COMPANIES:
      companiesService.init();
      companiesService.getCompanies();
      return isLoading();
    case t.COMPANIES_FETCHED:
      return update({
        companies: action.payload,
        isLoading: false,
      });
    case t.UPDATE_NEW_COMPANY:
      console.log(action.payload);
      const updatedCompany = Object.assign({}, state.newCompany, { [action.payload.prop]: action.payload.value });
      return update({ newCompany: updatedCompany });
    default:
      return state;
  }
};