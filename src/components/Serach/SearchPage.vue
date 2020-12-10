<template>
  <div>
    <!-- 搜索区域 -->
    <section :class="queryInfo.keywords.length>1?'bj':'bjlc'">
      <el-input v-model="queryInfo.keywords" placeholder="请输入音乐/MV/歌单/歌手" type="text" @input="search">
        <i slot="suffix" class="el-icon-search search"></i>
      </el-input>
    </section>
    <!-- tab标签栏 -->
    <section v-if="queryInfo.keywords.length>1" class="container searchTab">
      <h1>搜索结果</h1>
      <span v-for="(item,i) in tabsList" :key="i" :class="activeIndex===i?'active':''" @click="tabs(i)">{{
          item
        }}</span>
      <el-button v-if="activeIndex===0" @click="playAll"><i class="iconfont icon-bofang1"></i>播放全部</el-button>
    </section>
    <!-- 主内容区域 -->
    <main v-if="queryInfo.keywords.length>1" class="container">
      <!-- 单曲区域 -->
      <section v-if="activeIndex===0">
        <PlayList v-if="isShow" :play-list="single"></PlayList>
        <Loading v-else></Loading>
      </section>
      <!-- 歌手区域 -->
      <section v-if="activeIndex===1" class="singer">
        <singer v-if="!$store.state.loading" :column="8" :singer-list="singer"></singer>
        <Loading v-else></Loading>
      </section>
      <!-- 专辑区域 -->
      <section v-if="activeIndex===2" class="playlist">
        <Album v-if="!$store.state.loading" :album-list="album" :column="6"></Album>
        <Loading v-else></Loading>
      </section>
      <!-- 视频区域 -->
      <section v-if="activeIndex===3">
        <ul v-if="!$store.state.loading" class="video">
          <li v-for="(item,i) in video" :key="i">
            <!-- Mv封面 -->
            <img :onerror="defaultImg" :src="item.coverUrl" alt="">
            <!-- 播放量 -->
            <span class="playVolume"><i class="el-icon-caret-right"></i>{{ item.playTime }}</span>
            <!-- 遮罩 -->
            <section class="mask">
              <!-- 视频时间 -->
              <span class="time">{{ item.durationms }}</span>
            </section>
            <!-- 标题 -->
            <p>{{ item.title }}</p>
            <el-button circle><i class="el-icon-caret-right"></i></el-button>
          </li>
        </ul>
        <Loading v-else></Loading>
      </section>
      <!-- 歌单区域 -->
      <section v-if="activeIndex===4" class="playlist">
        <SongList v-if="!$store.state.loading" :column="8" :songlist="songlist"></SongList>
        <Loading v-else></Loading>
      </section>
    </main>
  </div>
</template>

<script>
import '../../assets/css/common/video.less'
import Loading from '@/components/common/Loading'
import { search } from '@/API/server/api'
import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'
import SongList from '@/components/common/SongList'
import Album from '@/components/common/AlbumList'
import PlayList from '@/components/common/PlayList'
import Singer from '@/components/common/Singer'

export default {
  components: {
    Singer,
    PlayList,
    Album,
    SongList,
    Loading
  },
  data () {
    return {
      tabsList: ['单曲', '歌手', '专辑', '视频', '歌单'],
      // 当前显示页面
      activeIndex: 0,
      queryInfo: {
        // 搜索关键字
        keywords: window.sessionStorage.getItem('search'),
        type: 1
      },
      // 单曲列表
      single: [],
      // 歌手列表
      singer: [],
      // 专辑
      album: [],
      // 视频
      video: [],
      // 歌单
      songlist: [],
      index: 0,
      isShow: false
    }
  },
  created () {
    this.getSearchList()
  },
  methods: {
    // 获取搜索列表
    async getSearchList () {
      if (this.queryInfo.keywords.length === 0) {
        return
      }
      const { data: res } = await search(this.queryInfo)
      this.single = res.result.songs
      this.singer = res.result.artists
      this.album = res.result.albums
      if (this.queryInfo.type === 1014) {
        res.result.videos.forEach(item => {
          // 换算mv时长
          const mm = this.tool.formatZero(new Date(item.durationms).getMinutes())
          const ss = this.tool.formatZero(new Date(item.durationms).getSeconds())
          item.durationms = mm + ':' + ss
          // 换算播放量
          item.playTime = item.playTime.toString().split('')
          item.playTime = this.tool.formatPlayCount(item.playTime.join(''))
        })
      }
      this.video = res.result.videos
      this.songlist = res.result.playlists
      this.isShow = true
    },
    // tab切换
    tabs (index) {
      this.activeIndex = index
      switch (index) {
        case 0:
          this.queryInfo.type = 1
          this.getSearchList()
          break
        case 1:
          this.queryInfo.type = 100
          this.getSearchList()
          break
        case 2:
          this.queryInfo.type = 10
          this.getSearchList()
          break
        case 3:
          this.queryInfo.type = 1014
          this.getSearchList()
          break
        case 4:
          this.queryInfo.type = 1000
          this.getSearchList()
          break
      }
    },
    // 搜索
    search () {
      this.getSearchList()
      window.sessionStorage.setItem('search', this.queryInfo.keywords)
      console.log(this.queryInfo.keywords)
    },
    red (item) {
      return this.$store.state.musicInfo.id === item.id && this.$store.state.playing ? 'red' : ''
    },
    async playMusic (item) {
      // 获取歌单列表
      this.$store.commit('getPlaylist', this.single)
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
    },
    async playAll () {
      this.$store.commit('getPlaylist', this.single)
      await getMusicInfo(this.single[0].id)
      await lyrics()
      this.$store.commit('playing')
      await playMusic()
    },
    openSonglist (item) {
      this.$router.push({
        path: '/songDetails',
        query: { id: item.id }
      })
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/defaultImg.png') + '"'
    }
  }
}
</script>

<style lang="less" scoped>
.bj, .bjlc {
  width: 100%;
  height: 250px;
  background-image: url("../../assets/img/personal.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center -200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: 1s;

  .el-input {
    width: 600px;

    .search {
      width: 53px;
      height: 56px;
      line-height: 56px;
      cursor: pointer;
      font-size: 18px;
      color: #4a4a4a;
    }
  }
}

.bj::before, .bjcl::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(188, 27, 27, 0.2);
}

.bjlc {
  height: 650px;
}

.searchTab {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px 0 0 0;
  height: 60px;

  h1 {
    color: #4a4a4a;
    margin-right: 30px;
  }

  span {
    margin: 0 20px;
    color: #333333;
    font-size: 14px;
    position: relative;
    cursor: pointer;
  }

  .active::after {
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    bottom: -10px;
    border-bottom: 3px #FA2800 solid;
    position: absolute;
  }

  .el-button {
    justify-self: self-end;
    background: #FA2800;
    color: white;
    font-size: 13px;
    border-radius: 15px;

    i {
      font-size: 13px;
      margin-right: 5px;
    }
  }
}

main {
  .songmap {
    display: flex;
    justify-content: left;
    align-items: center;

    img {
      width: 35px;
      height: 35px;
      margin-right: 20px;
    }
  }
}
</style>
