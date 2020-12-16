// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
// 判断是否子啊发布阶段
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    '@babel/plugin-syntax-dynamic-import',
    // ... 将数组中的每一项展开了, 发布产品时候的插件数组
    ...prodPlugins
  ]
}
