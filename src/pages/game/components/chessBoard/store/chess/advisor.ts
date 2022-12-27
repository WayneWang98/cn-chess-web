/* “士”棋子类 */

import Chess from './chess'
import { generateInitMove } from 'src/helpers/chessHelper'
import { isSameColor, isLegal } from 'src/utils/chess'
import { VirtualBoardSituation } from 'src/types/types'

export default class Advisor extends Chess {
  // // 生成走法
  generateMoves (seq: number, situation: VirtualBoardSituation) {
    const canMoveArray = generateInitMove()
    const direction = [ // 士可以移动的方向
      -0x11, // 左上
      -0x0f, // 右上
      +0x11, // 右下
      +0x0f // 左下
    ]
    const assist = [ // 辅助数组，用来判断棋子是否位于九宫
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    for (let i = 0; i < direction.length; i ++) {
      let newSeq = direction[i] + seq // 新的棋子序列号
      if (!isLegal(newSeq)) { // 超出边界
        continue
      }
      if (assist[newSeq] !== 1) { // 超出九宫
        continue
      }
      if (isSameColor(situation[newSeq], situation[seq])) { // 有本方棋子
        continue
      }
      canMoveArray[newSeq] = 1
    }
    return canMoveArray
  }
}