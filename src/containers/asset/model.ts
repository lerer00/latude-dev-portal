import { IAsset } from '../../models/asset';

export type BookingModel = {
    startDate: any;
    endDate: any;
};

export type Context = {
    web3: {};
};

export interface State {
    isLoading: boolean;
    asset: IAsset;
    bookings: Array<any>;
    addBookingModalIsOpen: boolean;
    manageAssetModalIsOpen: boolean;
    newBooking: {
        startDate: any;
        endDate: any;
    };
}

export type Props = State & {
    match: any;
    fetchAsset: (propertyContractAddress: string, assetId: string) => void;

    openAddBookingModal: () => void;
    closeAddBookingModal: () => void;
    updateNewBooking: (dateRange: any) => void;
    addBooking: (propertyContractAddress: string, assetId: string, newBooking: BookingModel, context: Context) => void;

    openManageAssetModal: () => void;
    closeManageAssetModal: () => void;
    updateAsset: (prop: string, value: any) => void;
    addAssetAmenity: (amenity: any) => void;
    removeAssetAmenity: (amenity: any) => void;
    saveAsset: (asset: IAsset) => void;
};
