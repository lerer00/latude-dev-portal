import * as t from './actionTypes';
import { AnyAction } from 'redux';
import { State } from './model';
import propertyService from '../../services/property.contract';
import Hub from '../../services/hub';

const initialState: State = {
    isLoading: true,
    asset: {
        id: '',
        name: '',
        description: '',
        active: false,
        parent: '',
        staysMap: [],
        stays: [],
        price: 0,
        currency: ''
    },
    stays: [],
    addStayModalIsOpen: false,
    manageAssetModalIsOpen: false,
    newStay: {
        startDate: null,
        endDate: null
    }
};

export default (state = initialState, action: AnyAction): State => {
    const update = (payload: {}, stateArg = state) => Object.assign({}, stateArg, payload);
    const isLoading = (stateArg = state) => update({ isLoading: true }, state);
    const resetNewStay = (stateArg = state) => update({ newStay: initialState.newStay }, state);

    switch (action.type) {
        case t.FETCH_ASSET:
            Hub.getInstance().getAsset(action.payload.propertyContractAddress + '&' + action.payload.assetId);
            return isLoading();
        case t.ASSET_FETCHED:
            return update({
                asset: action.payload,
                isLoading: false,
            });
        case t.TOGGLE_ADD_STAY_MODAL:
            return update({ addStayModalIsOpen: action.payload });
        case t.UPDATE_NEW_STAY:
            return update({ newStay: action.payload.dateRange });
        case t.ADD_STAY:
            propertyService.init(action.payload.propertyContractAddress);
            propertyService.addStay(action.payload.assetId, action.payload.newStay, action.payload.context, action.payload.cb);
            return resetNewStay(isLoading());
        case t.TOGGLE_MANAGE_ASSET_MODAL:
            return update({ manageAssetModalIsOpen: action.payload });
        case t.UPDATE_MANAGE_ASSET:
            const updatedAsset = Object.assign({}, state.asset, { [action.payload.prop]: action.payload.value });
            return update({ asset: updatedAsset });
        case t.SAVE_ASSET:
            Hub.getInstance().postAsset(action.payload.asset, action.payload.cb);
            return update({ manageAssetModalIsOpen: false });
        default:
            return state;
    }
};