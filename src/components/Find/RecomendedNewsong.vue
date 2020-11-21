<template>
  <section class="container newSong">
    <p class="title"><span class="bar"></span>推荐新歌曲</p>
    <ul class="newSongList">
      <li v-for="(item,i) in newSongList" :key="item.id">
        <div :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'hide':'index'">
          <span v-if="i>8">{{ i + 1 }}</span>
          <span v-else>0{{ i + 1 }}</span>
        </div>
        <div :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'show':'playAndPause'">
          <i v-if="$store.state.musicInfo.id===item.id&&$store.state.playing" class="el-icon-video-pause pause"
             @click="pauseMusic()"></i>
          <i v-else class="el-icon-video-play play" @click="playMusic(item)"></i>
        </div>
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
</template>

<script>
import { getRecommendedNewMusic } from '@/API/server/api'
import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'

export default {
  name: 'RecomendedNewsong',
  data () {
    return {
      newSongList: []
    }
  },
  created () {
    this.getRecomendedNewsong()
  },
  methods: {
    async getRecomendedNewsong () {
      // 获取推荐新歌
      const { data: newSong } = await getRecommendedNewMusic(20)
      newSong.result.forEach(item => {
        const mm = this.tool.formatZero(new Date(item.song.bMusic.playTime).getMinutes())
        const ss = this.tool.formatZero(new Date(item.song.bMusic.playTime).getSeconds())
        item.song.bMusic.playTime = mm + ':' + ss
      })
      this.newSongList = newSong.result
    }, // 播放
    async playMusic (item) {
      // 获取歌单列表
      this.$store.commit('getPlaylist', this.newSongList)
      // 获取歌曲信息
      await getMusicInfo(item.id)
      await lyrics()
      // 改变状态 播放中
      this.$store.commit('playing')
      // 播放
      await playMusic()
    }, // 暂停
    pauseMusic () {
      // 改变播放状态
      this.$store.commit('pause')
      // 暂停
      pauseMusic()
    }
  }
}
</script>

<style lang="less" scoped>
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

    li:hover .index {
      display: none;
    }

    li:hover .playAndPause {
      display: block;
    }

    .hide {
      display: none;
    }

    .show {
      display: block;
      color: #FA2800;
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 30px;
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
        span {
          display: block;
          height: 30px;
          line-height: 30px;
          text-align: center;
          width: 30px;
        }
      }

      .playAndPause {
        display: none;

        i {
          color: #FA2800;
          display: block;
          height: 30px;
          line-height: 30px;
          text-align: center;
          width: 30px;
        }
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

</style>
