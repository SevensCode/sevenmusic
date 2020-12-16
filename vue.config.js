module.exports = {
  chainWebpack: config => {
    // 发布
    config.when(process.env.NODE_ENV === 'production', config => {
      // 通过 config.entry('app') 来霍去病默认打包入口,然后在通过 clear() 清空默认打包入口,再通过 add() 来添加打包入口
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        vuex: 'Vuex',
        // 'vue-router': 'VueRouter',
        axios: 'axios',
        Swiper: 'Swiper',
        VueLazyload: 'vue-lazyload'
      })
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true
        })
        .end()
    })
    // 开发
    config.when(process.env.NODE_ENV === 'development', config => {
      // 通过 config.entry('app') 来霍去病默认打包入口,然后在通过 clear() 清空默认打包入口,再通过 add() 来添加打包入口
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
