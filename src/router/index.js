import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName:"user" */ '@/components/User/Login')
const Home = () => import(/* webpackChunkName:"home" */ '@/components/Home')
const Find = () => import(/* webpackChunkName:"find" */ '@/components/Find/FindPage')
const Leaderboard = () => import(/* webpackChunkName:"leaderboard" */ '@/components/Leaderboard/LeaderboardPage')
const SongList = () => import(/* webpackChunkName:"songlist" */ '@/components/SongList/AllSongListPage')
const Singer = () => import(/* webpackChunkName:"singer" */ '@/components/Singer/SingerPage')
const Mv = () => import(/* webpackChunkName:"mv" */ '@/components/MV/MvPage')
const User = () => import(/* webpackChunkName:"user" */ '@/components/User/LoginUserDetails')
const Search = () => import(/* webpackChunkName:"search" */ '@/components/Serach/SearchPage')
const SongDetails = () => import(/* webpackChunkName:"details" */ '@/components/SongDetails/SongDetailsPage')
const VideoDetails = () => import(/* webpackChunkName:"details" */ '@/components/Video/MvDeatils')
const SingerDetails = () => import(/* webpackChunkName:"details" */ '@/components/SingerDetails/SingerDetailsPage')
const AccessUserDetails = () => import(/* webpackChunkName:"user" */ '@/components/User/AccessUserDetails')
const Video = () => import(/* webpackChunkName:"video" */ '@/components/VideoPage/VideoList')
const Register = () => import(/* webpackChunkName:"user" */ '@/components/User/Register')
Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/find'
  }, {
    path: '/home/',
    name: 'home',
    redirect: '/find'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/register',
    component: Register
  }, {
    path: '/home',
    component: Home,
    children: [
      // 发现页
      {
        path: '/find',
        component: Find
      },
      // 排行榜页
      {
        path: '/leaderboard',
        component: Leaderboard
      },
      // 歌单页
      {
        path: '/songlist',
        component: SongList
      },
      // 歌手页
      {
        path: '/singer',
        component: Singer
      },
      // Mv页
      {
        path: '/mv',
        component: Mv
      },
      // 登录的用户页
      {
        path: '/loginUserDetails',
        component: User
      },
      // 搜索页
      {
        path: '/search',
        component: Search
      },
      // 歌单详情
      {
        path: '/songDetails',
        component: SongDetails
      },
      // 视频详情
      {
        path: '/videoDetails',
        component: VideoDetails
      },
      // 歌手详情
      {
        path: '/singerDetails',
        component: SingerDetails
      },
      // 访问的用户详情页
      {
        path: '/accessUserDetails',
        component: AccessUserDetails
      },
      // 视频页面
      {
        path: '/video',
        component: Video
      }
    ]
  }]
})
const vm = new Vue()
// // 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 代表将要访问路径
  // from 代表从那个路径跳转而来
  // next 是一个函数，表示放行
  if (to.path === '/video') {
    vm.$message.error('不可访问')
    return next('/find')
  }
  if (to.path === '/user' || to.path === '/video') {
    if (window.sessionStorage.getItem('userInfo') && window.sessionStorage.getItem('token') && window.sessionStorage.getItem('cookie')) {
      return next()
    } else {
      vm.$message.error('请登录')
      return next('/login')
    }
  }
  next()
})

export default router
