/*
  画布通用计算方法
*/

// 获得距离的平方
export const getDistancePow = (a, b) => {
  const { x: x1, y: y1 } = a
  const { x: x2, y: y2} = b
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
}

// 获取离某点最近的一个点
export const getMinDistancePoint = (point, arr) => {
  let maxPoint = null, minDis = Number.MAX_SAFE_INTEGER
  arr.forEach(item => {
    const dis = getDistancePow(item, point)
    if (dis < minDis) {
      minDis = dis
      maxPoint = item
    }
  })
  return maxPoint    
}

// 判断两个点是否在同一水平/垂直方向
export const inSameRowOrCol = (a, b) => {
  const x1 = a.x, y1 = a.y
  const x2 = b.x, y2 = b.y
  
  if (y1 - y2 === 0 || x1 - x2 === 0) {
    return true
  }
  return false
}