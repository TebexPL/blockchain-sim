import {Component} from 'react';



class Block extends Component {


  render() {
    const data = this.props.data;
    return (
      <div>
      Block ID: {data.id}<br />
      Timestamp:  {data.timestamp}<br />
      Last block hash: {data.lastBlockHash == null ? '(First Block)' : data.lastBlockHash }
      </div>
    )
  }
}

export default Block;
