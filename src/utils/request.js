import axios from 'axios'
import store from '@/store/index'
// 配置请求的根路径

axios.defaults.baseURL = 'http://121.4.76.27:3000/'
axios.interceptors.request.use(config => {
  store.commit('showLoading')
  return config
})

axios.interceptors.response.use(config => {
  store.commit('hideLoading')
  return config
})

export default axios
