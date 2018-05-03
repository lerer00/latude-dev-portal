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
    property: IProperty;
    propertyImages: Array<File>;
    assets: Array<any>;
    addAssetModalIsOpen: boolean;
    managePropertyModalIsOpen: boolean;
    newAsset: {
        price: number;
        currency: string;
    };
}

export type Props = State & {
    match: any;
    fetchAssets: (propertyContractAddress: string, context: Context) => void;
    fetchProperty: (propertyContractAddress: string) => void;

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
};
