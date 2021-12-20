import {Component} from 'react';



class Client extends Component {


  constructor(props){
    super(props);
    this.generateTransaction = this.generateTransaction.bind(this);
    setTimeout(this.generateTransaction, Math.random()*5000);
  }

  generateTransaction = async () => {
    const clients = this.props.clients;
    const data = this.props.data;
    let recipient = {};
    do
      recipient = clients[Math.floor(Math.random()*clients.length)];
    while(recipient.id === data.id);
    let amount = data.balance/100.0*10.0;

    let transaction = {recipientId: recipient.id,
                       senderId: data.id,
                       amount: amount}
    this.props.newTransaction(transaction);
    setTimeout(this.generateTransaction, Math.random()*5000);
  }

  render() {

    const data = this.props.data;
    return (
      <div>
        ID: {data.id}<br />
        Balance: {data.balance}
      </div>
    )
  }
}

export default Client;
