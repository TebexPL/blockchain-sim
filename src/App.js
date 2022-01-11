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
    let id = sha256("MINER"+Date.now()+Math.random().toString());
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

  addClient(){
    this.state.clients.push(this.createClient())
    this.setState({});
  }

  deleteClient(clientId){
    let clientIndex = this.state.clients
          .findIndex(x => x.id === clientId)
    this.state.clients.splice(clientIndex, 1);
    this.setState({});
  }


  constructor(props){
    super(props);
    this.state = {
      location: 'clients',
      clients: [],
      miners: [],
      transactions: [],
      blockchain: [],
      slowdown: maxSlowdown,
      timeCost: 100,
      addClientHover: false
    }
    this.newTransaction = this.newTransaction.bind(this);
    this.newBlock = this.newBlock.bind(this);
    this.cost = this.cost.bind(this);
    this.updateState = this.updateState.bind(this);
    this.newMiner = this.newMiner.bind(this);
    this.deleteClient = this.deleteClient.bind(this)
  }



  componentDidMount(){
    this.setState({
        clients: this.createClients(5),
        miners: this.createMiners(5),
    })
    setInterval(this.newMiner, this.state.slowdown);
  }



  header = {
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    backgroundColor: 'grey',
    height: '50px',
    width: '100%'
  }

  navLink={
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
    color: 'lightgrey',
    textDecoration: 'none',

  }
  navLinkSelected={
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
    color: 'black',
    backgroundColor: 'silver',
    textDecoration: 'none',
  }
  section={
    flexDirection: 'column'
  }

  contentBox={
    width: '100%',
    minHeight: '91.8vh',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'start',
    backgroundColor: 'silver'

  }

  boxStyle={
    margin: '1.4%',
    width: '17%',
    height: '200px',
    borderWidth: '1px',
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }

  boxStyleHover={
    margin: '1.4%',
    width: '17%',
    height: '200px',
    borderWidth: '1px',
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 10,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }


  render(){
    const clients = this.state.clients;
    const miners = this.state.miners;
    const transactions = this.state.transactions;
    const blockchain = this.state.blockchain;
    const location = this.state.location;
    return (
        <div>
        <nav style={this.header}>
          <a href="#clients" onClick={() => this.setState({location: 'clients'})} style={this.state.location=='clients'?this.navLinkSelected:this.navLink}>Clients({clients.length})</a>
          <a href="#miners" onClick={() => this.setState({location: 'miners'})} style={this.state.location=='miners'?this.navLinkSelected:this.navLink}>Miners({miners.length})</a>
          <a href="#transactions" onClick={() => this.setState({location: 'transactions'})} style={this.state.location=='transactions'?this.navLinkSelected:this.navLink}>Transactions({transactions.length})</a>
          <a href="#blockchain" onClick={() => this.setState({location: 'blockchain'})} style={this.state.location=='blockchain'?this.navLinkSelected:this.navLink}>blockchain({blockchain.length})</a>
        </nav>
        <section id="clients" style={{flexDirection: 'column', display: location==='clients'?'flex' : 'none' }}>
            <div style={{height: '50px',width: '100%'}}></div>
            <div style={this.contentBox}>
            {clients.map((client, key) =>
              <Client key={key}
                slowdown={this.state.slowdown}
                newTransaction={this.newTransaction}
                data={client}
                clients={clients}
                boxStyle={this.boxStyle}
                boxStyleHover={this.boxStyleHover}
                deleteMe={this.deleteClient}
                />

            )}
            <div style={this.state.addClientHover?this.boxStyleHover:this.boxStyle}
              onMouseEnter={() => this.setState({addClientHover: true})}
              onMouseLeave={() => this.setState({addClientHover: false})}
              onClick={() => this.addClient()}>
              <p style={{fontSize: 70}}>+</p>
            </div>
            </div>
        </section>
        <section id="miners" style={{flexDirection: 'column', display: location==='miners'?'flex' : 'none' }}>
            <div style={{height: '50px',width: '100%'}}></div>
            <div style={this.contentBox}>
              {miners.map((data, key) =>
                <Miner key={key}
                  updateState={this.updateState}
                  transactions={transactions}
                  newBlock={this.newBlock}
                  cost={this.cost}
                  blockchain={blockchain}
                  timeCost={this.state.timeCost}
                  slowdown={this.state.slowdown}
                  data={data}
                  boxStyle={this.boxStyle}
                  boxStyleHover={this.boxStyleHover}/>
              )}
            </div>
        </section>
        <section id="transactions" style={{flexDirection: 'column', display: location==='transactions'?'flex' : 'none' }}>
            <div style={{height: '50px',width: '100%'}}></div>
            <div style={this.contentBox}>
              {transactions.map((transaction, key) =>
              <Transaction key={key}
                data={transaction}
                boxStyle={this.boxStyle}
                boxStyleHover={this.boxStyleHover}/>
              )}
            </div>
        </section>
        <section id="blockchain" style={{flexDirection: 'column', display: location==='blockchain'?'flex' : 'none' }}>
            <div style={{height: '50px',width: '100%'}}></div>
            <div style={this.contentBox}>
              {blockchain.map((data, key) =>
              <Block key={key}
                      data={data}
                      boxStyle={this.boxStyle}
                      boxStyleHover={this.boxStyleHover}/>
              )}
            </div>
        </section>
      </div>

    );
  }

}

export default App;
