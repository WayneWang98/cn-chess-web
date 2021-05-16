
const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

// 工具函数：生成路径
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = override(
  addWebpackAlias({
    ['@']: resolve('src')
  })
)