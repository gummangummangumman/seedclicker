import React from 'react';

class Popup extends React.Component {
  render() {

    let secondButton = this.props.onClick != null;

    return (
      <div className='popup'>
        <div className='popup_inner'>
          {this.props.content}
        <button onClick={this.props.closePopup} className="TextButtonWhite">{this.props.closeButtonText}</button>

        {secondButton ? this.secondButton() : <div />}

        </div>
      </div>
    );
  }

  secondButton()
  {
      return <button onClick={this.props.onClick} className="TextButtonWhite">{this.props.buttonText}</button>;
  }
}

export default Popup;
