<template>
  <div v-cloak>
    <!-- 头部 -->
    <Header></Header>
    <!-- 主内容 -->
    <main>
      <router-view></router-view>
    </main>
    <!-- 底部 -->
    <footer class="footer">
      <div class="titel">
        <span class="bar"></span>
        <span>SevensMusic （ 仿网易云音乐 ）</span>
      </div>
      <section class="warehouseAddress">
        <a target="_blank" href="https://music.163.com/"><i class="iconfont icon-wangyiyunyinle"></i></a>
        <a target="_blank" href="https://github.com/SevensCode/sevenmusic"><i class="iconfont icon-github"></i></a>
        <a target="_blank" href="https://gitee.com/SevensCode/seven-music"><i class="iconfont icon-mayun"></i></a>
      </section>
    </footer>
    <!--返回顶部 -->
    <el-backtop :bottom="100" :right="25">
      <img class="logo" src="../assets/img/logo.png" alt="">
    </el-backtop>
    <transition name="playMusicShow">
      <music-play v-if="$store.state.playMusicShow"></music-play>
    </transition>
  </div>
</template>

<script>
import Header from '@/components/common/Header'
import MusicPlay from '@/components/common/MusicPlay'

export default {
  name: 'Home',
  components: {
    Header,
    MusicPlay
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {}
}
</script>

<style lang="less">
.footer {
  width: 100%;
  height: 250px;
  padding: 50px;
  background: #161e27;
  color: white;
  .title {
    width: 90%;
    height: 150px;
  }
  .warehouseAddress {
    display: flex;
    width: 150px;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    a {
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100%;
      background: #232a31;
      i {
        color: #6d7685;
        transition: 1s;
      }
    }
    a:hover i {
      color: white;
    }
  }
}
.el-avatar {
  margin-right: 15px;
}
.playMusicShow-enter-active, .playMusicShow-leave-active {
  transition: all 1.5s;
}
.playMusicShow-enter, .playMusicShow-leave-to {
  opacity: .5;
  transform: translateY(100px);
}
.logo {
  background: rgba(0, 0, 0, 0);
}
</style>
