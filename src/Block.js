import {Component} from 'react';



class Block extends Component {


  render() {
    const data = this.props.data;
    return (
      <div style={this.props.boxStyle}>
      Block ID: {data.id.substr(0, 10)}<br />
      Timestamp:  {data.timestamp}<br />
      Last block hash: {data.lastBlockHash == null ? '(First Block)' : data.lastBlockHash.substr(0, 10) }
      </div>
    )
  }
}

export default Block;
