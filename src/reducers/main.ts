import { combineReducers } from 'redux';
import companiesReducer from '../containers/companies/reducer';

export default combineReducers({
  'companies': companiesReducer
});
