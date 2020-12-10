<template>
  <div v-cloak>
    <!-- 头部 -->
    <Header></Header>
    <!-- 主内容 -->
    <main>
      <router-view></router-view>
    </main>
    <!-- 底部 -->
    <footer v-if="!$store.state.loading" class="footer">
      <div>
        <p><span>SevenMusic</span></p>
        <p class="content">sevenmusic</p>
        <i>1</i>
        <i>2</i>
      </div>
    </footer>
    <!--返回顶部 -->
    <el-backtop :bottom="100" :right="25">
      <i class="iconfont icon-yinle" style="color: #FA2800"></i>
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

<style lang="less" scoped>

.footer {
  width: 100%;
  height: 250px;
  background: #161e27;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 90%;
    height: 150px;

    .content {
      color: #6d7685;
      margin: 20px 0;
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
</style>
