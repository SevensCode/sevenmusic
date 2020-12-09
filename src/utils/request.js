import axios from 'axios'
import store from '@/store/index'
// 配置请求的根路径

let num = 0
axios.defaults.baseURL = 'http://127.0.0.1:3000/'
axios.interceptors.request.use(config => {
  num++
  store.commit('showLoading')
  return config
})
axios.interceptors.response.use(config => {
  num--
  if (num <= 0) {
    store.commit('hideLoading')
  } else {
    store.commit('showLoading')
  }
  return config
})

export default axios
