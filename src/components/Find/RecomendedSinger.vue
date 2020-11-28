<template>
  <section class="container singer">
    <p class="title"><span class="bar"></span>
      推荐歌手</p>
    <ul class="singerList">
      <li v-for="item in singerList" :key="item.id">
        <img :src="item.img1v1Url" alt="" @click="openSingerDetails(item)">
        <h2>{{ item.name }}</h2>
        <p>单曲数:{{ item.musicSize }}</p>
      </li>
    </ul>
  </section>
</template>

<script>
import '@/assets/css/common/singerList.less'
import { getRecommendedSingers } from '@/API/server/api'

export default {
  name: 'RecomendedSinger',
  data () {
    return {
      singerList: []
    }
  },
  created () {
    this.getRecomendedSinger()
  },
  methods: {
    async getRecomendedSinger () {
      const { data: singer } = await getRecommendedSingers()
      this.singerList = singer.artists
    },
    openSingerDetails (item) {
      console.log(item)
      this.$router.push({
        path: '/singerDetails',
        query: { id: item.id }
      })
    }
  }
}
</script>

<style scoped>

</style>
