import * as React from 'react';
import * as PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import BigCalendar from 'react-big-calendar';
import { Dispatch } from 'redux';
import { Breadcrumbs } from '../../breadcrumbs';
import { Button, IButtonState } from '../../components/button';
import { connect } from 'react-redux';
import { IAsset } from '../../models/asset';
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const moment = require('moment');
const { toast } = require('react-toastify');
import { Props, State, StayModel, Context } from './model';
import {
    fetchAssetAction, toggleAddStayModalAction, updateNewStayAction, addStayAction,
    toggleManageAssetModalAction, updateManageAssetAction, saveAssetAction,
    updateManageAssetAddAmenityAction, updateManageAssetRemoveAmenityAction
} from './actions';
import AddStayModal from '../../components/modals/addStayModal';
import ManageAssetModal from '../../components/modals/manageAssetModal';

export interface CalendarEvent {
    title: string;
    allDay: boolean;
    start: Date;
    end: Date;
    desc: string;
}

class Asset extends React.Component<Props> {
    static contextTypes = {
        web3: PropTypes.object
    };

    constructor() {
        super();

        // initializing the calendar
        BigCalendar.momentLocalizer(moment);
    }
    componentDidMount() {
        this.props.fetchAsset(this.props.match.params.pid, this.props.match.params.aid);
    }

    ConvertStaysIntoEvents() {
        return this.props.asset.stays.map(s => { return this.CreateEvent(s); });
    }

    CreateEvent(stay: any) {
        var startDate: any = new Date(stay.checkInUtc * 1000);
        var endDate: any = new Date(stay.checkInUtc * 1000);
        endDate.setDate(endDate.getDate() + parseInt(stay.duration, 10));

        var event: CalendarEvent = {
            title: 'Booking',
            desc: '',
            allDay: true,
            start: startDate,
            end: endDate
        };

        return event;
    }

    render() {
        const routes: Breadcrumbs.Crumb[] = [                
            {
                name: 'Properties',
                path: '/properties/',
                active: true,
            },
            {
                name: this.props.match.params.pid,
                path: '/properties/' + this.props.match.params.pid,
                active: true,
            },
            {
                name: 'Assets',
                path: '/properties/' + this.props.match.params.pid + '/assets',
                active: false,
            },
            {
                name: this.props.match.params.aid,
                path: '/properties/' + this.props.match.params.pid +
                    '/assets/' + this.props.match.params.aid,
                active: true,
            },
        ];

        var content;
        if (this.props.isLoading) {
            content = <Spinner text='loading asset...' />;
        } else {
            var stays = this.ConvertStaysIntoEvents();
            content = (
                <div className='informations'>
                    <p className='asset-name'>Name: {this.props.asset.name || 'Asset ' + this.props.match.params.aid}</p>
                    <p className='asset-description'>Description: {this.props.asset.description}</p>
                    <p className='asset-price'>Price: {this.props.asset.price} {this.props.asset.currency}</p>
                    <br />
                    <BigCalendar
                        className='custom-calendar'
                        views={['month', 'week']}
                        events={stays}
                    />
                </div>
            );
        }

        return (
            <section className='asset-detail'>
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='action'>
                        <Button text='Add stay' state={IButtonState.default} action={this.props.openAddStayModal} />
                        <Button text='Manage asset' state={IButtonState.default} action={this.props.openManageAssetModal} />
                    </div>
                    <div className='content'>
                        {content}
                    </div>

                    <AddStayModal
                        modalIsOpen={this.props.addStayModalIsOpen}
                        modalClose={this.props.closeAddStayModal}
                        stay={this.props.newStay}
                        addStay={() => this.props.addStay(this.props.match.params.pid, this.props.match.params.aid, this.props.newStay, this.context)}
                        updateStay={this.props.updateNewStay}
                    />

                    <ManageAssetModal
                        modalIsOpen={this.props.manageAssetModalIsOpen}
                        modalClose={this.props.closeManageAssetModal}
                        asset={this.props.asset}
                        saveAsset={() => this.props.saveAsset(this.props.asset)}
                        updateAsset={this.props.updateAsset}
                        addAmenity={this.props.addAssetAmenity}
                        removeAmenity={this.props.removeAssetAmenity}
                    />
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: {}) => {
    const assetState: State = state['asset'];
    return {
        isLoading: assetState.isLoading,
        asset: assetState.asset,
        stays: assetState.stays,
        addStayModalIsOpen: assetState.addStayModalIsOpen,
        manageAssetModalIsOpen: assetState.manageAssetModalIsOpen,
        newStay: assetState.newStay
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        fetchAsset: (propertyContractAddress: string, assetId: string) => { dispatch(fetchAssetAction(propertyContractAddress, assetId)); },

        openAddStayModal: () => { dispatch(toggleAddStayModalAction(true)); },
        closeAddStayModal: () => { dispatch(toggleAddStayModalAction(false)); },
        updateNewStay: (dateRange: any) => { dispatch(updateNewStayAction(dateRange)); },
        addStay: (propertyContractAddress: string, assetId: string, newStay: StayModel, context: Context) => {
            dispatch(addStayAction(propertyContractAddress, assetId, newStay, context, () => {
                toast.success('Success, stay was added.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
            dispatch(toggleAddStayModalAction(false));
        },

        openManageAssetModal: () => { dispatch(toggleManageAssetModalAction(true)); },
        closeManageAssetModal: () => { dispatch(toggleManageAssetModalAction(false)); },
        updateAsset: (prop: string, value: any) => { dispatch(updateManageAssetAction(prop, value)); },
        addAssetAmenity: (amenity: any) => { dispatch(updateManageAssetAddAmenityAction(amenity)); },
        removeAssetAmenity: (amenity: any) => { dispatch(updateManageAssetRemoveAmenityAction(amenity)); },
        saveAsset: (asset: IAsset, context: Context) => {
            dispatch(saveAssetAction(asset, () => {
                toast.success('Success, asset saved.', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Asset);