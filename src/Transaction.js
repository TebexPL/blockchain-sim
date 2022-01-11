import {Component} from 'react';



class Transaction extends Component {


  render() {

    const data = this.props.data;
    return (
      <div style={this.props.boxStyle}>
        From: {data.senderId!=null?data.senderId.substr(0, 10):'SYSTEM'}<br />
        To: {data.recipientId.substr(0, 10)}<br />
        Amount: {Math.round(data.amount*100)/100}
      </div>
    )
  }
}

export default Transaction;
