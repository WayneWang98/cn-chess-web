/* “象”棋子类 */

import Chess from './chess'
import { generateInitMove } from '../../../../helpers/chessHelper'
import { isSameColor } from '../../../../utils/chess'

export default class Bishop extends Chess {
  constructor () {
    super()
    this.name = ''
  }

  // 生成走法
  generateMoves (x, y, situation) {
    const canMoveArray = generateInitMove()
    const direction = [ // 象可以移动的方向
      { x: -2, y: -2 },
      { x: +2, y: -2 },
      { x: +2, y: +2 },
      { x: -2, y: +2 }
    ]

    for (let i = 0; i < direction.length; i ++) {
      let col = x + direction[i].x, row = y + direction[i].y
      if (col < 0 || col > 8 || row < 0 || row > 9) { // 超出边界
        continue
      }
      if (isSameColor(situation[row][col], situation[y][x])) { // 有本方棋子
        continue
      }
      canMoveArray[row][col] = '1'
    }
    return canMoveArray
  }
}