<template>
  <div class="banner">
    <swiper :options="swiperOption" class="container">
      <swiper-slide v-for="item in banners" :key="item.imageUrl" class="bannerImg">
        <img :onerror="defaultImg" :src="item.imageUrl" alt="">
      </swiper-slide>
    </swiper>
    <div slot="pagination" class="swiper-pagination"></div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { getBanner } from '@/API/server/api'

export default {
  name: 'Banner',
  components: {
    Swiper,
    SwiperSlide
  },
  data () {
    return {
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
  created () {
    this.getBannerList()
  },
  methods: {
    async getBannerList () {
      const { data: banner } = await getBanner()
      this.banners = banner.banners
      this.$store.commit('hideLoading')
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
