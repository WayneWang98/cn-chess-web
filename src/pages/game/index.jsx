import React, { Component } from 'react'
import ChessBoard from './components/chessBoard'

import { GameContainer } from './style'

export default class Game extends Component {
  render () {
    return (
      <GameContainer>
        <ChessBoard></ChessBoard>
      </GameContainer>
    )
  }
}