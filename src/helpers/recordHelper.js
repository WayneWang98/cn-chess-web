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

// 生成棋子的完整名称(如：马二/前马)
export const generateChessFullname = (name, point , situation) => { // 棋子名称，棋子坐标，当前局面
  const { x, y } = point

  for (let i = 0; i < situation.length; i ++) {
    if (i !== y && situation[i][x] === situation[y][x]) { // 存在相同棋子在垂直方向的情况
      const isFirst = y > i
      return isFirst ? `前${name}` : `后${name}`
    }
  }
  return `${name}${x + 1}`
}

const strategies = { // 记谱策略
  [OBLIQUE] (check, put, name) {
    let { y: checkedY } = check
    let { x: putX, y: putY } = put
    const direction = checkedY > putY ? '退' : '进'
    return `${name}${direction}${putX + 1}`
  },
  [FORWARD] (check, put, name) {
    let { y: checkedY } = check
    let { y: putY } = put
    const len = putY - checkedY
    return `${name}进${len}`
  },
  [BACKWARd] (check, put, name) {
    let { y: checkedY } = check
    let { y: putY } = put
    const len = checkedY - putY
    return `${name}退${len}`
  },
  [HORIZONTAL] (check, put, name) {
    const { x: putX } = put
    return `${name}平${putX + 1}`
  }
}

// 生成记谱文字
export const generateChessRecordText = (check, put, name) => {
  const key = generateStratKey(check, put)
  return strategies[key](check, put, name)
}