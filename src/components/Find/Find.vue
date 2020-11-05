<template>
    <div v-cloak>
      <!-- 轮播图区域 -->
      <section class="container banner">
        <ul class="bannerList" v-cloak>
          <li v-for="(item,i) in banners" :key="i">
            <img :src="item.imageUrl" alt="">
          </li>
        </ul>
        <section class="bannerBtn">
        <span :class="activeIndex===item?'activeBannerBtn':''" :key="item" v-for="item in bannerBtn"
              @click="carouselSwitch(item,$event)"></span>
        </section>
      </section>
      <!-- 推荐歌单 -->
      <section class="recommendedPlaylist container">
        <p>推荐歌单</p>
        <ul>
          <li v-for="item in recommendedPlaylist" :key="item.id">
            <img :src="item.picUrl" alt="">
            <span><i class="el-icon-caret-right"></i>{{ item.playCount }}</span>
            <h1>{{ item.name }}</h1>
          </li>
        </ul>
      </section>
      <!-- 推荐新歌曲 -->
      <section class="container newSong">
        <p class="title">推荐新歌曲</p>
        <ul class="newSongList">
          <li v-for="(item,i) in newSongList" :key="item.id">
            <span class="index" v-if="i>8">{{ i + 1 }}</span>
            <span class="index" v-else>0{{ i + 1 }}</span>
            <i class="el-icon-video-play"></i>
            <div class="songContent">
              <img :src="item.picUrl" alt="">
              <div>
                <h1>{{ item.name }}</h1>
                <p>{{ item.song.artists[0].name }}</p>
              </div>
            </div>
            <span class="album">《{{ item.song.album.name }}》</span>
            <span>{{ item.song.bMusic.playTime }}</span>
          </li>
        </ul>
      </section>
      <!-- 推荐歌手 -->
      <section class="container singer">
        <p>推荐歌手</p>
        <ul class="singerList">
          <li v-for="item in singerList" :key="item.id">
            <img :src="item.img1v1Url" alt="">
            <h2>{{ item.name }}</h2>
            <p>单曲数:{{ item.musicSize }}</p>
          </li>
        </ul>
      </section>
    </div>
</template>

