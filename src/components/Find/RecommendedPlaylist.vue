<template>
  <section class="playlist container">
    <p class="title"><span class="bar"></span>推荐歌单</p>
    <ul class="list">
      <li v-for="item in recommendedPlaylist" @click="openSonglist(item)" :key="item.id">
        <img :src="item.picUrl" alt="">
        <span><i class="el-icon-caret-right"></i>{{ item.playCount }}</span>
        <h1>{{ item.name }}</h1>
      </li>
    </ul>
  </section>
</template>

<script>
import { getRecommendedPlaylist } from '@/API/server/api'
import '@/assets/css/common/playlist.less'

export default {
  data () {
    return {
      recommendedPlaylist: []
    }
  },
  created () {
    this.getRecommendedPlaylist()
  },
  methods: {
    async getRecommendedPlaylist () {
      const { data: playlist } = await getRecommendedPlaylist(24)
      playlist.result.forEach(item => {
        item.playCount = item.playCount.toString().split('')
        item.playCount = this.tool.formatPlayCount(item.playCount.join(''))
      })
      this.recommendedPlaylist = playlist.result
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

<style scoped>

</style>
