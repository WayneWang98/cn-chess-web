import React, { Component, RefObject } from 'react'
import { CanvasContainer, ChessBoardContainer } from './style'
import { record } from './store'
import { getCanvasPixelRatio, getStyle, deepCloneByJSON, canvasCalculator, chessUtils } from 'src/utils'
import { generateChessRecordText, generateChessFullname } from 'src/helpers/recordHelper'
import BoardCanvas from './components/boardCanvas'
import RecordHistory from './components/recordHistory'
import { Moves, RecordList, VirtualBoardSituation } from 'src/types/types'
import { ChessDictionaryItem, getChessByValue } from './store/chess'

type ChessBoardProps = {}
type ChessBoardState = {
  recordTextList: RecordList
}

class ChessBoard extends Component<ChessBoardProps, ChessBoardState> {
  private boardCanvasRef = React.createRef<BoardCanvas>() // 棋盘画布
  private chessCanvasRef = React.createRef<HTMLCanvasElement>() // 棋子画布
  private ratio: number = 1 // 棋盘比例
  private chessCanvasCtx: CanvasRenderingContext2D | null = null // 棋子画布的上下文
  private cellWidth = 50 // 单元格的大小
  private offsetX = 50 // 棋盘相对于画布的偏移量
  private offsetY = 50
  private radius = 22 // 棋子半径
  private situation: VirtualBoardSituation = deepCloneByJSON(record[0]) // 当前局面，初始时为record[0]
  private record = record // 棋谱记录
  private checkedChess: ChessDictionaryItem | null = null // 被选中的棋子
  private checkedX = -1 // 选中的棋子的位置
  private checkedY = -1
  private round = 0 // 回合数
  private moves: Moves | null = null // 所有的可行点

  constructor (props: ChessBoardProps) {
    super(props)
    
    this.state = {
      recordTextList: []
    }
  }

  componentDidMount () {
    this.initCanvas()
    this.initGame()

    const chessCanvas = this.chessCanvasRef.current

    chessCanvas?.addEventListener('click', (e: MouseEvent) => {
      const { cellWidth }  = this
      const { offsetX, offsetY } = e
      const point = { x: offsetX, y: offsetY}

      const x = Math.floor(offsetX / cellWidth) * cellWidth // 放大
      const y = Math.floor(offsetY / cellWidth) * cellWidth
      
      const A1 = { x: x, y: y }
      const A2 = { x: x + cellWidth, y: y }
      const B1 = { x: x, y: y + cellWidth }
      const B2 = { x: x + cellWidth, y: y + cellWidth }

      let minPoint = canvasCalculator.getMinDistancePoint(point, [A1, A2, B1, B2])
      if (!minPoint) return
      const col = minPoint.x / cellWidth + 2, row = minPoint.y / cellWidth + 2
      const seq = chessUtils.coordXY(col, row)
      if (!chessUtils.isLegal(seq)) { // 在棋盘不合法范围内
        return
      }

      if (this.checkedChess) { // 已经有棋子被选中了，此时只能是落子或者切换棋子
        const checkedSeq = chessUtils.coordXY(this.checkedX, this.checkedY)
        if (chessUtils.isSameColor(this.situation[seq], this.situation[checkedSeq])) { // 同色棋子，执行切换棋子的操作
          this.switchChess(col, row)
        } else { // 落子
          this.putChess(col, row)
        }
      } else { // 选棋子
        if (canvasCalculator.getDistancePow(point, minPoint) < Math.pow(this.radius, 2)) { // 落在圆形内
          this.pickChess(col, row)
        }
      }
    })
  }

  onRef (ref: RefObject<BoardCanvas>) {
    console.log('onRef: ', ref)
    this.boardCanvasRef = ref
  }

  // 初始化画布
  initCanvas () {
    this.chessCanvasCtx = this.chessCanvasRef?.current?.getContext('2d') ?? null
    if (!this.chessCanvasCtx) return

    let ratio = this.ratio = getCanvasPixelRatio(this.chessCanvasCtx) // 获取画布缩放比
    this.setCanvasStyle() // 根据样式宽高动态设置canvas宽高
    this.chessCanvasCtx?.scale(ratio, ratio) // 根据缩放比设置画布缩放
  }

