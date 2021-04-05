/* class--卒 */
import Chess from './chess'
import { generateInitMove } from '../../../../helpers/chessHelper'
import { isSameColor, isRed } from '../../../../utils/chess'

export default class Pawn extends Chess {
  constructor () {
    super ()
    this.name = ''
  }

  // 生成走法
  generateMoves (x, y, situation) { // 坐标和表示局面的二维数组
    const canMoveArray = generateInitMove()
    const direction = [ // 卒移动的方向
      [ // 红色方行棋方向
        { x: +0, y: -1 },
        { x: -1, y: +0 },
        { x: +1, y: +0 }
      ],
      [ // 黑色方行棋方向
        { x: +0, y: +1 },
        { x: -1, y: +0 },
        { x: +1, y: +0 }
      ]
    ]

    const assist = [ // 辅助数组，用来判断过河以及卒的合理位置
      [ // 红兵合法位置
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '0', '1', '0', '1', '0', '1', '0', '1'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0']
      ],
      [ // 黑卒合法位置
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['1', '0', '1', '0', '1', '0', '1', '0', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1']
      ]
    ]
    
    let side = isRed(situation[y][x]) ? 0 : 1// 红方：0，黑方：1
    for (let i = 0; i < direction[side].length; i ++) {
      let col = x + direction[side][i].x, row = y + direction[side][i].y
      if (col < 0 || col > 8 || row < 0 || row > 9)  { // 是否超出边界
        continue
      }
      if (assist[side][row][col] === '0') { // 是否在合法位置
        continue
      }
      if (isSameColor(situation[y][x], situation[row][col])) { // 是本方棋子
        continue
      }
      canMoveArray[row][col] = '1'
    }
    
    return canMoveArray
  }
}