import React, { Component } from 'react'
import { sharpSites } from '../store'
import { getCanvasPixelRatio, getStyle } from '../../../utils'

export default class BoardCanvas extends Component {
  render () {
    return (
      <div>
        <canvas className="boardCanvas" ref={this.boardCanvas} width="625" height="750"></canvas> 
      </div>
    )
  }

  constructor () {
    super()
    this.boardCanvas = React.createRef() // 棋盘画布
    this.boardCtx = null // 棋盘画布的上下文
    this.cellWidth = 50 // 单元格的大小
    this.offsetX = 50
    this.offsetY = 50
    this.sharpSize = this.cellWidth / 4 // 棋盘“#”符号的大小
    this.ratio =  1 // 画布缩放比
  }

  componentDidMount () {
    this.props.onRef(this)
  }

  // 初始化棋盘
  initBoard () {
    this.initCanvas()
  }

  初始化画布
  initCanvas () {
    this.boardCtx = this.boardCanvas.current.getContext('2d')

    let ratio = this.ratio = getCanvasPixelRatio(this.boardCtx) // 获取画布缩放比
    // this.setCanvasStyle() // 根据样式宽高动态设置canvas宽高
    this.boardCtx.scale(ratio, ratio) // 根据缩放比设置画布缩放
    this.drawChessBoard(this.boardCtx) // 绘制棋盘
  }

   // 绘制棋盘
   drawChessBoard (ctx) {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#211309' // 深褐色线条
    this.drawCellTable(ctx)
    this.drawPalaces(ctx)
    this.drawSharpSites(ctx)
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
  drawSharpSites (ctx) {
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