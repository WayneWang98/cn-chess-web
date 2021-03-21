import React, { Component } from 'react'
import ChessBoard from '../chessBoard'

class Home extends Component {
  render () {
    return (
      <div>
        <div>首页</div>
        <ChessBoard></ChessBoard>
      </div>
    )
  }
}

export default Home