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

class Properties extends React.Component<Props> {
    static contextTypes = {
        web3: PropTypes.object
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.fetchProperties(this.context);
    }

    render() {
        const routes: Breadcrumbs.Crumb[] = [
            {
                name: 'Properties',
                path: '/properties',
                active: true,
            }
        ];

        var content;
        if (this.props.isLoading) {
            content = (
                <Spinner text='loading properties...' />
            );
        } else {
            if (this.props.properties.length > 0) {
                content = this.props.properties.map((id) =>
                    <Property key={id} id={id} />
                );
            } else {
                content = <EmptySearch text='You do not have any properties...' />;
            }
        }

        return (
            <section className='properties-detail'>
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
                        addProperty={() => this.props.addProperty(this.props.newProperty, this.context)}
                        updateProperty={this.props.updateNewProperty}
                    />
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const propertiesState: State = state['properties'];
    return {
        isLoading: propertiesState.isLoading,
        properties: propertiesState.properties,
        addPropertyModalIsOpen: propertiesState.addPropertyModalIsOpen,
        newProperty: propertiesState.newProperty,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        fetchProperties: (context: Context) => { dispatch(fetchPropertiesAction(context)); },
        addProperty: (newProperty: PropertyModel, context: Context) => {
            dispatch(addPropertyAction(newProperty, context, () => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Properties);