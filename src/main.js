import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
import './assets/icon/iconfont.css'
import store from './store'
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper'
import tool from '@/utils/tool'

Vue.prototype.tool = tool
Swiper.use([Navigation, Pagination, Autoplay])
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
