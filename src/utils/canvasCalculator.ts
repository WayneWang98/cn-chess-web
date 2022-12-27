/*
  画布通用计算方法
*/

import { CanvasPoint } from 'src/types/types'

// 获得距离的平方
export const getDistancePow = (a: CanvasPoint, b: CanvasPoint) => {
  const { x: x1, y: y1 } = a
  const { x: x2, y: y2} = b
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
}

// 获取离某点最近的一个点
export const getMinDistancePoint = (point: CanvasPoint, auxiliaryPoints: CanvasPoint[]) => {
  let maxPoint: CanvasPoint | undefined;
  let minDis = Number.MAX_SAFE_INTEGER
  auxiliaryPoints.forEach(item => {
    const dis = getDistancePow(item, point)
    if (dis < minDis) {
      minDis = dis
      maxPoint = item
    }
  })
  return maxPoint
}