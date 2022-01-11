import {Component} from 'react';
const poissonProcess = require('poisson-process');



class Client extends Component {


  constructor(props){
    super(props);
    this.generateTransaction = this.generateTransaction.bind(this);
    this.state={
      hovering: false
    }

  }

  componentDidMount(){
    this.generateTransaction();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateTransaction = async () => {
    await this.sleep(poissonProcess.sample(this.props.slowdown));
    const clients = this.props.clients;
    const data = this.props.data;
    if(clients.length>1){
      let recipient = {};
      do
        recipient = clients[Math.floor(Math.random()*clients.length)];
      while(recipient.id === data.id);
      let amount = data.balance/100.0*10.0;

      let transaction = {recipientId: recipient.id,
                         senderId: data.id,
                         amount: amount}
      this.props.newTransaction(transaction);
      setTimeout(this.generateTransaction, 100);
    }

  }


  render() {

    const data = this.props.data;
    return (
      <div style={this.state.hovering?this.props.boxStyleHover:this.props.boxStyle}
        onMouseEnter={() => this.setState({hovering: true})}
        onMouseLeave={() => this.setState({hovering: false})}
        onClick={()=>this.props.deleteMe(data.id)}>
        <p style={{margin: '1px'}}>ID: {data.id.substr(0, 10)}</p>
        <p style={{margin: '1px'}}>Balance: {Math.round(data.balance*100)/100}</p>
      </div>
    )
  }
}

export default Client;
