import React, { Component } from 'react'
import { ChessBoardContainer } from './style'
import { sharpSites, record, chessDictionary } from './store'
import { getCanvasPixelRatio, canvasCalculator, chessUtils } from '../../utils'

class ChessBoard extends Component {
  render () {
    return (
      <div>
        <ChessBoardContainer>
          <canvas className="boardCanvas" ref={this.boardCanvas} width="625" height="750"></canvas>
          <canvas className="chessCanvas" ref={this.chessCanvas} width="625" height="750"></canvas>
        </ChessBoardContainer>
      </div>
    )
  }

  constructor () {
    super()
    this.boardCanvas = React.createRef() // 棋盘画布
    this.chessCanvas = React.createRef() // 棋子画布
    this.boardCtx = null // 棋盘画布的上下文
    this.chessCtx = null // 棋子画布的上下文
    this.ratio =  1 // 画布缩放比
    this.cellWidth = 50 // 单元格的大小
    this.radius = 22 // 棋子半径
    this.sharpSize = this.cellWidth / 4 // 棋盘“#”符号的大小
    this.offsetX = 50 // 棋盘相对于画布的偏移量
    this.offsetY = 50
    this.checkedChess = null // 被选中的棋子
    this.checkedX = -1 // 选中的棋子的位置
    this.checkedY = -1
    this.round = 1 // 回合数
  }

  componentDidMount () {
    /** @type {HTMLCanvasElement} */ 
    const boardCanvas = this.boardCanvas.current // 获取真实的canvas
    const chessCanvas = this.chessCanvas.current
    if (boardCanvas.getContext) {
      let boardCtx = this.boardCtx = boardCanvas.getContext('2d')
      this.ratio = getCanvasPixelRatio(boardCtx) || 1 // 获取画布缩放比
      boardCtx.scale(this.ratio, this.ratio)
      this.drawChessBoard(boardCtx) // 绘制棋盘
    }
    let chessCtx
    if (chessCanvas.getContext) {
      chessCtx = this.chessCtx = chessCanvas.getContext('2d')
      chessCtx.scale(this.ratio, this.ratio)
      this.drawSituation(chessCtx) // 绘制初始局面
    }

    chessCanvas.onclick = (e) => {
      const { cellWidth }  = this
      const { offsetX, offsetY } = e
      const point = { x: offsetX, y: offsetY}

      const x = parseInt(offsetX / cellWidth) * cellWidth // 放大
      const y = parseInt(offsetY / cellWidth) * cellWidth
      
      const A1 = { x: x, y: y }
      const A2 = { x: x + cellWidth, y: y }
      const B1 = { x: x, y: y + cellWidth }
      const B2 = { x: x + cellWidth, y: y + cellWidth }

      let minPoint = canvasCalculator.getMinDistancePoint(point, [A1, A2, B1, B2])
      const col = minPoint.x / cellWidth - 1, row = minPoint.y / cellWidth - 1
      if (col < 0 || col > 8 || row < 0 || row > 9) { // 在棋盘不合法范围内
        return
      }

      if (this.checkedChess) { // 已经有棋子被选中了，此时只能是落子或者切换棋子
        let key = record[this.checkedY][this.checkedX] // 选中的棋子
        if (chessUtils.isSameColor(record[row][col], key)) { // 同色棋子，执行切换棋子的操作
          this.switchChess(col, row)
        } else { // 落子
          this.putChess(col, row)
        }
      } else { // 选棋子
        if (canvasCalculator.getDistancePow(point, minPoint) < Math.pow(this.radius, 2)) { // 落在圆形内
          this.pickChess(col, row)
        }
      }
    }
  }

