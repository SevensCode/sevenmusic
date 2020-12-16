<template>
  <el-table :data="playList" row-class-name="playList" stripe style="width: 100%;">
    <el-table-column align="center" label="序号" width="80">
      <template slot-scope="scope">
                <span :class="$store.state.musicInfo.id===scope.row.id&&$store.state.playing?'hide':'playlist-index'">{{
                    scope.row.index | formatZero
                  }}</span>
        <span :class="$store.state.musicInfo.id===scope.row.id&&$store.state.playing?'hide':'playlist-play'">
                        <i class="el-icon-video-play" @click="playMusic(scope.row)"></i>
                    </span>
        <span :class="$store.state.musicInfo.id===scope.row.id&&$store.state.playing?'playlist-pause':'hide'">
                    <i class="el-icon-video-pause" @click="pauseMusic()"></i>
                </span>
      </template>
    </el-table-column>
    <el-table-column label="歌曲">
      <template slot-scope="scope">
        <section class="playList-name">
          <img :onerror="defaultImg" v-if="scope.row.al.picUrl" :key="scope.row.al.picUrl" v-lazy="scope.row.al.picUrl" alt="">
          <span :class="activeRed(scope.row)" class="suo1">{{ scope.row.name }}</span>
        </section>
      </template>
    </el-table-column>
    <el-table-column label="歌手">
      <template slot-scope="scope">
        <span v-for="(item,i) in scope.row.ar" :key="i">
          <span v-if="scope.row.ar.length-1===i || scope.row.ar.length===1" :class="activeRed(scope.row)"
                class="playlist-author" @click="openSingerDeatils(item.id)">{{
              item.name
            }}</span>
          <span v-else-if="scope.row.ar.length>1" :class="activeRed(scope.row)" class="playlist-author"
                @click="openSingerDeatils(item.id)">{{
              item.name
            }} <strong> / </strong> </span>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="专辑">
      <template slot-scope="scope">
        <span :class="activeRed(scope.row)" class="suo1">{{ scope.row.al.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="时长" width="80">
      <template slot-scope="scope">
        <span :class="activeRed(scope.row)">{{ scope.row.dt | playTime }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'

export default {
  name: 'PlayList',
  props: {
    playList: Array
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let index = 1
      this.playList.forEach(item => {
        item.index = index
        index++
      })
    },
    async playMusic (item) {
      // 获取歌单列表
      this.$store.commit('getPlaylist', this.playList)
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
      if (id === parseInt(this.$route.query.id)) {
        return false
      } else {
        this.$router.push({
          path: '/singerDetails',
          query: { id }
        })
        return location.reload()
      }
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/tpwzd.jpg') + '"'
    }
  },
  watch: {
    playList: function (playList) {
      let index = 1
      playList.forEach(item => {
        item.index = index
        index++
      })
    }
  }
}
</script>

<style lang="less" scoped>
.playList {
  .playList-name {
    display: flex;
    justify-content: left;
    align-items: center;
    img {
      width: 35px;
      height: 35px;
      border-radius: 3px;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
    }
  }
  .playlist-play {
    color: #FA2800;
    display: none;
  }
  .playlist-index {
  }
  .playlist-pause {
    color: #FA2800;
    cursor: pointer;
  }
  .playlist-author:hover {
    color: #FA2800;
    cursor: pointer;
  }
  .playlist-author:hover strong {
    color: #4a4a4a;
  }
}
.playList:hover .playlist-index {
  display: none;
}
.playList:hover .playlist-play {
  display: block;
  cursor: pointer;
}
.hide {
  display: none;
}
.activeRed {
  color: #FA2800;
}
</style>
