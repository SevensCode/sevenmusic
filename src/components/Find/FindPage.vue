<template>
  <div v-if="isShow" class="container box">
    <div class="banner">
      <swiper :options="swiperOption">
        <swiper-slide v-for="item in banners" :key="item.imageUrl" class="bannerImg">
          <img :onerror="defaultImg" :src="item.imageUrl" alt="">
        </swiper-slide>
      </swiper>
      <div slot="pagination" class="swiper-pagination"></div>
    </div>
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
  <Loading v-else></Loading>
</template>

<script>
import { getBanner, getRecommendedNewMusic, getRecommendedPlaylist, getRecommendedSingers } from '@/API/server/api'
import SongList from '@/components/common/SongList'
import RecommendNewSong from '@/components/common/NewSong'
import Singer from '@/components/common/Singer'
import Loading from '@/components/common/Loading'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'Find',
  components: {
    Loading,
    Singer,
    RecommendNewSong,
    SongList,
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      // 推荐歌单
      recommendedPlaylist: [],
      // 推荐新歌
      recommendedNewSongs: [],
      // 推荐歌手
      recommendedSingers: [],
      isShow: false,
      banners: [], // 轮播图列表
      swiperOption: {
        // 每张幻灯片
        slidesPerView: 3,
        // 速度
        spaceBetween: 30,
        // 每组三个
        slidesPerGroup: 3,
        // 循环
        loop: true,
        // 分页可点击
        paginationClickable: true,
        // 是否可以鼠标拖动
        grabCursor: true,
        // 分页器
        pagination: {
          el: '.swiper-pagination',
          // 是否点击跳转
          clickable: true
        },
        // 自动切换
        autoplay: true,
        // 默认选择
        initialSlide: 3
      }
    }
  },
  async mounted () {
    await this.getBannerList()
    await this.getRecommendedPlaylist()
    await this.getRecommendedNewSongs()
    await this.getRecommendedSingers()
    this.isShow = true
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
    },
    async getBannerList () {
      const { data: banner } = await getBanner()
      this.banners = banner.banners
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/defaultImg.png') + '"'
    }
  }
}
</script>

<style lang="less">
.box{
  padding: 0 5px;
}
.title {
  font-size: 16px;
  font-weight: 1000;
  color: #4a4a4a;
  margin-top: 20px;
}

.banner {
  .bannerImg {
    width: 430px;
    height: 160px;
    border-radius: 5px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }

  .swiper-pagination {
    width: 100%;
    position: relative;

    .swiper-pagination-bullet {
      width: 6px;
      height: 6px;
      background: #a3a3ac;
      opacity: 0.8;
      border-radius: 50%;
      margin: 0 5px;
      cursor: pointer;
    }

    .swiper-pagination-bullet-active {
      opacity: 1;
      width: 15px;
      border-radius: 4px;
      background: #FA2800;
    }
  }
}
</style>
