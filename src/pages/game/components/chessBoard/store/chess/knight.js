/* class--马 */
import Chess from './chess'
import { generateInitMove } from '@/helpers/chessHelper'
import { isSameColor } from '@/utils/chess'

export default class Knight extends Chess {
  constructor () {
    super ()
    this.name = ''
  }

  // 生成走法
  generateMoves (x, y, situation) { // 坐标和表示局面的二维数组
    const canMoveArray = generateInitMove()
    const direction = [ // 马可以移动的方向
      { x: -2, y: -1 },
      { x: -2, y: +1 },
      { x: -1, y: +2 },
      { x: +1, y: +2 },
      { x: +2, y: +1 },
      { x: +2, y: -1 },
      { x: +1, y: -2 },
      { x: -1, y: -2 }
    ] 
    const knightCheck = [ // 马脚的方向
      { x: -1, y: +0 },
      { x: -1, y: +0 },
      { x: +0, y: +1 },
      { x: +0, y: +1 },
      { x: +1, y: +0 },
      { x: +1, y: +0 },
      { x: +0, y: -1 },
      { x: +0, y: -1 }
    ]
    for (let i = 0; i < direction.length; i ++) {
      let col = x + direction[i].x, row = y + direction[i].y
      if (col < 0 || col > 8 || row < 0 || row > 9) { // 超出边界
        continue
      }
      if (situation[y][x] !== '0' && isSameColor(situation[y][x], situation[row][col])) { // 是否有己方棋子
        continue
      }
      if (situation[y + knightCheck[i].y][x + knightCheck[i].x] === '0') { // 马腿检测
        canMoveArray[row][col] = '1'
      }
    }
    return canMoveArray
  }
}