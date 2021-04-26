import React, { Component } from 'react'
import { ChessBoardContainer } from './style'
import { record, chessDictionary } from './store'
import { getCanvasPixelRatio, getStyle, deepCloneByJSON, canvasCalculator, chessUtils } from '../../utils'
import { generateChessRecordText } from '../../helpers/recordHelper'
import BoardCanvas from './components/boardCanvas'

class ChessBoard extends Component {
  render () {
    return (
      <div>
        <ChessBoardContainer>
          <canvas className="chessCanvas" ref={this.chessCanvas}></canvas> {/* boardCanvas与chessCanvas的大小始终保持一致 */}
          <BoardCanvas onRef={this.onRef.bind(this)}></BoardCanvas>
        </ChessBoardContainer>
        <button onClick={this.repentance.bind(this)}>悔棋</button>
      </div>
    )
  }

  constructor () {
    super()
    
    this.boardCanvas = null // 棋盘画布
    this.chessCanvas = React.createRef() // 棋子画布
    this.ratio = 1
    this.chessCtx = null // 棋子画布的上下文
    this.cellWidth = 50 // 单元格的大小
    this.radius = 22 // 棋子半径
    this.offsetX = 50 // 棋盘相对于画布的偏移量
    this.offsetY = 50
    this.situation = deepCloneByJSON(record[0]) // 当前局面，初始时为record[0]
    this.record = record // 棋谱记录
    this.checkedChess = null // 被选中的棋子
    this.checkedX = -1 // 选中的棋子的位置
    this.checkedY = -1
    this.round = 0 // 回合数
    this.moves = null // 所有的可行点
  }

  componentDidMount () {
    this.initCanvas()
    this.initGames()

    const chessCanvas = this.chessCanvas.current
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
        let key = this.situation[this.checkedY][this.checkedX] // 选中的棋子
        if (chessUtils.isSameColor(this.situation[row][col], key)) { // 同色棋子，执行切换棋子的操作
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

  onRef (ref) {
    this.boardCanvas = ref
  }

  // 初始化画布
  initCanvas () {
    this.chessCtx = this.chessCanvas.current.getContext('2d')

    let ratio = this.ratio = getCanvasPixelRatio(this.chessCtx) // 获取画布缩放比
    this.setCanvasStyle() // 根据样式宽高动态设置canvas宽高
    this.chessCtx.scale(ratio, ratio) // 根据缩放比设置画布缩放
  }

  // 初始化游戏
  initGames () {
    const { chessCtx } = this
    this.initChessBoard()
    this.drawSituation(chessCtx) // 绘制初始局面
  }

  // 初始化棋盘
  initChessBoard () {
    this.boardCanvas.initBoard()
  }

  // 设置canvas的样式
  setCanvasStyle () {
    const chessCanvas = this.chessCanvas.current
    const style = getStyle(chessCanvas)

    const width = parseInt(style.width.replace('px', ''))
    const height = parseInt(style.height.replace('px', ''))

    chessCanvas.width = width * this.ratio
    chessCanvas.height = height * this.ratio
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
    this.situation.forEach((line, row) => {
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
    this.checkedChess = chessDictionary[this.situation[this.checkedY][this.checkedX]]
    this.moves = this.checkedChess.generateMoves(this.checkedX, this.checkedY, this.situation)
    this.drawCanMoveSites(chessCtx, this.moves)
  }

  // 落子
  putChess (x, y) {
    const { cellWidth, chessCtx } = this
    
    if (this.moves[y][x] === '0') { // 判断落点是否符合走子规则
      return
    }

    this.writeOneRecord(x, y) // 记谱
    this.situation[y][x] = this.situation[this.checkedY][this.checkedX]
    this.situation[this.checkedY][this.checkedX] = '0'
    chessCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCtx)
    this.drawSelector(chessCtx, x, y)
    this.drawSelector(chessCtx, this.checkedX, this.checkedY)
    this.checkedChess = null
    this.round ++ // 落子后，回合数就增加了
    
    const copySituation = deepCloneByJSON(this.situation) // 每次落子后，将当前局面推入数组
    this.record.push(copySituation)

  }

  // 拿起棋子（this.checked 从 false 变为 true）
  pickChess (col, row) {
    const { cellWidth, chessCtx } = this
    const chessEng = this.situation[row][col] // 棋子的英文编码
    const chess = chessDictionary[chessEng]

    if (chess !== undefined) {
      if ((parseInt(this.round % 2) === 1 && chessUtils.isBlack(chessEng))
        || (parseInt(this.round % 2) === 0 && chessUtils.isRed(chessEng))
      ) {
        chessCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
        this.drawSituation(chessCtx)
        this.drawSelector(chessCtx, col, row)
        this.checkedChess = chess
        this.checkedX = col
        this.checkedY = row
        this.moves = chess.generateMoves(col, row, this.situation)
        this.drawCanMoveSites(chessCtx, this.moves)
      }
    }
  }

  // 绘制该棋子的所有可行点
  drawCanMoveSites (ctx, moves) {
    const { offsetX, offsetY, cellWidth } = this

    ctx.strokeStyle = '#78ce27'
    ctx.lineWidth = 2
    ctx.fillStyle = '#fff'
    
    moves.forEach((line, row) => {
      line.forEach((site, col) => {
        if (site === '1') {
          const x = col * cellWidth
          const y = row * cellWidth
          ctx.beginPath()
          ctx.arc(offsetX + x , offsetY + y, 7, 0, 2 * Math.PI, false)
          ctx.closePath()
          ctx.stroke()
          ctx.fill()
        }
      })
    })
  }

  // 悔棋
  repentance () {
    const { cellWidth, chessCtx } = this

    if (this.round === 0) { // 第0回合，无法悔棋
      return
    }

    this.record.pop() // 悔棋后，删除记录中的最后一个局面
    this.situation = deepCloneByJSON(this.record[this.record.length - 1]) // 取现在记录中的最后一个局面作为当前局面
    
    chessCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCtx)
    this.round --
  }

  // 记谱
  writeOneRecord (col, row) { // row和col为落子的横纵坐标
    const { checkedX, checkedY } = this // 选中的棋子
    let oldPoint = { x: checkedX, y: checkedY}
    let newPoint = { x: col, y: row}

    const chessEng = this.situation[checkedY][checkedX]
    const { name } = chessDictionary[chessEng]

    if (chessUtils.isRed(chessEng)) { // 红方棋子，记谱时要做镜像翻转
      oldPoint = chessUtils.getCentrosymmetricPoint(oldPoint)
      newPoint = chessUtils.getCentrosymmetricPoint(newPoint)
    }

    let recordText = generateChessRecordText(oldPoint, newPoint, name)
    console.log(recordText)

    
  }
}

export default ChessBoard