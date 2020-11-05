import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')
const Find = () => import('@/components/Find/Find')
const Leaderboard = () => import('@/components/Leaderboard/Leaderboard')
const SongList = () => import('@/components/SongList/SongList')
const Singer = () => import('@/components/Singer/Singer')
const Mv = () => import('@/components/MV/Mv')
const User = () => import('@/components/User/User')
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
    path: '/home/:user',
    name: 'home',
    redirect: '/find',
    props: true
  }, {
    path: '/login',
    component: Login,
    props: true
  }, {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/find',
        component: Find
      },
      {
        path: '/leaderboard',
        component: Leaderboard
      },
      {
        path: '/songlist',
        component: SongList
      },
      {
        path: '/singer',
        component: Singer
      },
      {
        path: '/mv',
        component: Mv
      },
      {
        path: '/user',
        component: User
      }
    ]
  }]
})

// // 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 代表将要访问路径
//   // from 代表从那个路径跳转而来
//   // next 是一个函数，表示放行
//   // next() 放行 next('/login') 强制跳转
//   // if (to.path === '/login') return next()
//   // const tokenStr = window.sessionStorage.getItem('token')
//   // if (!tokenStr) return next('/login')
//   // next()
//   if (to.path === '/user' && window.sessionStorage.getItem('token')) return next()
//   next('/login')
// })

export default router