  // 绘制选中棋子的标志
  drawSelector (ctx, col, row) {
    const { radius: r, cellWidth } = this
    const x = col * cellWidth, y = row * cellWidth
    let len = r / 2

    ctx.strokeStyle = '#2774ce' 
    ctx.lineWidth = 2

    // 左上
    this.drawLineInChessCanvas(ctx, x - r, y - r, x - r + len, y - r )
    this.drawLineInChessCanvas(ctx, x - r, y - r, x - r, y - r + len)

    // 右上
    this.drawLineInChessCanvas(ctx, x + r - len, y - r, x + r, y - r)
    this.drawLineInChessCanvas(ctx, x + r, y - r, x + r, y - r + len)

    // 左下
    this.drawLineInChessCanvas(ctx, x - r, y + r, x - r,  y + r - len)
    this.drawLineInChessCanvas(ctx, x - r, y + r, x - r + len, y + r)

    // 右下
    this.drawLineInChessCanvas(ctx, x + r, y + r, x + r, y + r - len)
    this.drawLineInChessCanvas(ctx, x + r, y + r, x + r - len, y + r)
  }

  // 画简单直线（在chessCanvas）
  drawLineInChessCanvas (ctx, x1, y1, x2, y2) { // 参数中的坐标相对棋盘定位，而不是相对画布定位
    const { offsetX, offsetY } = this
    ctx.beginPath()
    ctx.moveTo(x1 + offsetX, y1 + offsetY)
    ctx.lineTo(x2 + offsetX, y2  + offsetY)
    ctx.closePath()
    ctx.stroke()
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

  // 绘制一个棋子
  drawChess (ctx, x, y, color, chess) {
    const { cellWidth, offsetX, offsetY, radius: r } = this
    const text = chess.name

    x = x * cellWidth
    y = y * cellWidth

    ctx.beginPath()
    ctx.arc(offsetX + x , offsetY + y, r, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.lineStyle = color
    ctx.strokeStyle ='#000'
    ctx.lineWidth = 2
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.font = '30px LiSu'
    ctx.fillStyle = color
    ctx.fillText(text , offsetX + x - 15, offsetY + y + 8)
    
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

  // 执行切换棋子的操作
  switchChess (x, y) { // x，y为棋子的落点
    const { cellWidth, chessCtx } = this
    this.checkedX = x
    this.checkedY = y
    chessCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCtx)
    this.drawSelector(chessCtx, x, y)
    this.checkedChess = chessDictionary[record[this.checkedY][this.checkedX]]
    const moves = this.checkedChess.generateMove(this.checkedX, this.checkedY)
    this.drawCanMoveSites(chessCtx, moves)
  }

  // 落子
  putChess (x, y) {
    const { cellWidth, chessCtx } = this
    
    record[y][x] = record[this.checkedY][this.checkedX]
    record[this.checkedY][this.checkedX] = '0'
    chessCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCtx)
    this.drawSelector(chessCtx, x, y)
    this.drawSelector(chessCtx, this.checkedX, this.checkedY)
    this.checkedChess = null
  }

  // 拿起棋子（this.checked 从 false 变为 true）
  pickChess (col, row) {
    const { cellWidth, chessCtx } = this
    const chessEng = record[row][col] // 棋子的英文编码
    const chess = chessDictionary[chessEng]

    if (chess !== undefined) {
      if ((parseInt(this.round % 2) === 0 && chessUtils.isBlack(chessEng))
        || (parseInt(this.round % 2) === 1 && chessUtils.isRed(chessEng))
      ) {
        chessCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
        this.drawSituation(chessCtx)
        this.drawSelector(chessCtx, col, row)
        this.checkedChess = chess
        this.checkedX = col
        this.checkedY = row
        this.round ++
        const moves = chess.generateMoves(col, row, record)
        this.drawCanMoveSites(chessCtx, moves)
      }
    }
  }

  // 绘制该棋子的所有可行点
  drawCanMoveSites (ctx, moves) {
    const { offsetX, offsetY, cellWidth } = this
    moves.forEach((line, row) => {
      line.forEach((site, col) => {
        if (site === '1') {
          const x = col * cellWidth
          const y = row * cellWidth
          ctx.strokeStyle = '#78ce27'
          ctx.lineWidth = 2
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.arc(offsetX + x , offsetY + y, 7, 0, 2 * Math.PI, false)
          ctx.closePath()
          ctx.stroke()
          ctx.fill()
        }
      })
    })
  }
}

export default ChessBoard