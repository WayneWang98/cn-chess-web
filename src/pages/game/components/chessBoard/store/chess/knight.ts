/* class--马 */
import Chess from './chess'
import { generateInitMove } from 'src/helpers/chessHelper'
import { isSameColor, isLegal } from 'src/utils/chess'
import { VirtualBoardSituation } from 'src/types/types'

export default class Knight extends Chess {
  // 生成走法
  generateMoves (seq: number, situation: VirtualBoardSituation) { // 坐标和表示局面的二维数组
    const canMoveArray = generateInitMove()
    const direction = [ // 马可以移动的方向
      +0x0e,
      -0x12,
      -0x21,
      -0x1f,
      -0x0e,
      +0x12,
      +0x1f,
      +0x21
    ] 
    const knightCheck = [ // 马脚的方向
      -0x01,
      -0x01,
      -0x10,
      -0x10,
      +0x01,
      +0x01,
      +0x10,
      +0x10
    ]
    for (let i = 0; i < direction.length; i ++) {
      let newSeq = direction[i] + seq
      if (!isLegal(newSeq)) { // 超出边界
        continue
      }
      if (situation[newSeq] !== 0 && isSameColor(situation[seq], situation[newSeq])) { // 是否有己方棋子
        continue
      }
      if (situation[seq + knightCheck[i]] === 0) { // 马腿检测
        canMoveArray[newSeq] = 1
      }
    }
    return canMoveArray
  }
}