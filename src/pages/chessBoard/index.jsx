import React, { Component } from 'react'
import { ChessBoardContainer } from './style'
import { sharpSites, record, chessDictionary } from './store'

class ChessBoard extends Component {
  render () {
    return (
      <div>
        <ChessBoardContainer>
          <canvas ref={this.boardCanvas} width="500" height="600"></canvas>
          <canvas className='chessCanvas' ref={this.chessCanvas} width="500" height="600"></canvas>
        </ChessBoardContainer>
      </div>
    )
  }

  constructor () {
    super()
    this.boardCanvas = React.createRef() // 棋盘画布
    this.chessCanvas = React.createRef() // 棋子画布
    this.cellWidth = 50
    this.radius = 22 // 棋子半径
    this.sharpSize = this.cellWidth / 4
    this.offsetX = 50 // 棋盘相对于画布的偏移量
    this.offsetY = 50
  }

  componentDidMount () {
    /** @type {HTMLCanvasElement} */ 
    const boardCanvas = this.boardCanvas.current // 获取真实的canvas
    const chessCanvas = this.chessCanvas.current
    if (boardCanvas.getContext) {
      let ctx = boardCanvas.getContext('2d')
      this.drawChessBoard(ctx)
    }
    if (chessCanvas.getContext) {
      let ctx = chessCanvas.getContext('2d')
      this.drawSituation(ctx)
    }
  }

  // 绘制棋盘
  drawChessBoard (ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#211309' // 深褐色线条
    this.drawCellTable(ctx)
    this.drawPalaces(ctx)
    this.drawSharSites(ctx)
  }

  // 绘制格子表
  drawCellTable (ctx) {
    const { cellWidth, offsetX, offsetY } = this
    const width = cellWidth * 8
    const height = cellWidth * 9
    const outerWidth = cellWidth * 10
    const outerHeight = cellWidth * 11

    // 绘制外边框（必须先绘制外边框，否则填充时会覆盖内边框）
    ctx.lineWidth = 2
    ctx.rect(1, 1, outerWidth -2, outerHeight)
    ctx.stroke()
    ctx.fillStyle = '#EAC591'
    ctx.fill()

    // 绘制内边框
    ctx.rect(offsetX, offsetY, width, height)
    ctx.stroke()

    // 画棋盘横线
    for (let i = 1; i <= 8; i ++) {
      this.drawLineInBoard(ctx, 0, cellWidth * i, cellWidth * 8, cellWidth * i)
    }

    // 画棋盘竖线
    for (let i = 1; i <= 7; i ++) {
      this.drawLineInBoard(ctx, i * cellWidth, 0, i * cellWidth, cellWidth * 4) // 黑方竖线
      this.drawLineInBoard(ctx, i * cellWidth, 5 * cellWidth, i * cellWidth, cellWidth * 9) // 红方竖线
    }

    // 绘制楚河汉界
    ctx.font = 'bold 30px Courier New'
    ctx.fillStyle = '#000'
    ctx.fillText('楚  河', cellWidth * 2, cellWidth * 5 + cellWidth / 2 + 10)
    ctx.fillText('漢  界', cellWidth * 6, cellWidth * 5 + cellWidth / 2 + 10)
  }

  // 画简单直线
  drawLineInBoard (ctx, x1, y1, x2, y2) { // 参数中的坐标相对棋盘定位，而不是相对画布定位
    const { offsetX, offsetY } = this
    ctx.beginPath()
    ctx.moveTo(x1 + offsetX, y1 + offsetY)
    ctx.lineTo(x2 + offsetX, y2 + offsetY)
    ctx.closePath()
    ctx.stroke()
    
  }

  // 绘制“井”（兵林线和布置线上的点）
  drawSharSites (ctx) {
    const { cellWidth } = this
    
    sharpSites.forEach((line, row) => {
      line.forEach((site, col) => {
        if (site === 1) {
          let x = col * cellWidth
          let y = row * cellWidth
          if (col === 0) { // 边卒的“#”要区分
            this.drawRightSharp(ctx, x, y)
          } else if (col === 8) {
            this.drawLeftSharp(ctx, x, y)
          } else {
            this.drawLeftSharp(ctx, x, y)
            this.drawRightSharp(ctx, x, y)
          }
        }
      })
    })
  }

  // 以某个点为中心，绘制左“#”
  drawLeftSharp (ctx, x, y) {
    const { sharpSize } = this
    const gap = parseInt(sharpSize / 2)

    this.drawLineInBoard(ctx, x - gap, y - gap, x - gap, y - sharpSize)
    this.drawLineInBoard(ctx, x - gap, y - gap, x - sharpSize, y - gap)
    this.drawLineInBoard(ctx, x - gap, y + gap, x - sharpSize, y + gap)
    this.drawLineInBoard(ctx, x - gap, y + gap, x - gap, y + sharpSize)
  }

  // 以某个点为中心，绘制右“#”
  drawRightSharp (ctx, x, y) {
    const { sharpSize } = this
    const gap = parseInt(sharpSize / 2)
    
    this.drawLineInBoard(ctx, x + gap, y + gap, x + sharpSize, y + gap)
    this.drawLineInBoard(ctx, x + gap, y + gap, x + gap, y + sharpSize)
    this.drawLineInBoard(ctx, x + gap, y - gap, x + sharpSize, y - gap)
    this.drawLineInBoard(ctx, x + gap, y - gap, x + gap, y - sharpSize)
  }

  // 绘制九宫
  drawPalaces (ctx) {
    const { cellWidth } = this

    this.drawLineInBoard(ctx, 3 * cellWidth, 0, 5 * cellWidth, 2 * cellWidth)
    this.drawLineInBoard(ctx, 3 * cellWidth, 2 * cellWidth, 5 * cellWidth, 0)
    this.drawLineInBoard(ctx, 3 * cellWidth, 7 * cellWidth, 5 * cellWidth, 9 * cellWidth)
    this.drawLineInBoard(ctx, 3 * cellWidth, 9 * cellWidth, 5 * cellWidth, 7 * cellWidth)
  }

  // 绘制一个棋子
  drawChess (ctx, x, y, color, chess) {
    const { cellWidth, radius } = this
    const text = chess.name
    this.drawCircle(ctx, x * cellWidth, y * cellWidth, radius, color, text) 
  }

  // 绘制一个圆
  drawCircle (ctx, x, y, r, color, text) {
    const { offsetX, offsetY } = this
    ctx.beginPath()
    ctx.arc(offsetX + x, offsetY + y, r, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.lineStyle = color
    ctx.fillStyle = '#fff'
    ctx.fill()

    if (text) {
      ctx.font = 'bold 22px Courier New'
      ctx.fillStyle = color
      ctx.fillText(text , offsetX + x - 12, offsetY + y + 8)
    }
    
    ctx.stroke()
  }

  // 绘制一个完整的局面
  drawSituation (ctx) {
    record.forEach((line, row) => {
      line.forEach((site, col) => {
        if (site !== '0') { // 该位置有棋子
          if (site >= 'a' && site <= 'z') { // 黑棋
            this.drawChess(ctx, col, row, 'black', chessDictionary[site])
          } else { // 红棋
            this.drawChess(ctx, col, row, 'red', chessDictionary[site])
          }
        }
      })
    })
  }
}

export default ChessBoard