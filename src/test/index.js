// js 测试文件

export const print16 = (arr) => {
  let i = 0
  while (i < 16) {
    console.log(arr.slice(16 * i, 16 * i + 16))
    i ++
  }
}