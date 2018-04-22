import { IAsset } from '../../models/asset';

export type StayModel = {
    startDate: any;
    endDate: any;
};

export type Context = {
    web3: {};
};

export interface State {
    isLoading: boolean;
    asset: IAsset;
    stays: Array<any>;
    addStayModalIsOpen: boolean;
    manageAssetModalIsOpen: boolean;
    newStay: {
        startDate: any;
        endDate: any;
    };
}

export type Props = State & {
    match: any;
    fetchAsset: (propertyContractAddress: string, assetId: string) => void;

    openAddStayModal: () => void;
    closeAddStayModal: () => void;
    updateNewStay: (dateRange: any) => void;
    addStay: (propertyContractAddress: string, assetId: string, newStay: StayModel, context: Context) => void;

    openManageAssetModal: () => void;
    closeManageAssetModal: () => void;
    updateAsset: (prop: string, value: any) => void;
    addAssetAmenity: (amenity: any) => void;
    removeAssetAmenity: (amenity: any) => void;
    saveAsset: (asset: IAsset) => void;
};
