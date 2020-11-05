import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
// 导入全局样式
import './assets/css/global.css'
import './assets/icon/iconfont.css'

Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:3000/'
Vue.prototype.axios = axios

Vue.prototype.str = (num) => {
  if (num.length === 5) {
    return num.slice(0, 1) + '万'
  } else if (num.length === 6) {
    return num.slice(0, 2) + '万'
  } else if (num.length === 7) {
    return num.slice(0, 3) + '万'
  } else if (num.length === 8) {
    return num.slice(0, 4) + '万'
  } else if (num.length === 9) {
    return num.slice(0, 1) + '亿'
  } else if (num.length === 10) {
    return num.slice(0, 2) + '亿'
  } else if (num.length === 11) {
    return num.slice(0, 3) + '亿'
  } else if (num.length === 12) {
    return num.slice(0, 4) + '亿'
  } else if (num.length <= 4) {
    return num.slice(0, 4)
  }
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
