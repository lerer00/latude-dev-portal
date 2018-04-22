import * as t from './actionTypes';
import { AnyAction } from 'redux';
import { State } from './model';
import companyService from '../../services/company.contract';

const initialState: State = {
    isLoading: true,
    addPropertyModalIsOpen: false,
    properties: [],
    newProperty: {
        name: ''
    }
};

export default (state = initialState, action: AnyAction): State => {
    const update = (payload: {}, stateArg = state) => Object.assign({}, stateArg, payload);
    const isLoading = (stateArg = state) => update({ isLoading: true }, state);
    const resetNewProperty = (stateArg = state) => update({ newProperty: initialState.newProperty }, state);

    switch (action.type) {
        case t.ADD_PROPERTY:
            console.log(action.payload);
            companyService.init(action.payload.companyContractAddress);
            companyService.addProperty(action.payload.newProperty.name, action.payload.context, action.payload.cb);
            return resetNewProperty(isLoading());
        case t.TOGGLE_ADD_PROPERTY_MODAL:
            return update({ addPropertyModalIsOpen: action.payload });
        case t.FETCH_PROPERTIES:
            companyService.init(action.payload.companyContractAddress);
            companyService.getProperties();
            return isLoading();
        case t.PROPERTIES_FETCHED:
            return update({
                properties: action.payload,
                isLoading: false,
            });
        case t.UPDATE_NEW_PROPERTY:
            const updatedProperty = Object.assign({}, state.newProperty, { [action.payload.prop]: action.payload.value });
            return update({ newProperty: updatedProperty });
        default:
            return state;
    }
};