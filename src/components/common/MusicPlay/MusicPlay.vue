<template>
  <div class="musicPlayer">
    <img :src="$store.state.musicInfo.al.picUrl" alt="">
    <section class="songTitleAndAuthor">
      <h2>{{ $store.state.musicInfo.name }}</h2>
      <p>
        <span v-for="(item,i) in $store.state.musicInfo.ar" :key="i">
          <span v-if="$store.state.musicInfo.ar.length===1">{{ item.name }}</span>
          <span v-else-if="$store.state.musicInfo.ar.length>1">
            {{ item.name }}
            <span v-if="item.name===$store.state.musicInfo.ar[$store.state.musicInfo.ar.length - 1].name"></span>
            <span v-else>/</span>
          </span>
        </span>
      </p>
    </section>
    <section class="playMusic">
      <i class="iconfont icon-shangyishou previousSong" @click="previousSong"></i>
      <i v-if="!$store.state.playing" class="iconfont icon-bofang play" @click="playMusic"></i>
      <i v-if="$store.state.playing" class="iconfont icon-zanting pause" @click="pause"></i>
      <i class="iconfont icon-xiayishou nextSong" @click="nextSong"></i>
    </section>
    <section class="playbackProgress">
      <span>{{ $store.state.currendPlayTime }}</span>
      <el-slider v-model="$store.state.progressBar" :max="$store.state.musicDuration" :show-tooltip="false"
                 @change="changeProgress"></el-slider>
      <span>{{ $store.state.musicInfo.playT }}</span>
    </section>
    <section class="volume">
      <i v-if="!isMute" class="iconfont icon-laba" @click="muteSwitch"></i>
      <i v-else class="iconfont icon-jingyin" @click="muteSwitch"></i>
      <el-slider v-model="$store.state.musicVolume" :max="100" :min="0" :show-tooltip="false"
                 @input="editVolume"></el-slider>
    </section>
    <section class="other">
      <i v-if="order===0" class="iconfont icon-xunhuan" @click="changePlayOrder"></i>
      <i v-else-if="order===1" class="iconfont icon-xunhuan1" @click="changePlayOrder"></i>
      <i v-else-if="order===2" class="iconfont icon-suiji" @click="changePlayOrder"></i>
      <i class="iconfont icon-geci" @click="lyricsShowHide"></i>
      <i class="iconfont icon-yinleliebiao" @click="playListShowHide"></i>
    </section>
    <audio ref="audio" :src="$store.state.musicUrl" autoplay></audio>
    <transition name="lyrics">
      <el-card v-show="lyricsDisplay" class="box">
        <span class="bar"></span>
        <span class="title">歌词</span>
        <section class="div">
          <section ref="lyrics" class="lyrics" @mousedown="lyricsSliding"></section>
        </section>
      </el-card>
    </transition>
    <transition name="lyrics">
      <el-card v-show="playListDisplay" class="box">
        <span class="bar"></span>
        <span class="title">播放列表</span>
        <section class="outer">
          <ul ref="playlist" class="playlist">
            <li v-for="(item,i) in $store.state.playlist" :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'redli':'li'" :key="i">
              <p class="content">
                <section :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'hide':'index'">
                  <span v-if="i<9">0{{ i + 1 }}</span>
                  <span v-else>{{ i + 1 }}</span>
                </section>
                <section :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'show':'playAndPause'">
                  <i v-if="$store.state.musicInfo.id===item.id&&$store.state.playing"
                     class="el-icon-video-pause pause" @click="playlistPauseMusic()"></i>
                  <i v-else class="el-icon-video-play play" @click="playlistPlayMusic(item)"></i>
                </section>
                <span class="name" v-if="item.song">{{ item.song.name }}</span>
                <span class="name" v-else>{{ item.name }}</span>
              </p>
              <i class="el-icon-close"></i>
            </li>
          </ul>
        </section>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { getMusicInfo, lyrics, nextSong, pauseMusic, playMusic, previousSong } from '@/utils/playSong'

