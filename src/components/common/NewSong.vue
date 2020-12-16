<template>
  <div ref="newSong" class="newSong-list">
    <section v-for="(item,i) in newSong" :key="item.id" class="newSong-item">
      <section class="play">
        <span :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'hide':'playlist-index'">{{
            i+1 | formatZero
          }}</span>
        <span :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'hide':'playlist-play'">
          <i class="el-icon-video-play" @click="playMusic(item)"></i>
        </span>
        <span :class="$store.state.musicInfo.id===item.id&&$store.state.playing?'playlist-pause':'hide'">
          <i class="el-icon-video-pause" @click="pauseMusic()"></i>
        </span>
      </section>
      <section class="newSong-info">
        <img :onerror="defaultImg" :key="item.id" v-lazy="item.picUrl" alt="">
        <section class="songTitleAndAuthor">
          <p class="songTitle suo1">{{ item.name }}</p>
          <p class="author suo1">
            <span v-for="(author,i) in item.song.artists" :key="author.id">
               <span v-if="item.song.artists.length-1===i || item.song.artists.length===1" :class="activeRed(author)"
                     class="playlist-author" @click="openSingerDeatils(author.id)">{{
                   author.name
                 }}</span>
            <span v-else-if="item.song.artists.length>1" :class="activeRed(author)" class="playlist-author"
                  @click="openSingerDeatils(author.id)">{{
                author.name
              }} <strong> / </strong> </span>
            </span>
          </p>
        </section>
      </section>
      <p class="album">《{{ item.song.album.name }}》</p>
      <p class="playTime">{{ item.song.duration | playTime }}</p>
    </section>
  </div>
</template>

<script>
import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'

export default {
  name: 'RecommendNewSong',
  props: {
    newSong: Array,
    column: Number
  },
  data () {
    return {}
  },
  methods: {
    async playMusic (item) {
      // 获取歌单列表
      this.$store.commit('getPlaylist', this.newSong)
      // 获取歌曲信息
      await getMusicInfo(item.id)
      await lyrics()
      // 改变状态 播放中
      this.$store.commit('playing')
      // 播放
      await playMusic()
    },
    // 暂停
    pauseMusic () {
      // 改变播放状态
      this.$store.commit('pause')
      // 暂停
      pauseMusic()
    },
    activeRed (item) {
      return this.$store.state.musicInfo.id === item.id && this.$store.state.playing ? 'activeRed' : ''
    },
    openSingerDeatils (id) {
      if (window.location.hash.slice(0, 15) === '#/singerDetails') {
        this.$router.push({
          path: '/singerDetails',
          query: { id }
        })
        return location.reload()
      }
      this.$router.push({
        path: '/singerDetails',
        query: { id }
      })
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/tpwzd.jpg') + '"'
    }
  },
  watch: {
    column: function () {
      this.$refs.newSong.style.gridTemplateColumns = 'repeat(' + this.column + ', 660px)'
    }
  }
}
</script>

<style lang="less" scoped>
.newSong-list {
  display: grid;
  grid-template-columns: repeat(2, 660px);
  justify-content: space-between;
  grid-row-gap: 20px;
  align-items: center;
  border-radius: 3px;
  margin-top: 20px;
  //padding: 0 8px;
  margin-bottom: 20px;

  .newSong-item {
    height: 80px;
    border-radius: 3px;
    background-color: white;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .play {
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
    }

    .newSong-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 200px;
      font-size: 14px;

      img {
        width: 55px;
        height: 55px;
        border-radius: 3px;
      }

      .songTitleAndAuthor {
        width: 130px;

        .songTitle {
          color: #333333;
        }

        .author {
          color: #4a4a4a;
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }

    .album {
      font-size: 14px;
      color: #4a4a4a;
      width: 200px;
    }

    .playTime {
      width: 100px;
      text-align: right;
      color: #4a4a4a;
      font-size: 14px;
    }
  }
}

.playlist-play {
  color: #FA2800;
  display: none;
}

.playlist-index {
  font-size: 14px;
  color: #4a4a4a;
}

.playlist-pause {
  color: #FA2800;
  cursor: pointer;
}

.newSong-item:hover .playlist-index {
  display: none;
}

.newSong-item:hover .playlist-play {
  display: block;
  cursor: pointer;
}

.playlist-author:hover {
  color: #FA2800;
  cursor: pointer;
}

.playlist-author:hover strong {
  color: #4a4a4a;
}

.hide {
  display: none;
}

.activeRed {
  color: #FA2800;
}
</style>
