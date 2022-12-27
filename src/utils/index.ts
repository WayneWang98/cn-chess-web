import * as canvasCalculator from './canvasCalculator'
import * as chessUtils from './chess'

// 获取canvas的像素比（devicePixelRatio / webkitBackingStorePixelRatio）
export const getCanvasPixelRatio = (ctx: CanvasRenderingContext2D) => {
  // 兼容各浏览器，但是API已经作废
  // let backingStore = ctx.backingStorePixelRatio ||
  //   ctx.webkitBackingStorePixelRatio ||
  //   ctx.mozBackingStorePixelRatio ||
  //   ctx.msBackingStorePixelRatio ||
  //   ctx.oBackingStorePixelRatio ||
  //   ctx.backingStorePixelRatio || 1;
    // return (window.devicePixelRatio || 1) / backingStore
    return window.devicePixelRatio
}

export const getStyle = (el: Element) => {
  return window.getComputedStyle(el, null)
}

// 通过JSON中的方法实现一些简单的深拷贝
export const deepCloneByJSON = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

export {
  canvasCalculator,
  chessUtils
}