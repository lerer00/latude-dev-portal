export type CompanyModel = {
    name: string;
};

export type Context = {
    web3: {};
};

export interface State {
    isLoading: boolean;
    companies: string[];
    modalOpen: boolean;
    newCompany: {
        name: string;
    };
}

export type Props = State & {
    fetchCompanies: () => void;
    addCompany: (newCompany: CompanyModel, context: Context) => void;
    openAddCompanyModal: () => void;
    closeAddCompanyModal: () => void;
    updateNewCompany: (prop: string, value: string) => void;
};