import React, { Component } from 'react'
import { ChessBoardContainer } from './style'

class ChessBoard extends Component {
  render () {
    return (
      <div>
        <ChessBoardContainer>
          <canvas ref={this.boardCanvas} width="500" height="600"></canvas>
        </ChessBoardContainer>
      </div>
    )
  }

  constructor () {
    super()
    this.boardCanvas = React.createRef()
    this.cellWidth = 50
    this.sharpSize = this.cellWidth / 4
    this.offsetX = 50 // 棋盘相对于画布的偏移量
    this.offsetY = 50
  }

  componentDidMount () {
    /** @type {HTMLCanvasElement} */ 
    const boardCanvas = this.boardCanvas.current // 获取真实的canvas
    if (boardCanvas.getContext) {
      let ctx = boardCanvas.getContext('2d')
      this.drawChessBoard(ctx)
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
  }

  // 画简单直线
  drawLineInBoard (ctx, x1, y1, x2, y2) { // 参数中的坐标相对棋盘定位，而不是相对画布定位
    const { offsetX, offsetY } = this
    ctx.moveTo(x1 + offsetX, y1 + offsetY)
    ctx.lineTo(x2 + offsetX, y2 + offsetY)
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
}

const sharpSites = [ // “#”辅助数组
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

export default ChessBoard