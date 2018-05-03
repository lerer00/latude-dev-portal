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
import { addCompanyAction, toggleAddCompanyModalAction, updateNewCompanyAction, fetchCompaniesAction } from './actions';
import AddCompanyModal from '../../components/modals/addCompanyModal';

class Companies extends React.Component<Props> {
    static contextTypes = {
        web3: PropTypes.object
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.fetchCompanies(this.context);
    }

    render() {
        const routes: Breadcrumbs.Crumb[] = [
            {
                name: 'Companies',
                path: '/companies',
                active: true,
            }
        ];

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
                        modalIsOpen={this.props.addCompanyModalIsOpen}
                        modalClose={this.props.closeAddCompanyModal}
                        company={this.props.newCompany}
                        addCompany={() => this.props.addCompany(this.props.newCompany, this.context)}
                        updateCompany={this.props.updateNewCompany}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const companiesState: State = state['companies'];
    return {
        isLoading: companiesState.isLoading,
        companies: companiesState.companies,
        addCompanyModalIsOpen: companiesState.addCompanyModalIsOpen,
        newCompany: companiesState.newCompany,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        addCompany: (newCompany: CompanyModel, context: Context) => {
            dispatch(addCompanyAction(newCompany, context, () => {
                toast.success('Success, company was added.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
            dispatch(toggleAddCompanyModalAction(false));
        },
        openAddCompanyModal: () => { dispatch(toggleAddCompanyModalAction(true)); },
        closeAddCompanyModal: () => { dispatch(toggleAddCompanyModalAction(false)); },
        fetchCompanies: (context: Context) => { dispatch(fetchCompaniesAction(context)); },
        updateNewCompany: (prop: string, value: string) => { dispatch(updateNewCompanyAction(prop, value)); },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);