  // 初始化游戏
  initGame () {
    const { chessCanvasCtx } = this
    if (!chessCanvasCtx) return
    this.initChessBoard()
    this.drawSituation(chessCanvasCtx) // 绘制初始局面
  }

  // 初始化棋盘
  initChessBoard () {
    console.log('init Chess board: ', this.boardCanvasRef)
    this.boardCanvasRef.initBoard() // todo
  }

  // 设置canvas的样式
  setCanvasStyle () {
    const chessCanvas = this.chessCanvasRef.current
    if (!chessCanvas) return
    const style = getStyle(chessCanvas)

    const width = parseInt(style.width.replace('px', ''))
    const height = parseInt(style.height.replace('px', ''))

    chessCanvas.width = width * this.ratio
    chessCanvas.height = height * this.ratio
  }

  // 绘制选中棋子的标志
  drawSelector (ctx: CanvasRenderingContext2D, col: number, row: number) {
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
  drawLineInChessCanvas (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) { // 参数中的坐标相对棋盘定位，而不是相对画布定位
    const { offsetX, offsetY } = this
    ctx.beginPath()
    ctx.moveTo(x1 + offsetX, y1 + offsetY)
    ctx.lineTo(x2 + offsetX, y2  + offsetY)
    ctx.closePath()
    ctx.stroke()
  }

  // 绘制一个棋子
  drawChess (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, chess: ChessDictionaryItem) {
    const { cellWidth, offsetX, offsetY, radius: r } = this
    const text = chess.name

    x = x * cellWidth
    y = y * cellWidth

    ctx.beginPath()
    ctx.arc(offsetX + x , offsetY + y, r, 0, 2 * Math.PI, false)
    ctx.closePath()
    // ctx.lineStyle = color
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
  drawSituation (ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return
    this.situation.forEach((item, k) => {
      const x = chessUtils.fileX(k)
      const y = chessUtils.rankY(k)
      const chessSeq = this.situation[k]
      const chess = getChessByValue(chessSeq)
      if (chessSeq !== 0 && chess) { // 该位置有棋子
        if ((chessSeq & 16) === 16) { // 红方棋子
          this.drawChess(ctx, x - 3, y - 3, 'red', chess)
        } else { // 黑方棋子
          this.drawChess(ctx, x - 3, y - 3, 'black', chess)
        }
      }
    })
  }

  // 执行切换棋子的操作
  switchChess (x: number, y: number) { // x，y为棋子的落点
    const { cellWidth, chessCanvasCtx } = this
    if (!chessCanvasCtx) return
    this.checkedX = x
    this.checkedY = y
    const checkedSeq = chessUtils.coordXY(x, y)
    chessCanvasCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCanvasCtx)
    this.drawSelector(chessCanvasCtx, x - 3, y - 3)
    // this.checkedChess = chessDictionary[numCharMap[this.situation[checkedSeq]]]
    this.checkedChess = getChessByValue(checkedSeq);
    this.moves = this.checkedChess?.generateMoves(checkedSeq, this.situation) ?? null
    this.drawCanMoveSites(chessCanvasCtx, this.moves)
  }

  // 落子
  putChess (x: number, y: number) {
    const { cellWidth, chessCanvasCtx } = this
    const seq = chessUtils.coordXY(x, y)
    const checkedSeq = chessUtils.coordXY(this.checkedX, this.checkedY)

    if (!chessCanvasCtx) return
    
    if (this.moves![seq] === 0) { // 判断落点是否符合走子规则
      return
    }

    this.writeOneRecord(x, y) // 记谱
    this.situation[seq] = this.situation[checkedSeq]
    this.situation[checkedSeq] = 0
    chessCanvasCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCanvasCtx)
    this.drawSelector(chessCanvasCtx, x - 3, y - 3)
    this.drawSelector(chessCanvasCtx, this.checkedX - 3, this.checkedY - 3)
    this.checkedChess = null
    this.round ++ // 落子后，回合数就增加了
    
    const copySituation = deepCloneByJSON(this.situation) // 每次落子后，将当前局面推入数组
    this.record.push(copySituation)
  }

