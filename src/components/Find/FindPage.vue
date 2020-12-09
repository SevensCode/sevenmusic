<template>
  <div class="container">
    <Banner></Banner>
    <section class="title">
      <span class="bar"></span>
      <span>推荐歌单</span>
    </section>
    <SongList :column="8" :songlist="recommendedPlaylist"></SongList>
    <section class="title">
      <span class="bar"></span>
      <span>推荐新歌</span>
    </section>
    <RecommendNewSong :column="2" :new-song="recommendedNewSongs"></RecommendNewSong>
    <section class="title">
      <span class="bar"></span>
      <span>推荐歌手</span>
    </section>
    <Singer :column="10" :singer-list="recommendedSingers"></Singer>
  </div>
</template>

<script>
import Banner from '@/components/Find/Banner'
import { getRecommendedNewMusic, getRecommendedPlaylist, getRecommendedSingers } from '@/API/server/api'
import SongList from '@/components/common/SongList'
import RecommendNewSong from '@/components/common/NewSong'
import Singer from '@/components/common/Singer'

export default {
  name: 'Find',
  components: {
    Singer,
    RecommendNewSong,
    Banner,
    SongList
  },
  data () {
    return {
      // 推荐歌单
      recommendedPlaylist: [],
      // 推荐新歌
      recommendedNewSongs: [],
      // 推荐歌手
      recommendedSingers: []
    }
  },
  mounted () {
    this.getRecommendedPlaylist()
    this.getRecommendedNewSongs()
    this.getRecommendedSingers()
  },
  methods: {
    // 获取推荐歌单
    async getRecommendedPlaylist () {
      const { data: playlist } = await getRecommendedPlaylist(24)
      this.recommendedPlaylist = playlist.result
    },
    // 获取推荐新歌
    async getRecommendedNewSongs () {
      const { data: newSongs } = await getRecommendedNewMusic(20)
      this.recommendedNewSongs = newSongs.result
    },
    // 获取推荐歌手
    async getRecommendedSingers () {
      const { data: singers } = await getRecommendedSingers()
      console.log(singers)
      this.recommendedSingers = singers.artists
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 16px;
  font-weight: 1000;
  color: #4a4a4a;
  margin-top: 20px;
}
</style>