export default {
  name: 'MusicPlay',
  data () {
    return {
      isMute: false,
      order: 0,
      lyricsDisplay: false,
      playListDisplay: false
    }
  },
  mounted () {
    // 传递播放器DOM
    this.$store.commit('getAudioDom', this.$refs.audio)
    // 传递歌词容器dom
    this.$store.commit('getLyricsDom', this.$refs.lyrics)
    // 默认音量
    this.$refs.audio.volume = 0.1
    // 传递音量
    this.$store.commit('getMusicVolume', this.$refs.audio.volume * 100)
  },
  methods: {
    lyricsShowHide () {
      this.lyricsDisplay = !this.lyricsDisplay
      if (this.playListDisplay) {
        this.playListDisplay = false
      }
    },
    playListShowHide () {
      this.playListDisplay = !this.playListDisplay
      if (this.lyricsDisplay) {
        this.lyricsDisplay = false
      }
    },
    async playMusic () {
      this.$store.commit('playing')
      await playMusic()
    },
    pause () {
      this.$store.commit('pause')
      pauseMusic()
    }, // 进度条的值发生改变，调整音乐播放进度
    changeProgress (value) {
      this.$refs.audio.currentTime = value
    }, // 静音切换
    muteSwitch () {
      this.$refs.audio.muted = !this.$refs.audio.muted
      this.isMute = this.$refs.audio.muted
      if (this.$refs.audio.volume === 0) {
        this.$store.state.musicVolume = 30
      }
    }, // 修改音量
    editVolume (volume) {
      volume = volume / 100
      if (volume === 0) {
        this.$refs.audio.muted = true
        this.isMute = true
      }
      this.$refs.audio.volume = volume
    }, // 下一首
    nextSong () {
      nextSong()
    }, // 上一首
    previousSong () {
      previousSong()
    }, // 改变播放顺序
    changePlayOrder () {
      this.order++
      if (this.order > 2) {
        this.order = 0
      }
      this.$store.commit('changePlayOrder', this.order)
    }, // 歌词滑动
    lyricsSliding (e) {
      const lyrics = this.$refs.lyrics
      const offsetY = e.clientY - lyrics.offsetTop
      const box = document.querySelector('.box')
      box.onmousemove = (e) => {
        let t = e.clientY - offsetY
        if (t > 0) {
          t = 0
        }
        if (t < -lyrics.offsetHeight + 500) {
          t = -lyrics.offsetHeight + 500
        }
        lyrics.style.top = t + 'px'
      }
      lyrics.onmouseup = function () {
        box.onmousemove = null
      }
    },
    async playlistPlayMusic (item) {
      // // 获取歌单列表
      // this.$store.commit('getPlaylist', this.newSongList)
      // 获取歌曲信息
      await getMusicInfo(item.id)
      await lyrics()
      // 改变状态 播放中
      this.$store.commit('playing')
      // 播放
      await playMusic()
    },
    playlistPauseMusic () {
      // 改变播放状态
      this.$store.commit('pause')
      // 暂停
      pauseMusic()
    }
  },
  computed: {
    getIndex () {
      return this.$store.state.currentIndex
    }
  },
  watch: {
    getIndex: function (val) {
      if (val >= this.$store.state.lyricsTime.length - 5) {
        this.$refs.lyrics.style.top = -this.$store.state.currentLyricsTop + 'px'
        return true
      }
      if (val < 9) {
        this.$refs.lyrics.style.top = 0 + 'px'
      }
      if (val >= 9) {
        this.$store.commit('editCurrentLyricsTop', (this.$store.state.currentIndex - 9) * 30)
        this.$refs.lyrics.style.top = -this.$store.state.currentLyricsTop + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.musicPlayer {
  position: fixed;
  bottom: 0;
  height: 72px;
  padding: 0 20px;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 0 1px #a5a5c1;

  img {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    cursor: pointer;
  }

  section {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .songTitleAndAuthor {
    display: block;
    width: 120px;
    height: 50px;

    h2 {
      font-size: 14px;
      color: #333333;
      margin-bottom: 15px;
    }

    p {
      font-size: 12px;
      color: #999999;
    }
  }

  .playMusic {
    i {
      font-size: 30px;
      cursor: pointer;
      padding: 0;
      border-radius: 100%;
      margin: 0 10px;
    }

    .play {
      display: block;
      width: 45px;
      height: 45px;
      font-size: 45px;
      line-height: 45px;
      text-align: center;
    }

    .pause {
      display: block;
      width: 45px;
      height: 45px;
      font-size: 32px;
      line-height: 45px;
      text-align: center;
    }
  }

  .playbackProgress {
    margin-left: 40px;

    span {
      font-size: 14px;
      color: #4a4a4a;
    }

    .el-slider {
      width: 425px;
      margin: 0 30px;
    }
  }

  .volume {
    .el-slider {
      width: 144px;
      margin-right: 30px;
    }

    i {
      font-size: 18px;
      margin-right: 20px;
      cursor: pointer;
    }
  }

  .other {
    i {
      cursor: pointer;
      margin: 0 20px;
      font-size: 18px;
      color: #4a4a4a;
      font-weight: 700;
    }
  }

  .box {
    position: absolute;
    background: white;
    width: 400px;
    top: -580px;
    height: 580px;
    right: 0;
    overflow: hidden;

    .title {
      font-size: 16px;
      color: #4a4a4a;
      display: inline-block;
      font-weight: 1000;
      margin-bottom: 10px;
    }

    .div {
      position: relative;
      height: 500px;
      overflow: hidden;

      .lyrics {
        display: block;
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        transition: .5s;
      }
    }

    .outer {
      width: 100%;
      height: 500px;
      position: relative;
      overflow: hidden;

      .playlist {
        position: absolute;
        left: 0;
        top: 0;
        right: -17px;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;

        .li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          margin: 10px 0;
          font-size: 14px;
          cursor: pointer;
          user-select: none;

          .content {
            display: flex;

            .name {
              line-height: 30px;
            }

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
          }
        }
        .redli {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          margin: 10px 0;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          color: #FA2800;
          .content {
            display: flex;
            color: #FA2800;

            .name {
              line-height: 30px;
              color: #FA2800;
            }

            .index {
              span {
                display: block;
                height: 30px;
                line-height: 30px;
                text-align: center;
                width: 30px;
                color: #FA2800;
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
          }
        }

        .li:hover .index {
          display: none;
        }

        .li:hover .playAndPause {
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
      }
    }
  }
}

.lyrics-enter-active, .lyrics-leave-active {
  transition: all 1s;
}

.lyrics-enter, .lyrics-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
