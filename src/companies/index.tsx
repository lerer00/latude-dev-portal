import * as React from 'react';
import './index.css';

const egoDog = require('../img/ego/dog.svg');

export namespace CompanyContainer {
  export interface Props {
    web3: any;
  }

  export interface State {
    // empty
  }
}

class Compagnies extends React.Component<CompanyContainer.Props, CompanyContainer.State> {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="companies">
        <div className="content">
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
