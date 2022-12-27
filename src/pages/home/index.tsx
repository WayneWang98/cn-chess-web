import React, { Component } from 'react'
import Game from 'src/pages/game'

class Home extends Component {
  render () {
    return (
      <div>
        <h3>象棋小游戏</h3>
        <Game></Game>
      </div>
    )
  }
}

export default Home