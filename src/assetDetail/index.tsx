import * as React from 'react';
import * as PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import { Breadcrumbs } from '../breadcrumbs';
import { Button, IButtonState } from '../components/button';
import { egoCloseHexagon, egoAddHexagon1, egoCalendar2, egoStoreMobile, egoDataTransfer } from '../img/index';
import { IAsset } from '../models/asset';
import Authentication from '../services/authentication/authentication';
import HubRequest from '../services/rest/hubRequest';
import axios from 'axios';
import Spinner from '../components/spinner';
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const web3 = window['web3'];
const Modal = require('react-modal');
const moment = require('moment');
const DateRange = require('react-date-range').DateRange;
const contract = require('truffle-contract');
const PropertyContract = require('../build/contracts/Property.json');
const propertyContract = contract(PropertyContract);

const manageAssetModalStyles = {
    content: {
        padding: '16px',
        width: '600px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        overflow: 'none',
        borderRadius: '3px',
        borderColor: '#C0C0C0',
        boxShadow: '3px 3px 15px #7F7F7F',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
    }
};

export interface CalendarEvent {
    title: string;
    allDay: boolean;
    start: Date;
    end: Date;
    desc: string;
}

export namespace AssetDetail {
    export interface Props {
        match: any;
    }

    export interface State {
        loading: boolean;
        addStayModalIsOpen: boolean;
        manageAssetModalIsOpen: boolean;
        asset: IAsset;
        stays: Array<Object>;
        dateRange: any;
    }
}

class AssetDetail extends React.Component<AssetDetail.Props, AssetDetail.State> {
    constructor(props?: AssetDetail.Props, context?: any) {
        super(props, context);

        // initializing the calendar
        BigCalendar.momentLocalizer(moment);

        this.state = {
            loading: true,
            addStayModalIsOpen: false,
            manageAssetModalIsOpen: false,
            asset: {
                id: '',
                name: '',
                description: '',
                active: false,
                parent: '',
                staysMap: {},
                stays: [],
                price: -1,
                currency: 'XXX'
            },
            stays: [],
            dateRange: {
                startDate: null,
                endDate: null
            }
        };

        this.manageAssetOnRequestClose = this.manageAssetOnRequestClose.bind(this);
        this.manageAssetOnRequestOpen = this.manageAssetOnRequestOpen.bind(this);
        this.manageAssetHandleChanges = this.manageAssetHandleChanges.bind(this);
        this.addStayOnRequestOpen = this.addStayOnRequestOpen.bind(this);
        this.addStayOnRequestClose = this.addStayOnRequestClose.bind(this);
        this.handleDateRangeSelect = this.handleDateRangeSelect.bind(this);
        this.addStay = this.addStay.bind(this);
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentDidMount() {
        propertyContract.setProvider(web3.currentProvider);
        this.getAsset();
    }

    getAsset() {
        axios.get(process.env.REACT_APP_HUB_URL + '/assets/' + this.props.match.params.pid + '&' + this.props.match.params.aid).then((result) => {
            this.setState({
                asset: result.data,
                loading: false
            }, () => { this.convertStaysToEvents(); });
        }).catch((error) => {
            propertyContract.at(this.props.match.params.pid).then((instance: any) => {
                return instance.getAsset.call(this.props.match.params.aid, { from: this.context.web3.selectedAccount });
            }).then((result: any) => {
                var tmpAsset = this.state.asset;
                tmpAsset.name = 'Asset ' + result[0].toNumber();
                tmpAsset.price = result[1].toNumber();
                tmpAsset.currency = result[2];
                this.setState({
                    asset: tmpAsset,
                    loading: false
                });
            });
        });
    }

    saveAsset(e: any) {
        e.preventDefault();

        var hubRequest = new HubRequest(Authentication.getInstance());
        hubRequest.postAsset(this.state.asset).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });

