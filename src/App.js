import {Component} from 'react';
import ReactSlider from 'react-slider';
import Client from './Client';
import Miner from './Miner';
import Transaction from './Transaction';
import Block from './Block';

import { sha256 } from 'js-sha256';

const maxSlowdown=5000;


class App extends Component {


  createClient(){
    let id = sha256(Math.random().toString());
    let balance = Math.round(Math.random()%100*10000)/100;
    return {id, balance};
  };

  createClients(num){
    const arr = [];
    for(let i=0; i<num; i++)
      arr.push(this.createClient());
    return arr;
  };

  createMiner(){
    let id = sha256(Math.random().toString());
    let balance = Math.round(Math.random()%100*10000)/100;
    let resources = Math.round(Math.random()%100*10000)/100;
    return {id, balance, resources};
  }

  createMiners(num){
    const arr = [];
    for(let i=0; i<num; i++)
      arr.push(this.createMiner());
    return arr;
  }


  newTransaction(transaction){
    this.state.clients
      .find(x => x.id === transaction.recipientId)
      .balance += transaction.amount;
    this.state.clients
      .find(x => x.id === transaction.senderId)
      .balance -= transaction.amount;
    this.state.transactions.unshift(transaction);
    this.setState({});
  }

  newBlock(minerId, block){
    this.state.blockchain.push(block);
    let miner = this.state.miners
    .find(x => x.id === minerId);
    if(miner !== undefined){
      miner.balance += block.transactions[block.transactions.length-1]
            .amount
      this.setState({});
    }


  }

  cost(minerId){
    let miner = this.state.miners
          .find(x => x.id === minerId)
    if(miner !== undefined){
      miner.balance -= miner.resources;
      if(miner.balance <=0){
        let minerIndex = this.state.miners
              .findIndex(x => x.id === minerId)
        this.state.miners.splice(minerIndex, 1);
      }
      this.setState({});
    }

  }

  updateState(){
    this.setState({});
  }


  newMiner(){
    this.state.miners.push(this.createMiner());
    this.setState({});
  }




  constructor(props){
    super(props);
    this.state = {
      clients: [],
      miners: [],
      transactions: [],
      blockchain: [],
      slowdown: maxSlowdown,
      timeCost: 100
    }
    this.newTransaction = this.newTransaction.bind(this);
    this.newBlock = this.newBlock.bind(this);
    this.cost = this.cost.bind(this);
    this.updateState = this.updateState.bind(this);
    this.newMiner = this.newMiner.bind(this);
  }



  componentDidMount(){
    this.setState({
        clients: this.createClients(5),
        miners: this.createMiners(5),
    })
    setInterval(this.newMiner, this.state.slowdown);
  }




  mainContainer={
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'silver',
    height: '100vh'
  };

  container={
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    backgroundColor: 'silver',
  };

  columnContainer={
    display: 'flex',
    flex:1,
    flexDirection: 'column',

  }

  rowContainer={
    display:'flex',
    flexDirection: 'column',
    height: '45%',
    overflow: 'auto',
    backgroundColor: 'lightgrey',
    margin: 3
  }


  render(){
    const clients = this.state.clients;
    const miners = this.state.miners;
    const transactions = this.state.transactions;
    const blockchain = this.state.blockchain;

    return (
      <div style={this.mainContainer}>
        <div  style={this.container}>
          <ReactSlider />
          <div style={this.columnContainer}>

            Clients ({this.state.clients.length}):
            <div style={this.rowContainer}>
              <ul>
                {clients.map((client, key) =>
                  <li key={key}><Client
                    slowdown={this.state.slowdown}
                    newTransaction={this.newTransaction}
                    data={client}
                    clients={clients}/>
                  </li>
                )}
              </ul>
            </div>
            Current Transactions ({this.state.transactions.length}):
            <div style={this.rowContainer}>
              <ul>
              {transactions.map((transaction, key) =>
              <li key={key}><Transaction data={transaction}/></li>
              )}
              </ul>
            </div>

          </div>
          <div style={this.columnContainer}>
            Miners ({this.state.miners.length}):
            <div style={this.rowContainer}>
              <ul>
                {miners.map((data, key) =>
                  <li key={key}><Miner
                    updateState={this.updateState}
                    transactions={transactions}
                    newBlock={this.newBlock}
                    cost={this.cost}
                    blockchain={blockchain}
                    timeCost={this.state.timeCost}
                    slowdown={this.state.slowdown}
                    data={data}/>
                  </li>
                )}
              </ul>
            </div>
            Blockchain ({this.state.blockchain.length}):
            <div style={this.rowContainer}>
              <ul>
                {blockchain.map((data, key) =>
                <li key={key}><Block data={data}/></li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

}

export default App;
