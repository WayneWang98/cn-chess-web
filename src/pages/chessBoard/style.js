import styled from 'styled-components'

export const ChessBoardContainer = styled.div`
  margin: 35px;
  position: relative;
  .boardCanvas {
    width: 500px;
    height: 600px;
  }
  .chessCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    height: 600px;
  }
`