<script>
import '@/assets/css/Cart.less'
import '@/assets/css/singerList.less'
export default {
  name: 'Find',
  data () {
    return {
      defaultActive: '1', // 默认激活的导航项
      banners: [], // 轮播图列表
      bannerBtn: 4,
      activeIndex: 1,
      // 推荐歌单列表
      recommendedPlaylist: [],
      // 推荐新歌列表
      newSongList: [],
      // 歌手列表
      singerList: []
    }
  },
  created () {
    this.getDiscovery()
    // this.autoPlay()
  },
  methods: {
    // 获取首页发现信息
    async getDiscovery () {
      // 轮播图
      const { data: banner } = await this.axios.get('/banner')
      if (banner.code !== 200) return this.$message.error('轮播图获取失败')
      this.banners = banner.banners
      // 推荐歌单
      const { data: playlist } = await this.axios.get('/personalized', { params: { limit: 24 } })
      if (playlist.code !== 200) return this.$message.error('推荐歌单获取失败')
      playlist.result.forEach(item => {
        item.playCount = item.playCount.toString().split('')
        item.playCount = this.str(item.playCount.join(''))
      })
      this.recommendedPlaylist = playlist.result
      // 推荐新歌
      const { data: newSong } = await this.axios.get('/personalized/newsong', { params: { limit: 20 } })
      if (newSong.code !== 200) return this.$message.error('推荐新歌获取失败')
      newSong.result.forEach(item => {
        const mm = this.doubleDate(new Date(item.song.bMusic.playTime).getMinutes())
        const ss = this.doubleDate(new Date(item.song.bMusic.playTime).getSeconds())
        item.song.bMusic.playTime = mm + ':' + ss
      })
      this.newSongList = newSong.result
      // 歌手
      const { data: singer } = await this.axios.get('/artist/list')
      if (singer.code !== 200) return this.$message.error('推荐歌手获取失败')
      this.singerList = singer.artists
    }, // 轮播图按钮
    carouselSwitch (index) {
      this.activeIndex = index
      this.banner(index)
    },
    banner (index) {
      this.activeIndex = index
      const bannerList = document.querySelector('.bannerList')
      switch (this.activeIndex) {
        case 1:
          bannerList.style.transform = 'translateX(0)'
          break
        case 2:
          bannerList.style.transform = 'translateX(-99%)'
          break
        case 3:
          bannerList.style.transform = 'translateX(-198%)'
          break
        case 4:
          bannerList.style.transform = 'translateX(-231%)'
          break
      }
    },
    // // 轮播图自动播放
    // autoPlay () {
    //   setInterval(() => {
    //     this.activeIndex++
    //     this.banner(this.activeIndex)
    //     if (this.activeIndex > 4) {
    //       this.activeIndex = 1
    //       this.banner(this.activeIndex)
    //     }
    //   }, 10000)
    // },
    doubleDate (n) {
      if (n < 10) {
        return '0' + n
      } else {
        return n
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-carousel {
  width: 430px;
}

.banner {
  overflow: hidden;

  .bannerList {
    margin-top: 20px;
    display: grid;
    padding: 0 20px;
    grid-template-columns: repeat(10, 31%);
    grid-column-gap: 3%;
    transition: .5s;

    li {
      width: 430px;
      height: 160px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    span {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin: 0 5px;
      background: #a3a3ac;
      cursor: pointer;
      border-radius: 5px;
    }

    .activeBannerBtn {
      width: 15px;
      height: 6px;
      background: #FA2800;
    }
  }
}

.recommendedPlaylist {
  padding: 0 20px;

  p {
    font-size: 16px;
    font-weight: 1000;
    margin-bottom: 20px;
  }

  ul {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, 133px);
    grid-column-gap: 40px;
    //grid-row-gap: 80px;
    justify-content: center;
    align-items: center;
    position: relative;
    user-select: none;

    li {
      width: 133px;
      height: 133px;
      margin-bottom: 80px;
      border-radius: 5px;
      position: relative;
      cursor: pointer;
      box-shadow: 0 0 5px black;

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }

      h1 {
        height: 36px;
        position: absolute;
        bottom: -46px;
        width: 142px;
        font-size: 13px;
        display: -webkit-box; /*将对象转为弹性盒模型展示*/
        -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
        -webkit-line-clamp: 2; /*限制文本行数*/
        overflow: hidden; /*超出隐藏*/
        color: #4a4a4a;
      }

      span {
        display: block;
        background: black;
        position: absolute;
        padding: 2px 5px;
        right: 5px;
        top: 5px;
        color: white;
        font-size: 12px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 10;
      }
    }
  }
}

.newSong {
  padding: 0 20px;

  .title {
    font-size: 16px;
    font-weight: 1000;
    margin-bottom: 20px;
  }

  .newSongList {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 660px);
    grid-column-gap: 30px;
    justify-content: center;
    align-items: center;

    li:hover i {
      display: block;
      cursor: pointer;
    }

    li:hover .index {
      display: none;
    }

    li {
      width: 100%;
      height: 80px;
      background: white;
      margin-bottom: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px #DDDDDD;
      padding: 0 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .index {
        width: 30px;
      }

      i {
        width: 30px;
        color: #FA2800;
        display: none;
      }

      span {
        font-weight: 600;
        color: black;
        font-size: 14px;
      }

      .songContent {
        img {
          width: 55px;
          height: 55px;
          display: inline-block;
          float: left;
          margin-right: 20px;
        }

        div {
          float: left;
          width: 91px;
          font-size: 14px;

          p {
            line-height: 27.5px;
            text-align: center;
            color: #4a4a4a;
            display: -webkit-box; /*将对象转为弹性盒模型展示*/
            -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
            -webkit-line-clamp: 1; /*限制文本行数*/
            overflow: hidden; /*超出隐藏*/
          }

          h1 {
            color: #333;
            line-height: 27.5px;
            text-align: center;
            font-size: 14px;
            display: -webkit-box; /*将对象转为弹性盒模型展示*/
            -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
            -webkit-line-clamp: 1; /*限制文本行数*/
            overflow: hidden; /*超出隐藏*/
          }
        }
      }

      .album {
        width: 250px;
        text-align: center;
      }
    }
  }
}

.singer {
  padding: 0 20px;
}
</style>
