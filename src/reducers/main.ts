import { combineReducers } from 'redux';
import propertiesReducer from '../containers/properties/reducer';
import propertyReducer from '../containers/property/reducer';
import assetReducer from '../containers/asset/reducer';

export default combineReducers({
  'properties': propertiesReducer,
  'property': propertyReducer,
  'asset': assetReducer
});