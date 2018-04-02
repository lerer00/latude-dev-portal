import { combineReducers } from 'redux';
import companiesReducer from '../containers/companies/reducer';
import companyReducer from '../containers/company/reducer';
import propertyReducer from '../containers/property/reducer';

export default combineReducers({
  'companies': companiesReducer,
  'company': companyReducer,
  'property': propertyReducer
});