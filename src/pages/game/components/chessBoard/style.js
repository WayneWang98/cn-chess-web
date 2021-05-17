import styled from 'styled-components'

export const ChessBoardContainer = styled.div`
  display: flex;
  margin-top: 30px;
  .retract-btn {
    flex-grow: 0;
    flex-shrink: 0;
    width: 60px;
    height: 40px;
    margin-left: 16px;
  }
`

export const CanvasContainer = styled.div`
  position: relative;
  margin-left: 20px;
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
  margin-left: 20px;
  width: 150px;
  height: 300px;
  overflow-y: auto;
`