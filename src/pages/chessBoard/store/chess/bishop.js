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
    const bishopCheck = [ // 象眼方向
      { x: -1, y: -1 },
      { x: +1, y: -1 },
      { x: +1, y: +1 },
      { x: -1, y: +1 }
    ]
    const assist = [ // 辅助数组，用来判断象是否位于合法位置（这里取巧了，不直接判断象是否能过河）
      ['0', '0', '1', '0', '0', '0', '1', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['1', '0', '0', '0', '1', '0', '0', '0', '1'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '1', '0', '0', '0', '1', '0', '0'],
      ['0', '0', '1', '0', '0', '0', '1', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['1', '0', '0', '0', '1', '0', '0', '0', '1'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '1', '0', '0', '0', '1', '0', '0']
    ]

    for (let i = 0; i < direction.length; i ++) {
      let col = x + direction[i].x, row = y + direction[i].y
      if (col < 0 || col > 8 || row < 0 || row > 9) { // 超出边界
        continue
      }
      if (assist[row][col] === '0') { // 象是否在合法位置
        continue
      }
      if (isSameColor(situation[row][col], situation[y][x])) { // 有本方棋子
        continue
      }
      if (situation[y + bishopCheck[i].y][x + bishopCheck[i].x] === '0') { // 象眼检测
        canMoveArray[row][col] = '1'
      }
    }
    return canMoveArray
  }
}