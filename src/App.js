import {Component} from 'react';
import Client from './Client';
import Miner from './Miner';
import Transaction from './Transaction';

import { sha256 } from 'js-sha256';

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

  constructor(props){
    super(props);
    this.state = {
      clients: this.createClients(5),
      miners: this.createMiners(5),
      transactions: []
    }
    this.newTransaction = this.newTransaction.bind(this);
  }


  container={
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'silver',
    height: '100vh'
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
    return (
      <div className="App" style={this.container}>
        <div style={this.columnContainer}>

          Clients:
          <div style={this.rowContainer}>
            <ul>
              {clients.map((client, key) =>
              <li key={key}><Client key={key} newTransaction={this.newTransaction} data={client} clients={clients}/></li>
              )}
            </ul>
          </div>
          Current Transactions:
          <div style={this.rowContainer}>
            <ul>
            {transactions.map((transaction, key) =>
            <li key={key}><Transaction data={transaction}/></li>
            )}
            </ul>
          </div>

        </div>
        <div style={this.columnContainer}>
          Miners:
          <div style={this.rowContainer}>
            <ul>
              {miners.map((data, key) =>
              <li key={key}><Miner  data={data}/></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
