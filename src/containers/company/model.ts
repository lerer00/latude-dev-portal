export type PropertyModel = {
    name: string;
};

export type Context = {
    web3: {};
};

export interface State {
    isLoading: boolean;
    properties: string[];
    addPropertyModalIsOpen: boolean;
    newProperty: {
        name: string;
    };
}

export type Props = State & {
    match: any;
    fetchProperties: (companyContractAddress: string) => void;
    addProperty: (companyContractAddress: string, newProperty: PropertyModel, context: Context) => void;
    openAddPropertyModal: () => void;
    closeAddPropertyModal: () => void;
    updateNewProperty: (prop: string, value: string) => void;
};
