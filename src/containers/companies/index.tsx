import * as React from 'react';
import * as PropTypes from 'prop-types';
import Company from '../../components/company';
import AddCompanyModal from '../../components/addCompanyModal';
import { Dispatch } from 'redux';
import { Breadcrumbs } from '../../breadcrumbs';
import Spinner from '../../components/spinner';
import { connect } from 'react-redux';
import './index.css';
const { toast } = require('react-toastify');

import { egoPenChecklist } from '../../img';

import { Props, State, CompanyModel, Context } from './model';
import { addAction, toggleModalAction, updateNewCompanyAction, fetchCompaniesAction } from './actions';

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

  constructor(props: Props, context: Context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.fetchCompanies();
  }

  render() {
    const spinner = <Spinner text={'Loading'} />;
    const companies = this.props.companies.map((id) =>
      <Company key={id} id={id} />
    );

    const content = this.props.isLoading ? spinner : companies;

    return (
      <div className='companies'>
        <div className='content'>
          <Breadcrumbs routes={routes} />
          <button className='add-company' onClick={this.props.openAddCompanyModal}>
            <img className='add-company-icon' src={egoPenChecklist} />
            <span className='add-company-text'>Add company</span>
          </button>
          <AddCompanyModal
            modalOpen={this.props.modalOpen}
            newCompany={this.props.newCompany}
            addCompany={() => this.props.addCompany(this.props.newCompany, this.context)}
            closeAddCompanyModal={this.props.closeAddCompanyModal}
            updateNewCompany={this.props.updateNewCompany}
          />
          {content}
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