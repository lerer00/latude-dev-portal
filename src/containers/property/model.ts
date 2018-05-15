import { IProperty } from '../../models/property';

export type AssetModel = {
    price: number;
    currency: string;
};

export type Context = {
    web3: {};
};

export interface State {
    isLoading: boolean;
    owner: string;
    balance: number;
    property: IProperty;
    propertyImages: Array<File>;
    assets: Array<any>;
    addAssetModalIsOpen: boolean;
    managePropertyModalIsOpen: boolean;
    deletePropertyModalIsOpen: boolean;
    withdrawFundModalIsOpen: boolean;
    newAsset: {
        price: number;
        currency: string;
    };
}

export type Props = State & {
    match: any;
    fetchProperty: (propertyContractAddress: string) => void;
    fetchAssets: (propertyContractAddress: string, context: Context) => void;
    fetchOwner: (propertyContractAddress: string, context: Context) => string;
    fetchBalance: (propertyContractAddress: string) => number;

    openAddAssetModal: () => void;
    closeAddAssetModal: () => void;
    updateNewAsset: (prop: string, value: string) => void;
    addAsset: (propertyContractAddress: string, newAsset: AssetModel, context: Context) => void;

    openManagePropertyModal: () => void;
    closeManagePropertyModal: () => void;
    updateProperty: (prop: string, value: any) => void;
    updatePropertyAmenities: (prop: string, value: any) => void;
    updatePropertyLocation: (coordinates: Array<number>, type: string) => void;
    updatePropertyImages: (files: Array<File>) => void;
    saveProperty: (property: IProperty, images: Array<File>) => void;

    openDeletePropertyModal: () => void;
    closeDeletePropertyModal: () => void;
    deletePropertyYes: (propertyContractAddress: string, context: Context) => void;
    deletePropertyCancel: () => void;

    openWithdrawFundModal: () => void;
    closeWithdrawFundModal: () => void;
    withdrawFund: (propertyContractAddress: string, context: Context) => void;
    withdrawFundCancel: () => void;
};
