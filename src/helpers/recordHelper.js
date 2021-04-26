/* 棋谱辅助函数文件 */

export const OBLIQUE = 'oblique' // 斜着走
export const FORWARD = 'forward' // 进
export const BACKWARd = 'backward' // 退
export const HORIZONTAL = 'horizontal' // 平

// 根据点生成策略关键字
const generateStratKey = (check, put) => { // check：拿起的棋子位置，put：放下的棋子位置
  const { x: checkedX, y: checkedY } = check
  const { x: col, y: row } = put
  // 以黑棋（上方棋子）为参考
  if (col === checkedX && row - checkedY > 0) { // （垂直）进
    return FORWARD
  }
  if (col === checkedX && row - checkedY < 0) { // （垂直）退
    return BACKWARd
  }
  if (row === checkedY) { // 平
    return HORIZONTAL
  }
  if (col !== checkedX && row !== checkedY) {
    return OBLIQUE
  }
}

const strategies = { // 记谱策略
  [OBLIQUE] (check, put, name) {
    let { x: checkedX, y: checkedY } = check
    let { x: putX, y: putY } = put
    const direction = checkedY > putY ? '退' : '进'
    return `${name}${checkedX + 1}${direction}${putX + 1}`
  },
  [FORWARD] (check, put, name) {
    let { x, y: checkedY } = check
    let { y: putY } = put
    const len = putY - checkedY
    x ++
    return `${name}${x}进${len}`
  },
  [BACKWARd] (check, put, name) {
    let { x, y: checkedY } = check
    let { y: putY } = put
    const len = checkedY - putY
    x ++
    return `${name}${x}退${len}`
  },
  [HORIZONTAL] (check, put, name) {
    const { x: checkedX } = check
    const { x: putX } = put
    return `${name}${checkedX + 1}平${putX + 1}`
  }
}

// 生成记谱文字
export const generateChessRecordText = (check, put, name) => {
  const key = generateStratKey(check, put)
  return strategies[key](check, put, name)
}