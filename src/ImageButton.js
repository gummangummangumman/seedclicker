import React from 'react';
//import ReactDOM from 'react-dom';

class ImageButton extends React.Component {

    render(){
        return (
            <button onClick={() => this.props.onClick()} className={(this.props.flipped) ? "GummanFlipped" : "Gumman"}>
                <img src={this.props.picture} alt={this.props.text} />
            </button>
        );
    }
}


export default ImageButton;
