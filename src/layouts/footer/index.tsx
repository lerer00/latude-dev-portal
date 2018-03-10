import * as React from 'react';
import './index.css';

export namespace Footer {
  export interface Props {
    // empty
  }

  export interface State {
    // empty
  }
}

class Footer extends React.Component<Footer.Props, Footer.State> {
  renderExtra() {
    var today = (new Date()).getFullYear();

    return (
      <span>{today}</span>
    );
  }

  render() {
    return (
      <footer className='footer'>
        <div className='content'>
          <p>© latude inc. {this.renderExtra()}</p>
        </div>
      </footer>
    );
  }
}

export default Footer;
