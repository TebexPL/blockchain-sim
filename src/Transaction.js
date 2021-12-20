import {Component} from 'react';



class Transaction extends Component {


  constructor(props){
    super(props);
  }

  render() {

    const data = this.props.data;
    return (
      <div>
        From: {data.senderId}<br />
        To: {data.recipientId}<br />
        Amount: {data.amount}
      </div>
    )
  }
}

export default Transaction;
