/* “士”棋子类 */

import Chess from './chess'
import { generateInitMove } from '../../../../helpers/chessHelper'
import { isSameColor } from '../../../../utils/chess'

export default class Advisor extends Chess {
  constructor () {
    super()
    this.name = ''
  }

  // 生成走法
  generateMoves (x, y, situation) {
    const canMoveArray = generateInitMove()
    const direction = [ // 士可以移动的方向
      { x: -1, y: -1 },
      { x: +1, y: -1 },
      { x: +1, y: +1 },
      { x: -1, y: +1 }
    ]
    const assist = [ // 辅助数组，用来判断棋子是否位于九宫
      ['0', '0', '0', '1', '1', '1', '0', '0', '0'],
      ['0', '0', '0', '1', '1', '1', '0', '0', '0'],
      ['0', '0', '0', '1', '1', '1', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '1', '1', '1', '0', '0', '0'],
      ['0', '0', '0', '1', '1', '1', '0', '0', '0'],
      ['0', '0', '0', '1', '1', '1', '0', '0', '0']
    ]
    for (let i = 0; i < direction.length; i ++) {
      let col = x + direction[i].x, row = y + direction[i].y
      if (col < 0 || col > 8 || row < 0 || row > 9) { // 超出边界
        continue
      }
      if (assist[row][col] !== '1') { // 超出九宫
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