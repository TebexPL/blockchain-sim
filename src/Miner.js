import {Component} from 'react';
import { sha256 } from 'js-sha256';
const poissonProcess = require('poisson-process');

class Miner extends Component {

  constructor(props){
    super(props);
    this.mine = this.mine.bind(this);
  }

  componentDidMount(){
    this.mine();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  mine = async () =>{
    const data = this.props.data;
    let blockchainLength = this.props.blockchain.length;
    await this.sleep(poissonProcess.sample(this.props.timeCost/data.resources*this.props.slowdown));
    if(this.props.blockchain.length === blockchainLength){
      const transactions = this.props.transactions;
      this.props.transactions.length=0;
      this.props.updateState();
      let transaction = {recipientId: data.id,
                         senderId: null,
                         amount: data.resources+10}
      transactions.push(transaction);

      let timestamp = Date.now();
      let lastBlockHash = null;
      if(blockchainLength !== 0)
        lastBlockHash = sha256(JSON.stringify(this.props.blockchain[blockchainLength-1]));
      let block = {id: sha256(Math.random().toString()),
                   transactions: transactions,
                   timestamp: timestamp,
                   lastBlockHash: lastBlockHash};
      this.props.newBlock(data.id, block);
    }
    this.props.cost(data.id);
    if(data.balance>0.0)
      setTimeout(this.mine, 100);
  }

  render() {

    const data = this.props.data;
    return (
      <div>
        ID: {data.id}<br />
        Balance: {data.balance}<br />
        Resources: {data.resources}

      </div>
    )
  }
}

export default Miner;
