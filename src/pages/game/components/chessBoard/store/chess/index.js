import Knight from './knight'
import King from './king'
import Advisor from './advisor'
import Bishop from './bishop'
import Rook from './rook'
import Cannon from './cannon'
import Pawn from './pawn'

const situation = [ // 16 * 16 的矩阵表示初始局面
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 39, 37, 35, 33, 32, 34, 36, 38, 40, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 42, 0, 0, 0, 0, 0,
  0, 0, 0, 43, 0, 44, 0, 45, 0, 46, 0, 47, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 0, 0, 0,
  0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 23, 21, 19, 17, 16, 18, 20, 22, 24, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

// 数字与棋子字母的映射
export const numCharMap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 'K', 'A', 'A', 'B',
  'B', 'N', 'N', 'R', 'R', 'C', 'C', 'P', 'P', 'P',
  'P', 'P', 'k', 'a', 'a', 'b', 'b', 'n', 'n', 'r',
  'r', 'c', 'c', 'p', 'p', 'p', 'p', 'p', 0, 0
]

export const record = [ // 局面数组
  situation
]

// 象棋字典：采用国际象棋中FEN串的起名方法表示
export const chessDictionary = {
  // 红方
  'K': {
    name: '帅',
    generateMoves (x, y, situation) {
      const king = new King()
      return king.generateMoves(x, y, situation)
    }
  },
  'A': {
    name: '仕',
    generateMoves (x, y, situation) {
      const advisor = new Advisor()
      return advisor.generateMoves(x, y, situation)
    }
  },
  'B': {
    name: '相',
    generateMoves (x, y, situation) {
      const bishop = new Bishop()
      return bishop.generateMoves(x, y, situation)
    }
  },
  'N': {
    name: '马',
    // 生成走法
    generateMoves (x, y, situation) {
      const knight = new Knight()
      return knight.generateMoves(x, y, situation)
    }
  },
  'R': {
    name: '車',
    generateMoves (x, y, situation) {
      const rook = new Rook()
      return rook.generateMoves(x, y, situation)
    }
  },
  'C': {
    name: '炮',
    generateMoves (x, y, situation) {
      const cannon = new Cannon()
      return cannon.generateMoves(x, y, situation)
    }
  },
  'P': {
    name: '兵',
    generateMoves (x, y, situation) {
      const pawn = new Pawn()
      return pawn.generateMoves(x, y, situation)
    }
  },
  // 黑方
  'k': {
    name: '将',
    generateMoves (x, y, situation) {
      const king = new King()
      return king.generateMoves(x, y, situation)
    }
  },
  'a': {
    name: '士',
    generateMoves (x, y, situation) {
      const advisor = new Advisor()
      return advisor.generateMoves(x, y, situation)
    }
  },
  'b': {
    name: '象',
    generateMoves (x, y, situation) {
      const bishop = new Bishop()
      return bishop.generateMoves(x, y, situation)
    }
  },
  'n': {
    name: '马',
    generateMoves (x, y, situation) {
      const knight = new Knight()
      return knight.generateMoves(x, y, situation)
    }
  },
  'r': {
    name: '車',
    generateMoves (x, y, situation) {
      const rook = new Rook()
      return rook.generateMoves(x, y, situation)
    }
  },
  'c': {
    name: '炮',
    generateMoves (x, y, situation) {
      const cannon = new Cannon()
      return cannon.generateMoves(x, y, situation)
    }
  },
  'p': {
    name: '卒',
    generateMoves (x, y, situation) {
      const pawn = new Pawn()
      return pawn.generateMoves(x, y, situation)
    }
  },
}
