/**
 * 这是发布入口文件
 * */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
// 导入全局样式
import './assets/css/global.css'
import './assets/icon/iconfont.css'
import store from './store'
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper'
import tool from '@/utils/tool'

// 导入图片懒加载
Vue.use(VueLazyload)
Vue.prototype.tool = tool
Swiper.use([Navigation, Pagination, Autoplay])
Vue.config.productionTip = false
// 过滤播放次数
Vue.filter('playCount', (value) => {
  return tool.formatPlayCount(JSON.stringify(value))
})
// 过滤播放时间
Vue.filter('playTime', (value) => {
  // const mm = tool.formatZero(new Date(value).getMinutes())
  // const ss = tool.formatZero(new Date(value).getSeconds())
  return tool.formatZero(new Date(value).getMinutes()) + ':' + tool.formatZero(new Date(value).getSeconds())
})
// 格式年月日
Vue.filter('formatYearMonthDay', (value) => {
  return tool.formatYearMonthDay(value)
})
Vue.filter('formatZero', (value) => {
  return tool.formatZero(value)
})
Vue.filter('howLongHasItBeenSinceLastTime', (value) => {
  return tool.getDistanceSpecifiedTime(value)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
