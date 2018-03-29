import * as React from 'react';
import * as PropTypes from 'prop-types';
import Property from './property';
import EmptySearch from '../components/emptySearch';
import { Breadcrumbs } from '../breadcrumbs';
import { Button, IButtonState } from '../components/button';
import Spinner from '../components/spinner';
import './index.css';
import './addPropertyModal.css';

const web3 = window['web3'];
const Modal = require('react-modal');
const { toast } = require('react-toastify');
const contract = require('truffle-contract');
const CompanyContract = require('../build/contracts/Company.json');
const companyContract = contract(CompanyContract);
const egoCloseHexagon = require('../img/ego/close-hexagon.svg');
const egoBuilding10 = require('../img/ego/building-10.svg');
const egoAddHexagon1 = require('../img/ego/add-hexagon-1.svg');

const addPropertyModalStyles = {
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

export namespace CompanyDetail {
    export interface Props {
        match: any;
    }

    export interface State {
        loading: boolean;
        properties: Array<string>;
        addPropertyModalIsOpen: boolean;
        addProperty: any;
    }
}

class CompanyDetail extends React.Component<CompanyDetail.Props, CompanyDetail.State> {
    constructor(props?: CompanyDetail.Props, context?: any) {
        super(props, context);

        this.state = {
            loading: true,
            properties: [],
            addPropertyModalIsOpen: false,
            addProperty: {
                name: ''
            }
        };

        this.addProperty = this.addProperty.bind(this);
        this.addPropertyOnRequestClose = this.addPropertyOnRequestClose.bind(this);
        this.addPropertyOnRequestOpen = this.addPropertyOnRequestOpen.bind(this);
        this.addPropertyHandleChanges = this.addPropertyHandleChanges.bind(this);
    }

    static contextTypes = {
        web3: PropTypes.object
    };

    componentDidMount() {
        companyContract.setProvider(web3.currentProvider);
        this.getProperties();
    }

    getProperties() {
        companyContract.at(this.props.match.params.cid).then((instance: any) => {
            return instance.getProperties.call({ from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                properties: result,
                loading: false
            });
            this.forceUpdate();
        });
    }

    addProperty(e: any) {
        e.preventDefault();

        if (this.state.addProperty.name === '') {
            return;
        }

        companyContract.at(this.props.match.params.cid).then((instance: any) => {
            return instance.addProperty(this.state.addProperty.name, { from: this.context.web3.selectedAccount });
        }).then((result: any) => {
            this.setState({
                addPropertyModalIsOpen: false,
                addProperty: {
                    name: ''
                }
            },
                () => {
                    // This is only until the total mess of events is resolved...
                    setTimeout(() => {
                        this.getProperties();

                        // Notify user from success.
                        toast.success('Success, property was added.', {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                    }, 1500);
                });
        });
    }

    addPropertyOnRequestClose() {
        this.setState({
            addPropertyModalIsOpen: false
        });
    }

    addPropertyOnRequestOpen() {
        this.setState({
            addPropertyModalIsOpen: true
        });
    }

    addPropertyHandleChanges(property: string, e: any) {
        var tmp = this.state.addProperty;
        tmp[property] = e.target.value;
        this.setState({
            addProperty: tmp
        });
    }

    render() {
        var content;
        if (this.state.loading) {
            content = (
                <Spinner text='loading company...' />
            );
        } else {
            if (this.state.properties.length > 0) {
                content = this.state.properties.map((id) =>
                    <Property company={this.props.match.params.cid} key={id} id={id} />
                );
            } else {
                content = <EmptySearch text='You do not have any properties...' />;
            }
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
            }
        ];

        return (
            <section className='company-detail'>
                <div className='container'>
                    <Breadcrumbs routes={routes} />
                    <div className='actions'>
                        <Button text='Add property' state={IButtonState.default} action={this.addPropertyOnRequestOpen} />
                    </div>
                    <div className='content'>
                        {content}
                    </div>

                    <Modal
                        isOpen={this.state.addPropertyModalIsOpen}
                        onRequestClose={this.addPropertyOnRequestClose}
                        style={addPropertyModalStyles}
                        contentLabel='Modal'
                    >
                        <div className='modal-header'>
                            <h1 className='title'>Add property</h1>
                            <img className='close' src={egoCloseHexagon} onClick={this.addPropertyOnRequestClose} />
                        </div>
                        <div className='modal-content'>
                            <div className='visual-tip'>
                                <img className='tip' src={egoBuilding10} />
                                <img className='action' src={egoAddHexagon1} />
                            </div>
                            <p className='description'>Those are only basic information needed to create a property. 
                                You'll always be able to manage this property freely after creation.
                                In order for everyone to see it, you'll need to activate it first.</p>
                            <form className='add-property-modal-form'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='label'><label>Name:</label></td>
                                            <td>
                                                <input
                                                    className='value'
                                                    type='text'
                                                    value={this.state.addProperty.name}
                                                    placeholder='insert property name'
                                                    onChange={(e) => this.addPropertyHandleChanges('name', e)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className='modal-actions'>
                            <button className='button' onClick={(e) => this.addProperty(e)}>Add</button>
                            <button className='action close' onClick={this.addPropertyOnRequestClose}>Close</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}

export default CompanyDetail;