import * as React from 'react';
import './index.css';

const Modal = require('react-modal');
const egoAxe = require('../img/ego/axe.svg');
const egoCheckHexagon = require('../img/ego/check-hexagon.svg');
const egoDog = require('../img/ego/dog.svg');
const egoPenChecklist = require('../img/ego/pen-checklist.svg');
const { toast } = require('react-toastify');

const addCompanyModalStyles = {
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

export namespace CompanyContainer {
  export interface Props {
    // empty
  }

  export interface State {
    addCompanyModalIsOpen: boolean,
    addCompany: any
  }
}

class Compagnies extends React.Component<CompanyContainer.Props, CompanyContainer.State> {
  constructor() {
    super();

    this.state = {
      addCompanyModalIsOpen: false,
      addCompany: {
        name: ''
      }
    }

    this.addCompany = this.addCompany.bind(this);
    this.addCompanyOnRequestClose = this.addCompanyOnRequestClose.bind(this);
    this.addCompanyOnRequestOpen = this.addCompanyOnRequestOpen.bind(this);
  }

  addCompanyOnRequestOpen(){
    this.setState({
      addCompanyModalIsOpen: true
    });
  }

  addCompanyOnRequestClose(){
    this.setState({
      addCompanyModalIsOpen: false
    });
  }

  addCompany(e: any){
    e.preventDefault();
    toast("Company added...");
    this.setState({
      addCompanyModalIsOpen: false
    })
  }

  addCompanyHandleChanges(company: string, e: any) {
    var tmp = this.state.addCompany;
    tmp[company] = e.target.value;
    this.setState({
      addCompany: tmp
    });
  }

  render() {
    return (
      <div className="companies">
        <div className="content">
          <button className="add-company" onClick={this.addCompanyOnRequestOpen}>
            <img className="add-company-icon" src={egoPenChecklist} />
            <span className="add-company-text">Add company</span>
          </button>
          <Modal
            isOpen={this.state.addCompanyModalIsOpen}
            onRequestClose={this.addCompanyOnRequestClose}
            style={addCompanyModalStyles}
            contentLabel="Modal">
            <div className="modal-header">
              <h1 className="title">Add company</h1>
              <img className="close" src={egoAxe} onClick={this.addCompanyOnRequestClose} />
            </div>
            <div className="modal-content">
              <img className="visual-tip" src={egoCheckHexagon} />
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
              <form className="addCompanyForm">
                <table>
                  <tbody>
                  <tr>
                    <td className="label"><label>Name:</label></td>
                    <td><input className="value" type="text" value={this.state.addCompany.name} onChange={(e) => this.addCompanyHandleChanges('name', e)} /></td>
                  </tr>
                  </tbody>
                </table>
              </form>
            </div>
            <div className="modal-actions">
              <button onClick={(e) => this.addCompany(e)}>Add</button>
              <button className="addCompanyCloseButton" onClick={this.addCompanyOnRequestClose}>Close</button>
            </div>
          </Modal>
          <img className="icon" src={egoDog} />
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.</p>
        </div>
      </div>
    );
  }
}

export default Compagnies;
