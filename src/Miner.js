import {Component} from 'react';



class Miner extends Component {


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
