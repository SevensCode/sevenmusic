<template>
  <div class="container" v-if="!$store.state.loading">
    <!-- 云音乐特色榜 -->
    <section class="playlist">
      <p class="title"><span></span>云音乐特色榜</p>
      <ul class="list">
        <li v-for="item in featuredList" @click="openSonglist(item)" :key="item.id">
          <img :src="item.coverImgUrl" alt="">
          <span><i class="el-icon-caret-right"></i> {{ item.playCount }}</span>
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </section>
    <!-- 全球媒体榜 -->
    <section class="playlist">
      <p class="title"><span></span>全球媒体榜</p>
      <ul class="list">
        <li v-for="item in globalMediaList" @click="openSonglist(item)" :key="item.id">
          <img :src="item.coverImgUrl" alt="">
          <span><i class="el-icon-caret-right"></i> {{ item.playCount }}</span>
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </section>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import '@/assets/css/common/playlist.less'
import Loading from '@/components/common/Loading/Loading'
import tool from '@/utils/tool'
import { getAllLists } from '@/API/server/api'

export default {
  name: 'Leaderboard',
  components: { Loading },
  data () {
    return {
      // 云音乐特色榜
      featuredList: [],
      // 全球媒体榜
      globalMediaList: []
    }
  },
  created () {
    this.getLeaderboard()
  },
  methods: {
    async getLeaderboard () {
      const { data: res } = await getAllLists()
      res.list.forEach(item => {
        item.playCount = item.playCount.toString().split('')
        item.playCount = tool.formatPlayCount(item.playCount.join(''))
      })
      // 云音乐特色榜
      const featuredList = res.list.slice(0, 4)
      // 全球媒体榜
      const globalMediaList = res.list.slice(4)
      this.featuredList = featuredList
      this.globalMediaList = globalMediaList
    },
    openSonglist (item) {
      this.$router.push({
        path: '/songDetails',
        query: { id: item.id }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
