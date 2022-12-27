import Knight from './knight'
import King from './king'
import Advisor from './advisor'
import Bishop from './bishop'
import Rook from './rook'
import Cannon from './cannon'
import Pawn from './pawn'
import { Moves, VirtualBoardSituation } from 'src/types/types'

enum ChessKey {
  K = 'K',
  A = 'A',
  B = 'B',
  N = 'N',
  R = 'R',
  C = 'C',
  P = 'P',
  k = 'k',
  a = 'a',
  b = 'b',
  n = 'n',
  r = 'r',
  c = 'c',
  p = 'p',
}

export type ChessDictionaryItem = {
  name: string
  generateMoves: (seq: number, situation: VirtualBoardSituation) => Moves
}


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
export const numCharMap: (string | number)[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 'K', 'A', 'A', 'B',
  'B', 'N', 'N', 'R', 'R', 'C', 'C', 'P', 'P', 'P',
  'P', 'P', 'k', 'a', 'a', 'b', 'b', 'n', 'n', 'r',
  'r', 'c', 'c', 'p', 'p', 'p', 'p', 'p', 0, 0
]

export const record = [ // 局面数组
  situation
]

// 根据situation数组中的值获取chess
export const getChessByValue = (value: number) => {
  const key = numCharMap[value]
  if (key === 0) {
    return null
  } else {
    return chessDictionary[key as ChessKey]  // todo: determine the type of key
  }
}

// 象棋字典：采用国际象棋中FEN串的起名方法表示
export const chessDictionary: {
  [key in ChessKey]: ChessDictionaryItem
} = {
  // 红方
  'K': {
    name: '帅',
    generateMoves (seq, situation) {
      const king = new King()
      return king.generateMoves(seq, situation)
    }
  },
  'A': {
    name: '仕',
    generateMoves (seq, situation) {
      const advisor = new Advisor()
      return advisor.generateMoves(seq, situation)
    }
  },
  'B': {
    name: '相',
    generateMoves (seq, situation) {
      const bishop = new Bishop()
      return bishop.generateMoves(seq, situation)
    }
  },
  'N': {
    name: '马',
    // 生成走法
    generateMoves (seq, situation) {
      const knight = new Knight()
      return knight.generateMoves(seq, situation)
    }
  },
  'R': {
    name: '車',
    generateMoves (seq, situation) {
      const rook = new Rook()
      return rook.generateMoves(seq, situation)
    }
  },
  'C': {
    name: '炮',
    generateMoves (seq, situation) {
      const cannon = new Cannon()
      return cannon.generateMoves(seq, situation)
    }
  },
  'P': {
    name: '兵',
    generateMoves (seq, situation) {
      const pawn = new Pawn()
      return pawn.generateMoves(seq, situation)
    }
  },
  // 黑方
  'k': {
    name: '将',
    generateMoves (seq, situation) {
      const king = new King()
      return king.generateMoves(seq, situation)
    }
  },
  'a': {
    name: '士',
    generateMoves (seq, situation) {
      const advisor = new Advisor()
      return advisor.generateMoves(seq, situation)
    }
  },
  'b': {
    name: '象',
    generateMoves (seq, situation) {
      const bishop = new Bishop()
      return bishop.generateMoves(seq, situation)
    }
  },
  'n': {
    name: '马',
    generateMoves (seq, situation) {
      const knight = new Knight()
      return knight.generateMoves(seq, situation)
    }
  },
  'r': {
    name: '車',
    generateMoves (seq, situation) {
      const rook = new Rook()
      return rook.generateMoves(seq, situation)
    }
  },
  'c': {
    name: '炮',
    generateMoves (seq, situation) {
      const cannon = new Cannon()
      return cannon.generateMoves(seq, situation)
    }
  },
  'p': {
    name: '卒',
    generateMoves (seq, situation) {
      const pawn = new Pawn()
      return pawn.generateMoves(seq, situation)
    }
  },
}
