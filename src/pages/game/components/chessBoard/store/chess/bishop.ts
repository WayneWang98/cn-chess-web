/* “象”棋子类 */

import Chess from './chess'
import { generateInitMove } from 'src/helpers/chessHelper'
import { isSameColor, isLegal } from 'src/utils/chess'
import { VirtualBoardSituation } from 'src/types/types'

export default class Bishop extends Chess {
  
  // 生成走法
  generateMoves (seq: number, situation: VirtualBoardSituation) {
    const canMoveArray = generateInitMove()
    const direction = [ // 象可以移动的方向
      -0x22, // 左上
      -0x1e, // 右上
      +0x22, // 右下
      +0x1e // 左下
    ]
    const bishopCheck = [ // 象眼方向
      -0x11,
      -0x0f,
      +0x11,
      +0x0f
    ]
    const assist = [ // 辅助数组，用来判断象是否位于合法位置（这里取巧了，不直接判断象是否能过河）
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]

    for (let i = 0; i < direction.length; i ++) {
      let newSeq = direction[i] + seq
      if (!isLegal(newSeq)) { // 超出边界
        continue
      }
      if (assist[newSeq] === 0) { // 象是否在合法位置
        continue
      }
      if (isSameColor(situation[seq], situation[newSeq])) { // 有本方棋子
        continue
      }
      if (situation[seq + bishopCheck[i]] === 0) { // 象眼检测
        canMoveArray[newSeq] = 1
      }
    }
    return canMoveArray
  }
}