        this.setState({
            manageAssetModalIsOpen: false
        });
    }

    convertStaysToEvents() {
        this.state.asset.stays.forEach(stay => {
            this.getStay(stay.checkInUtc);
        });
    }

    // this fetch more information about each stay
    getStay(id: any) {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.getStay.call(this.props.match.params.aid, id, { from: this.context.web3.selectedAccount });
        }).then((stay: any) => {
            var event = this.convertStayToEvent(stay);
            var tmpStays = this.state.stays;
            tmpStays.push(event);
            this.setState({
                stays: tmpStays
            }, () => {
                this.forceUpdate();
            });
        });
    }

    convertStayToEvent(stay: Array<any>): CalendarEvent {
        var startDate: any = new Date(stay[0].toNumber() * 1000);
        var endDate: any = new Date(stay[1].toNumber() * 1000);

        var event: CalendarEvent = {
            title: 'Booking',
            desc: '',
            allDay: true,
            start: startDate,
            end: endDate
        };

        return event;
    }

    // add a stay to a specific asset
    addStay(e: any) {
        var propertyInstance: any;
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            propertyInstance = instance;
            var durationInDays = this.state.dateRange.endDate.diff(this.state.dateRange.startDate, 'days');
            return propertyInstance.getStayPriceInWei.call(this.props.match.params.aid, durationInDays, { from: this.context.web3.selectedAccount });
        }).then((priceInWei: any) => {
            var start = this.state.dateRange.startDate.unix();
            var end = this.state.dateRange.endDate.unix();

            return propertyInstance.addStay(
                this.props.match.params.aid,
                start,
                end,
                {
                    from: this.context.web3.selectedAccount,
                    value: priceInWei
                });
        }).then((receipt: any) => {
            this.addStayOnRequestClose();
        });
    }

    addStayOnRequestOpen() {
        this.setState({
            addStayModalIsOpen: true
        });
    }

    addStayOnRequestClose() {
        this.setState({
            addStayModalIsOpen: false
        });
    }

    manageAssetOnRequestClose() {
        this.setState({
            manageAssetModalIsOpen: false
        });
    }

    manageAssetOnRequestOpen() {
        this.setState({
            manageAssetModalIsOpen: true
        });
    }

    manageAssetHandleChanges(property: string, e: any) {
        var tmp = this.state.asset;
        tmp[property] = e.target.value;
        this.setState({
            asset: tmp
        });
    }

    handleDateRangeSelect(range: any) {
        this.setState({
            dateRange: range
        });
    }

    render() {
        var content;
        if (this.state.loading) {
            content = <Spinner text='loading asset...' />;
        } else {
            content = (
                <div className='informations'>
                    <p className='asset-name'>Name: {this.state.asset.name || 'Asset ' + this.props.match.params.aid}</p>
                    <p className='asset-description'>Description: {this.state.asset.description}</p>
                    <p className='asset-price'>Price: {this.state.asset.price} {this.state.asset.currency}</p>
                    <br />
                    <BigCalendar
                        className='custom-calendar'
                        views={['month', 'week']}
                        events={this.state.stays}
                    />
                </div>
            );
        }

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
            },
            {
                name: 'Properties',
                path: '/companies/' + this.props.match.params.cid + '/properties/',
                active: false,
            },
            {
                name: this.props.match.params.pid,
                path: '/companies/' + this.props.match.params.cid +
                    '/properties/' + this.props.match.params.pid,
                active: true,
            },
            {
                name: 'Assets',
                path: '/companies/' + this.props.match.params.cid +
                    '/properties/' + this.props.match.params.pid + '/assets',
                active: false,
            },
            {
                name: this.props.match.params.aid,
                path: '/companies/' + this.props.match.params.cid +
                    '/properties/' + this.props.match.params.pid +
                    '/assets/' + this.props.match.params.aid,
                active: true,
            },
        ];

        return (
            <section className='asset-detail'>
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='action'>
                        <Button text='Add stay' state={IButtonState.default} action={this.addStayOnRequestOpen} />
                        <Button text='Manage asset' state={IButtonState.default} action={this.manageAssetOnRequestOpen} />
                    </div>
                    <div className='content'>
                        {content}
                    </div>

                    <Modal
                        isOpen={this.state.manageAssetModalIsOpen}
                        onRequestClose={this.manageAssetOnRequestClose}
                        style={manageAssetModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Manage asset</h1>
                            <img className='close' src={egoCloseHexagon} onClick={this.manageAssetOnRequestClose} />
                        </div>
                        <div className='modal-content'>
                            <div className='visual-tip'>
                                <img className='tip' src={egoStoreMobile} />
                                <img className='action' src={egoDataTransfer} />
                            </div>
                            <p className='description'>Set details about this current asset. Some are read-only and cannot be modified.</p>
                            <form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='label'><label>Description:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.asset.description}
                                                    placeholder='small description'
                                                    onChange={(e) => this.manageAssetHandleChanges('description', e)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className='modal-actions'>
                            <button className='button' onClick={(e) => this.saveAsset(e)}>Save</button>
                            <button className='action close' onClick={this.manageAssetOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.addStayModalIsOpen}
                        onRequestClose={this.addStayOnRequestClose}
                        style={manageAssetModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Add stay</h1>
                            <img className='close' src={egoCloseHexagon} onClick={this.addStayOnRequestClose} />
                        </div>
                        <div className='modal-content'>
                            <div className='visual-tip'>
                                <img className='tip' src={egoCalendar2} />
                                <img className='action' src={egoAddHexagon1} />
                            </div>
                            <p className='description'>
                                Add a stay for this asset.
                                Choose a starting and ending date.
                                Note that the last day is not included within your stay, it's the date your are checking out.
                            </p>
                            <DateRange
                                className='select-range'
                                calendars={1}
                                onInit={this.handleDateRangeSelect}
                                onChange={this.handleDateRangeSelect}
                            />
                            <p>
                                Arrival: {
                                    this.state.dateRange.startDate &&
                                    this.state.dateRange.startDate.format('dddd, D MMMM YYYY').toString()
                                }
                            </p>
                            <p>
                                Departure: {
                                    this.state.dateRange.endDate &&
                                    this.state.dateRange.endDate.format('dddd, D MMMM YYYY').toString()
                                }
                            </p>
                        </div>
                        <div className='modal-actions'>
                            <button className='button' onClick={(e) => this.addStay(e)}>Save</button>
                            <button className='action close' onClick={this.addStayOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}

export default AssetDetail;