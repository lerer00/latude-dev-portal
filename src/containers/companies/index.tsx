import * as React from 'react';
import * as PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import CompanyTile from '../../components/tiles/company';
import EmptySearch from '../../components/emptySearch';
import { Dispatch } from 'redux';
import { Breadcrumbs } from '../../breadcrumbs';
import { Button, IButtonState } from '../../components/button';
import { connect } from 'react-redux';
import './index.css';

const { toast } = require('react-toastify');
import { Props, State, CompanyModel, Context } from './model';
import { addAction, toggleModalAction, updateNewCompanyAction, fetchCompaniesAction } from './actions';
import AddCompanyModal from '../../components/modals/addCompanyModal';

const routes: Breadcrumbs.Crumb[] = [
    {
        name: 'Companies',
        path: '/companies',
        active: true,
    }
];

class Companies extends React.Component<Props> {
    static contextTypes = {
        web3: PropTypes.object
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.fetchCompanies();
    }

    render() {
        var content;
        if (this.props.isLoading) {
            content = (
                <Spinner text='loading companies...' />
            );
        } else {
            if (this.props.companies.length > 0) {
                content = this.props.companies.map((id) =>
                    <CompanyTile key={id} id={id} />
                );
            } else {
                content = <EmptySearch text='You do not have any companies...' />;
            }
        }

        return (
            <div className='companies' >
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='actions'>
                        <Button text='Add company' state={IButtonState.default} action={this.props.openAddCompanyModal} />
                    </div>
                    <div className='content'>
                        {content}
                    </div>

                    <AddCompanyModal
                        modalOpen={this.props.modalOpen}
                        newCompany={this.props.newCompany}
                        addCompany={() => this.props.addCompany(this.props.newCompany, this.context)}
                        closeAddCompanyModal={this.props.closeAddCompanyModal}
                        updateNewCompany={this.props.updateNewCompany}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const companiesState: State = state['companies'];
    return {
        modalOpen: companiesState.modalOpen,
        companies: companiesState.companies,
        newCompany: companiesState.newCompany,
        isLoading: companiesState.isLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        addCompany: (newCompany: CompanyModel, context: Context) => {
            dispatch(addAction(newCompany, context, () => {
                toast.success('Success, company was added.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
            dispatch(toggleModalAction(false));
        },
        openAddCompanyModal: () => { dispatch(toggleModalAction(true)); },
        closeAddCompanyModal: () => { dispatch(toggleModalAction(false)); },
        fetchCompanies: () => { dispatch(fetchCompaniesAction()); },
        updateNewCompany: (prop: string, value: string) => { dispatch(updateNewCompanyAction(prop, value)); },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);