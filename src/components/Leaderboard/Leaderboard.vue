<template>
  <div>
    <!-- 云音乐特色榜 -->
    <section class="songList container">
      <p class="title"><span></span>云音乐特色榜</p>
      <ul>
        <li v-for="item in featuredList" :key="item.id">
          <img :src="item.coverImgUrl" alt="">
          <span><i class="el-icon-caret-right"></i> {{ item.playCount }}</span>
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </section>
    <!-- 全球媒体榜 -->
    <section class="songList container">
      <p class="title"><span></span>全球媒体榜</p>
      <ul>
        <li v-for="item in globalMediaList" :key="item.id">
          <img :src="item.coverImgUrl" alt="">
          <span><i class="el-icon-caret-right"></i> {{ item.playCount }}</span>
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import '@/assets/css/Cart.less'
export default {
  name: 'Leaderboard',
  data () {
    return {
      // 云音乐特色榜
      featuredList: [],
      globalMediaList: []
    }
  },
  created () {
    this.getLeaderboard()
  },
  methods: {
    async getLeaderboard () {
      const { data: res } = await this.axios.get('/toplist/detail')
      res.list.forEach(item => {
        item.playCount = item.playCount.toString().split('')
        item.playCount = this.str(item.playCount.join(''))
      })
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

</style>
