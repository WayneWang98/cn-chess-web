import styled from 'styled-components'

export const ChessBoardContainer = styled.div`
  display: inline-block;
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

export const RecordContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 150px;
  height: 300px;
  overflow-y: auto;
`