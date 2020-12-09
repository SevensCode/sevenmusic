<template>
  <div class="container" v-if="!$store.state.loading">
    <!-- 云音乐特色榜 -->
    <section class="title">
      <span class="bar"></span>
      <span>云音乐特色榜</span>
    </section>
    <SongList :songlist="featuredList" :column="8"></SongList>
    <!-- 全球媒体榜 -->
    <section class="title">
      <span class="bar"></span>
      <span>全球媒体榜</span>
    </section>
    <SongList :songlist="globalMediaList" :column="8"></SongList>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import Loading from '@/components/common/Loading'
import { getAllLists } from '@/API/server/api'
import SongList from '@/components/common/SongList'

export default {
  name: 'Leaderboard',
  components: { SongList, Loading },
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
      // 云音乐特色榜
      const featuredList = res.list.slice(0, 4)
      // 全球媒体榜
      const globalMediaList = res.list.slice(4)
      this.featuredList = featuredList
      this.globalMediaList = globalMediaList
    }
  }
}
</script>

<style lang="less" scoped>
.title{
  font-size: 16px;
  font-weight: 1000;
  color: #4a4a4a;
  margin-top: 20px;
}
</style>
