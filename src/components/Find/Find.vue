<template>
  <div>
    <Banner></Banner>
    <recommended-playlist></recommended-playlist>
    <recomended-newsong></recomended-newsong>
    <recomended-singer></recomended-singer>
  </div>
</template>

<script>
import Banner from '@/components/Find/Banner'
import RecommendedPlaylist from '@/components/Find/RecommendedPlaylist'
import RecomendedNewsong from '@/components/Find/RecomendedNewsong'
import RecomendedSinger from '@/components/Find/RecomendedSinger'
export default {
  name: 'Find',
  components: {
    Banner,
    RecommendedPlaylist,
    RecomendedNewsong,
    RecomendedSinger
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style  scoped>
</style>