  // 拿起棋子（this.checked 从 false 变为 true）
  pickChess (col: number, row: number) {
    const { cellWidth, chessCanvasCtx } = this
    const chessSeq = chessUtils.coordXY(col, row)
    const chessValue = this.situation[chessSeq]
    const chess = getChessByValue(chessValue)

    if (chess !== null) {
      if ((Math.floor(this.round % 2) === 1 && chessUtils.isBlack(chessValue))
        || (Math.floor(this.round % 2) === 0 && chessUtils.isRed(chessValue))
      ) {
        if (!chessCanvasCtx) return
        chessCanvasCtx.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
        this.drawSituation(chessCanvasCtx)
        this.drawSelector(chessCanvasCtx, col - 3, row - 3)
        this.checkedChess = chess
        this.checkedX = col
        this.checkedY = row
        this.moves = chess.generateMoves(chessSeq, this.situation)
        this.drawCanMoveSites(chessCanvasCtx, this.moves)
      }
    }
  }

  // 绘制该棋子的所有可行点
  drawCanMoveSites (ctx: CanvasRenderingContext2D, moves: Moves | null) {
    if (!moves) return
    const { offsetX, offsetY, cellWidth } = this

    ctx.strokeStyle = '#78ce27'
    ctx.lineWidth = 2
    ctx.fillStyle = '#fff'
    moves.forEach((site, k) => {
      const col = chessUtils.fileX(k), row = chessUtils.rankY(k)
      if (site === 1) {
        const x = (col - 3) * cellWidth
        const y = (row - 3) * cellWidth
        ctx.beginPath()
        ctx.arc(offsetX + x , offsetY + y, 7, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      }
    })
  }

  // 悔棋
  repentance () {
    const { cellWidth, chessCanvasCtx } = this
    const { recordTextList } = this.state

    if (this.round === 0) { // 第0回合，无法悔棋
      return
    }

    this.record.pop() // 悔棋后，删除记录中的最后一个局面
    recordTextList.pop() // 清除这一步的记谱文本
    this.setState({
      recordTextList
    })
    this.situation = deepCloneByJSON(this.record[this.record.length - 1]) // 取现在记录中的最后一个局面作为当前局面
    
    chessCanvasCtx?.clearRect(0, 0, 10 * cellWidth, 11 * cellWidth)
    this.drawSituation(chessCanvasCtx)
    this.round --
  }

  // 记谱
  writeOneRecord (col: number, row: number) { // row和col为落子的横纵坐标
    const { checkedX, checkedY } = this // 选中的棋子
    const checkedSeq = chessUtils.coordXY(checkedX, checkedY)
    const checkedValue = this.situation[checkedSeq]
    let oldPoint = { x: checkedX, y: checkedY }
    let newPoint = { x: col, y: row }

    const chess = getChessByValue(checkedValue)
    if (!chess) return
    const { name } = chess

    let copySituation = JSON.parse(JSON.stringify(this.situation))

    if (chessUtils.isRed(this.situation[checkedSeq])) { // 红方棋子，记谱时要做镜像翻转
      oldPoint = chessUtils.getCentrosymmetricSite(oldPoint)
      newPoint = chessUtils.getCentrosymmetricSite(newPoint)
      copySituation = chessUtils.generateCentrosymmetricSituation(copySituation)
    }
    copySituation = chessUtils.VBoardToRBoard(copySituation)

    // 处理为真正的棋盘上的坐标，供记谱函数使用
    oldPoint.x -= 3
    oldPoint.y -= 3
    newPoint.x -= 3
    newPoint.y -= 3

    const fullname = generateChessFullname(name, oldPoint, copySituation)
    let recordText = generateChessRecordText(oldPoint, newPoint, fullname)
    this.setState({
      recordTextList: [...this.state.recordTextList, recordText]
    })
  }

  render () {
    return (
      <ChessBoardContainer>
        <button className="retract-btn" onClick={this.repentance.bind(this)}>悔棋</button>
        <CanvasContainer>
          <canvas className="chessCanvas" ref={this.chessCanvasRef}></canvas> {/* boardCanvas与chessCanvas的大小始终保持一致 */}
          <BoardCanvas onRef={this.onRef.bind(this)}></BoardCanvas>
        </CanvasContainer>
        <RecordHistory recordList={this.state.recordTextList} />
      </ChessBoardContainer>
    )
  }
}

export default ChessBoard