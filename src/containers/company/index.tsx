import * as React from 'react';
import * as PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import Property from '../../components/tiles/property';
import EmptySearch from '../../components/emptySearch';
import { Dispatch } from 'redux';
import { Breadcrumbs } from '../../breadcrumbs';
import { Button, IButtonState } from '../../components/button';
import { connect } from 'react-redux';
import './index.css';

const { toast } = require('react-toastify');
import { Props, State, PropertyModel, Context } from './model';
import { addPropertyAction, toggleAddPropertyModalAction, fetchPropertiesAction, updateNewPropertyAction } from './actions';
import AddPropertyModal from '../../components/modals/addPropertyModal';

class Company extends React.Component<Props> {
    static contextTypes = {
        web3: PropTypes.object
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.fetchProperties(this.props.match.params.cid);
    }

    render() {
        const routes: Breadcrumbs.Crumb[] = [
            {
                name: 'Companies',
                path: '/companies',
                active: true,
            },
            {
                name: this.props.match.params.cid,
                path: '/companies/' + this.props.match.params.cid,
                active: true,
            }
        ];

        var content;
        if (this.props.isLoading) {
            content = (
                <Spinner text='loading company...' />
            );
        } else {
            if (this.props.properties.length > 0) {
                content = this.props.properties.map((id) =>
                    <Property company={this.props.match.params.cid} key={id} id={id} />
                );
            } else {
                content = <EmptySearch text='You do not have any properties...' />;
            }
        }

        return (
            <section className='company-detail'>
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='actions'>
                        <Button text='Add property' state={IButtonState.default} action={this.props.openAddPropertyModal} />
                    </div>
                    <div className='content'>
                        {content}
                    </div>

                    <AddPropertyModal
                        modalIsOpen={this.props.addPropertyModalIsOpen}
                        modalClose={this.props.closeAddPropertyModal}
                        property={this.props.newProperty}
                        addProperty={() => this.props.addProperty(this.props.match.cid, this.props.newProperty, this.context)}
                        updateProperty={this.props.updateNewProperty}
                    />
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const companyState: State = state['company'];
    return {
        isLoading: companyState.isLoading,
        properties: companyState.properties,
        addPropertyModalIsOpen: companyState.addPropertyModalIsOpen,
        newProperty: companyState.newProperty,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        fetchProperties: (companyContractAddress: string) => { dispatch(fetchPropertiesAction(companyContractAddress)); },
        addProperty: (companyContractAddress: string, newProperty: PropertyModel, context: Context) => {
            dispatch(addPropertyAction(companyContractAddress, newProperty, context, () => {
                toast.success('Success, property was added.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
            dispatch(toggleAddPropertyModalAction(false));
        },
        openAddPropertyModal: () => { dispatch(toggleAddPropertyModalAction(true)); },
        closeAddPropertyModal: () => { dispatch(toggleAddPropertyModalAction(false)); },
        updateNewProperty: (prop: string, value: string) => { dispatch(updateNewPropertyAction(prop, value)); },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);