import Chess from './chess'
import { generateInitMove } from 'src/helpers/chessHelper'
import { isSameColor, isLegal } from 'src/utils/chess'
import { VirtualBoardSituation } from 'src/types/types'

export default class King extends Chess {
  // 生成走法
  generateMoves (seq: number, situation: VirtualBoardSituation) {
    const canMoveArray = generateInitMove()
    const direction = [ // 将可以移动的方向
      -0x10, // 上
      +0x01, // 右
      +0x10, // 下
      -0x01 // 左
    ]
    const assist = [ // 辅助数组，用来判断将/帅是否位于九宫
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
    for (let i = 0; i < direction.length; i ++) {
      let newSeq = seq + direction[i]
      if (!isLegal(newSeq)) { // 超出边界
        continue
      }
      if (assist[newSeq] !== 1) { // 超出九宫
        continue
      }
      if (isSameColor(situation[seq], situation[newSeq])) { // 有本方棋子
        continue
      }
      canMoveArray[newSeq] = 1
    }
    return canMoveArray
  }
}