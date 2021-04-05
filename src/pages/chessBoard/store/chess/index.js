import Knight from './knight'
import King from './king'
import Advisor from './advisor'
import Bishop from './bishop'
import Rook from './rook'
import Cannon from './cannon'
import Pawn from './pawn'

export const record = [ // 初始局面
  ['r', 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', 'c', '0', '0', '0', '0', '0', 'c', '0'],
  ['p', '0', 'p', '0', 'p', '0', 'p', '0', 'p'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['P', '0', 'P', '0', 'P', '0', 'P', '0', 'P'],
  ['0', 'C', '0', '0', '0', '0', '0', 'C', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R']
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
