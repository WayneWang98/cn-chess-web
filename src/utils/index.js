import * as canvasCalculator from './canvasCalculator'
import * as chessUtils from './chess'

// 获取canvas的像素比（devicePixelRatio / webkitBackingStorePixelRatio）
export const getCanvasPixelRatio = (ctx) => {
  let backingStore = ctx.backingStorePixelRatio || // 兼容各浏览器
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore
}

export const getStyle = (dom) => {
  return window.getComputedStyle(dom, null)
}

// 通过JSON中的方法实现一些简单的深拷贝
export const deepCloneByJSON = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export {
  canvasCalculator,
  chessUtils
}