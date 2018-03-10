import * as React from 'react';
import * as PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import { Breadcrumbs } from '../breadcrumbs';
import { Button, IButtonState } from '../components/button';
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
const egoCloseHexagon = require('../img/ego/close-hexagon.svg');
const egoCalendar2 = require('../img/ego/calendar-2.svg');
const egoAddHexagon1 = require('../img/ego/add-hexagon-1.svg');

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
        // ipfs: any;
        addStayModalIsOpen: boolean;
        manageAssetModalIsOpen: boolean;
        asset: any;
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
            // ipfs: ipfsAPI('localhost', '5001', { protocol: 'http' }),
            addStayModalIsOpen: false,
            manageAssetModalIsOpen: false,
            asset: {
                name: '',
                description: '',
                type: '',
                price: -1,
                currency: 'XXX',
                events: []
            },
            dateRange: {
                startDate: null,
                endDate: null
            }
        };

        this.upsertAsset = this.upsertAsset.bind(this);
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
        this.getStays();
        this.retrieveLastAssetHash();
    }

    getAsset() {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.getAsset.call(this.props.match.params.aid, { from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            var tmpAsset = {
                name: 'Asset ' + result[0].toNumber(),
                description: '',
                type: '',
                price: result[1].toNumber(),
                currency: result[2],
                events: []
            };
            this.setState({
                asset: tmpAsset
            });
        });
    }

    // this returns all stays id
    getStays() {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            // Get unix date -30 days from now and +30 days from now.
            var start = new Date();
            var end = new Date();
            start.setDate(start.getDate() - 30);
            end.setDate(end.getDate() + 30);

            // Unix format.
            var startUnix = Math.round(start.getTime() / 1000);
            var endUnix = Math.round(end.getTime() / 1000);

            return instance.getStays.call(this.props.match.params.aid, startUnix, endUnix, { from: this.context.web3.selectedAccount });
        }).then((result: Array<any>) => {
            // For now we are getting an array with a maximum of 64 stays wich can be empty.
            for (let i = 0; i < result.length; i++) {
                if (result[i].toNumber() === 0) {
                    break;
                }

                this.getStay(result[i]);
            }
        });
    }

    // this fetch more information about each stay
    getStay(id: any) {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.getStay.call(this.props.match.params.aid, id, { from: this.context.web3.selectedAccount });
        }).then((stay: any) => {
            var event = this.convertStayToEvent(stay);
            var tmpAsset = this.state.asset;
            tmpAsset.events.push(event);
            this.setState({
                asset: tmpAsset
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

            // This is only to ease development, we can copy paste it later.
            console.log(start + ', ' + end);

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

    addAssetHash(hash: string) {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.addMetadataHashForAsset(this.props.match.params.aid, hash, { from: this.context.web3.selectedAccount });
        }).then(() => {
            this.manageAssetOnRequestClose();
        });
    }

    retrieveLastAssetHash() {
        propertyContract.at(this.props.match.params.pid).then((instance: any) => {
            return instance.lastMetadataHashForAsset.call(this.props.match.params.aid, { from: this.context.web3.selectedAccount });
        }).then((hash: string) => {
            this.setState({
                loading: false
            });
            this.getFile(hash);
        }).catch((error: any) => {
            this.setState({
                loading: false
            });
        });
    }

    getFile(hash: string) {
        // this.state.ipfs.files.cat(hash, (err: any, stream: any) => {
        //     if (err) {
        //         throw err;
        //     }
        //     stream.pipe(bl((e: any, d: any) => {
        //         if (e) {
        //             throw err;
        //         }

        //         var ipfsAsset = JSON.parse(d.toString());
        //         var tmpAsset = this.state.asset;
        //         tmpAsset.description = ipfsAsset.description;
        //         tmpAsset.type = ipfsAsset.type;
        //         this.setState({
        //             asset: tmpAsset
        //         });
        //     }));
        // });
    }

    upsertAsset(e: any) {
        e.preventDefault();

        // var filteredAsset = {
        //     description: this.state.asset.description,
        //     type: this.state.asset.type
        // };

        // const files = [
        //     {
        //         path: this.props.match.url + '.json',
        //         content: JSON.stringify(filteredAsset)
        //     }
        // ];
        // this.state.ipfs.files.add(files, null, (err: any, result: any) => {
        //     if (err) {
        //         throw err;
        //     }

        //     this.addAssetHash(result[0].hash);
        // });
    }

    // will need to be moved elsewhere
    toAscii = function (hex: string) {
        var str = '',
            i = 0,
            l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) { continue; } // this is added
            str += String.fromCharCode(code);
        }
        return str;
    };

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
                    <p className='asset-name'>{this.state.asset.name}</p>
                    <p className='asset-description'>Description: {this.state.asset.description}</p>
                    <p className='asset-price'>Price: {this.state.asset.price} {this.toAscii(this.state.asset.currency)}</p>
                    <p className='asset-type'>Type: {this.state.asset.type}</p>
                    <br />
                    <BigCalendar
                        className='custom-calendar'
                        views={['month', 'week']}
                        events={this.state.asset.events}
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
                                <img className='tip' src={egoCalendar2} />
                                <img className='action' src={egoAddHexagon1} />
                            </div>
                            <p className='description'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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
                                        <tr>
                                            <td className='label'><label>Type:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.asset.type}
                                                    placeholder='room, bed or conference room'
                                                    onChange={(e) => this.manageAssetHandleChanges('type', e)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className='modal-actions'>
                            <button className='button' onClick={(e) => this.upsertAsset(e)}>Save</button>
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
                            <p className='description'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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