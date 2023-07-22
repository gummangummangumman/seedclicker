import React from 'react';
//import ReactDOM from 'react-dom';

class ClickerButton extends React.Component {



    render(){
        return (
            <button onClick={() => this.props.onClick()} disabled={this.disabledButton()} className="TextButton">
                {this.props.text}
            </button>
        );
    }

    disabledButton()
    {
      return (this.props.price && (this.props.price > this.props.value));
    }
}


export default ClickerButton;
