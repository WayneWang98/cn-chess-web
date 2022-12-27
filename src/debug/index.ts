// js 调试文件

// 将一维棋盘数组以16 * 16的形式打印
export const print16 = (arr: number[]) => {
  let i = 0
  while (i < 16) {
    console.log(arr.slice(16 * i, 16 * i + 16))
    i ++
  }
}