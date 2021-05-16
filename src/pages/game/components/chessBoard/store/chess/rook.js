/* class--车 */
import Chess from './chess'
import { generateInitMove } from '@/helpers/chessHelper'
import { isSameColor } from '@/utils/chess'

export default class Rook extends Chess {
  constructor () {
    super ()
    this.name = ''
  }

  // 生成走法
  generateMoves (x, y, situation) { // 坐标和表示局面的二维数组
    const canMoveArray = generateInitMove()
    const direction = [ // 车移动一步的方向
      { x: +0, y: +1 },
      { x: +1, y: +0 },
      { x: +0, y: -1 },
      { x: -1, y: +0 }
    ] 
    for (let i = 0; i < direction.length; i ++) {
      let col = x, row = y
      for (let j = 0; j < 10; j ++) { // 横车最多走8步，直车最多走9步
        col += direction[i].x
        row += direction[i].y
        if (col < 0 || col > 8 || row < 0 || row > 9) { // 超出边界
          break
        }
        if (situation[row][col] === '0') { // 目标位置无棋子，直接记录
          canMoveArray[row][col] = '1'
        } else if (situation[y][x] !== '0' && isSameColor(situation[y][x], situation[row][col])) { // 有本方棋子
          break
        } else { // 是对方棋子
          canMoveArray[row][col] = '1'
          break
        }
      }
    }
    return canMoveArray
  }
}