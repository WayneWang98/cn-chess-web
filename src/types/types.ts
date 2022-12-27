export type CanvasPoint = { // 画布上的像素点
  x: number
  y: number
}

// 棋盘矩阵相关的数据类型
export type VirtualBoardSituation = number[] // 虚拟棋盘的局面表示
export type RealBoardSituation = number[][] // 真实Canvas棋盘的局面表示
export type Site = {
  x: number;
  y: number;
}
export type RecordList = string[] // 记谱（文字）列表
export type Moves = number[] // 棋子可以走的位置