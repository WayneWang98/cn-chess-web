import { Site, RealBoardSituation, VirtualBoardSituation } from 'src/types/types'
import { print16 } from '../debug'
import { deepCloneByJSON } from './index'

// 判断是否是红方棋子
export const isRed = (num: number) => {
  return (num & 16) === 16
}

// 判断是否是黑方棋子
export const isBlack = (num: number) => {
  return (num & 32) === 32
}

// 判断是否是同色棋子
export const isSameColor = (num1: number, num2: number) => {
 return (isRed(num1) && isRed(num2)) || (isBlack(num1) && isBlack(num2))
}

// 获取关于中心对称的棋子坐标（只限于合法棋盘部分）
export const getCentrosymmetricSite = (site: Site) => {
  return { 
    x: 14 - site.x,
    y: 15 - site.y
  }
}

// 生成翻转棋盘局面
export const generateCentrosymmetricSituation = (situation: RealBoardSituation) => {
  const copySituation = deepCloneByJSON(situation)
  for (let i = 0; i < 128; i ++ ) {
    if (isLegal(i)) { // 合法范围内的局面才做翻转
      const temp = copySituation[i]
      copySituation[i] = copySituation[255 - i - 1]
      copySituation[255 - i - 1] = temp
    }
  }
  print16(copySituation)
  return copySituation
}

// 将二维矩阵中的元素转换为一维矩阵中的元素
export const coordXY = (x: number, y: number) => {
  return x + (y << 4)
}
 
// 根据一维矩阵，获取二维矩阵行数
export const rankY = (sq: number) => {
  return sq >> 4 // 通过按位运算缩短后期计算时间
}
 
// 根据一维矩阵，获取二维矩阵列数
export const fileX = (sq: number) => {
  return sq & 15
}

// 10 * 9 的棋盘（RBoard）转换为 16 * 16 的棋盘（VBoard）
// export const RBoardToVBoard = (RBoard) => {
//   let VBoard = new Array(16)
//   for (let i = 0; i < 16; i ++) {
//     VBoard[i] = new Array(16).fill(0)
//     if (i >= 3 && i <= 12) {
//       for (let j = 3; j <= 11; j ++) {
//         VBoard[i][j] = RBoard[i - 3][j - 3]
//       }
//     }
//   }
//   return VBoard
// }

/**
 * 虚拟棋盘矩阵(16 * 16)转为真实棋盘(9 * 9)矩阵
 */
export const VBoardToRBoard = (vBoard: VirtualBoardSituation) => {
  const rBoard: RealBoardSituation = new Array(10)
  for (let i = 0; i < 10; i ++) {
    rBoard[i] = new Array(9).fill(0)
    for (let j = 0; j < 9; j ++) {
      rBoard[i][j] = vBoard[coordXY(j + 3, i + 3)]
    }
  }
  return rBoard
}

const legalPosition = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

// 判断一个棋子是否在合法棋盘范围
export const isLegal = (sq: number) => {
  return !!legalPosition[sq]
}