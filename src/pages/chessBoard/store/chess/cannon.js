/* class--炮 */
import Chess from './chess'
import { generateInitMove } from '../../../../helpers/chessHelper'
import { isSameColor } from '../../../../utils/chess'

export default class Cannon extends Chess {
  constructor () {
    super ()
    this.name = ''
  }

  // 生成走法
  generateMoves (x, y, situation) { // 坐标和表示局面的二维数组
    const canMoveArray = generateInitMove()
    const direction = [ // 炮移动一步的方向
      { x: +0, y: +1 },
      { x: +1, y: +0 },
      { x: +0, y: -1 },
      { x: -1, y: +0 }
    ] 
    for (let i = 0; i < direction.length; i ++) {
      let col = x, row = y, overFlag = false // 是否越过了棋子
      for (let j = 0; j < 10; j ++) { // 炮最多走9步
        col += direction[i].x
        row += direction[i].y
        if (col < 0 || col > 8 || row < 0 || row > 9) { // 超出边界
          break
        }
        if (situation[row][col] === '0') { // 目标位置无棋子
          if (overFlag) {
            continue // 已经越过棋子，且目标位置无棋子，搜索下一位置是否有棋子
          }
          canMoveArray[row][col] = '1'
        } else { // 有棋子
          if (overFlag) { // 已经有越过的棋子
            if (isSameColor(situation[y][x], situation[row][col])) { // 是本方棋子
              break // 已经越过棋子，且目前位置是本方棋子，直接终止这个方向的搜索
            } else { // 是对方棋子
              canMoveArray[row][col] = '1' // 可以吃掉
              break
            }
          } else {
            overFlag = true // 有可以越过的棋子，将越过标志置为true
          }
        }
      }
    }
    return canMoveArray
  }
}