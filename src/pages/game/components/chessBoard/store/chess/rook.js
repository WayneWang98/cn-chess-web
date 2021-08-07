/* class--车 */
import Chess from './chess'
import { generateInitMove } from '@/helpers/chessHelper'
import { isSameColor, isLegal } from '@/utils/chess'

export default class Rook extends Chess {
  constructor () {
    super ()
    this.name = ''
  }

  // 生成走法
  generateMoves (seq, situation) { // 坐标和表示局面的二维数组
    const canMoveArray = generateInitMove()
    const direction = [ // 车移动一步的方向
      - 0x01,
      - 0x10,
      + 0x01,
      + 0x10
    ] 
    for (let i = 0; i < direction.length; i ++) {
      let newSeq = seq
      for (let j = 0; j < 10; j ++) { // 横车最多走8步，直车最多走9步
        newSeq += direction[i]
        if (!isLegal(newSeq)) { // 超出边界
          break
        }
        if (situation[newSeq] === 0) { // 目标位置无棋子，直接记录
          canMoveArray[newSeq] = 1
        } else if (situation[newSeq] !== 0 && isSameColor(situation[seq], situation[newSeq])) { // 有本方棋子
          break
        } else { // 是对方棋子
          canMoveArray[newSeq] = 1
          break
        }
      }
    }
    return canMoveArray
  }
}