import React, { Component } from 'react'
import ChessBoard from './components/chessBoard'

export default class Game extends Component {
  render () {
    return (
      <div>
        <div>象棋小游戏</div>
        <ChessBoard></ChessBoard>
      </div>
    )
  }
}