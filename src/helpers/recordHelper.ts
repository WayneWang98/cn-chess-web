/* 棋谱辅助函数文件 */

import { Site, RealBoardSituation } from 'src/types/types'

enum RecordDirection {
  OBLIQUE = 'OBLIQUE', // 斜着走
  FORWARD = 'FORWARD', // 进
  BACKWARd = 'BACKWARd', // 退
  HORIZONTAL = 'HORIZONTAL' // 平
}

type RecordStrateGies = {
  [key in RecordDirection]: (check: Site, put: Site, name: string) => string
}

const strategies: RecordStrateGies = { // 记谱策略
  [RecordDirection.OBLIQUE](check, put, name) {
    let { y: checkedY } = check
    let { x: putX, y: putY } = put
    const direction = checkedY > putY ? '退' : '进'
    return `${name}${direction}${putX + 1}`
  },
  [RecordDirection.FORWARD](check, put, name) {
    let { y: checkedY } = check
    let { y: putY } = put
    const len = putY - checkedY
    return `${name}进${len}`
  },
  [RecordDirection.BACKWARd](check, put, name) {
    let { y: checkedY } = check
    let { y: putY } = put
    const len = checkedY - putY
    return `${name}退${len}`
  },
  [RecordDirection.HORIZONTAL](check, put, name) {
    const { x: putX } = put
    return `${name}平${putX + 1}`
  }
}

// 根据点生成策略关键字
const generateStrategyKey = (check: Site, put: Site) => { // check：拿起的棋子位置，put：放下的棋子位置
  const { x: checkedX, y: checkedY } = check
  const { x: col, y: row } = put
  // 以黑棋（上方棋子）为参考
  if (col === checkedX && row - checkedY > 0) { // （垂直）进
    return RecordDirection.FORWARD
  }
  if (col === checkedX && row - checkedY < 0) { // （垂直）退
    return RecordDirection.BACKWARd
  }
  if (row === checkedY) { // 平
    return RecordDirection.HORIZONTAL
  }
  if (col !== checkedX && row !== checkedY) {
    return RecordDirection.OBLIQUE
  }
}

// 生成棋子的完整名称(如：马二/前马)
export const generateChessFullname = (name: string, site: Site, situation: RealBoardSituation) => { // 棋子名称，棋子坐标，当前局面
  const { x, y } = site

  for (let i = 0; i < situation.length; i++) {
    if (i !== y && situation[i][x] === situation[y][x]) { // 存在相同棋子在垂直方向的情况
      const isFirst = y > i
      return isFirst ? `前${name}` : `后${name}`
    }
  }
  return `${name}${x + 1}`
}

// 生成记谱文字
export const generateChessRecordText = (check: Site, put: Site, name: string): string => {
  const key = generateStrategyKey(check, put)
  if (key) {
    return strategies[key](check, put, name)
  } else {
    return ''
  }
}