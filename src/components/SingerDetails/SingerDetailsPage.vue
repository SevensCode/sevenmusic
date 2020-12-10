<template>
  <div v-if="isShow">
    <section class="singerInfo">
      <img :onerror="defaultImg" :src="singerDesc.img1v1Url" alt="">
      <h1 class="name">{{ singerDesc.name }}</h1>
      <el-button> + 关注Ta</el-button>
      <p class="desc container suo2">{{ singerDesc.briefDesc }}</p>
      <section class="dynamic">
        <section>
          <p>{{ singerDesc.musicSize }}</p>
          <span>单曲数</span>
        </section>
        <section>
          <p>{{ singerDesc.albumSize }}</p>
          <span>专辑数</span>
        </section>
        <section>
          <p>{{ singerDesc.mvSize }}</p>
          <span>MV数</span>
        </section>
      </section>
    </section>
    <section class="sort container">
      <section class="menu">
        <span v-for="(item,i) in menuList" :key="i" :class="defaultActive===i?'active':''" @click="navSwitch(i)">{{
            item
          }}</span>
      </section>
      <section v-if="defaultActive===0" class="singleSore">
        <span :class="hotAndTimeActive===0?'active':''" @click="hotSong">热门50首</span>
        <div></div>
        <span :class="hotAndTimeActive===1?'active':''" @click="timeSong">时间</span>
        <el-button @click="playAll">播放全部</el-button>
      </section>
      <section v-if="defaultActive===0" class="singleList">
        <PlayList v-if="!$store.state.loading" :play-list="hotAndTimeActive===0?hotSonglist:songlist"></PlayList>
        <Loading v-else></Loading>
        <pager v-if="hotAndTimeActive!==0" :handle-current-change="handleCurrentChange"
               :limit="songListQuery.limit" :total="songlistTotal"></pager>
      </section>
      <section v-show="defaultActive===1" class="albumList">
        <Album :album-list="albumList" :column="6"></Album>
      </section>
      <section v-show="defaultActive===2" class="MvList">
        <MvList :column="4" :mv-list="mvList"></MvList>
      </section>
      <section v-show="defaultActive===3" class="similarSingers">
        <Singer :column="10" :singer-list="similarSingers"></Singer>
      </section>
    </section>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import {
  getAllTheSongsOfTheSinger,
  getSimilarSingers,
  getSingerAlbum,
  getSingerMv,
  getSingerSingles,
  getSingerTop50Songs
} from '@/API/server/api'
import { getMusicInfo, lyrics, playMusic } from '@/utils/playSong'
import Loading from '@/components/common/Loading'
import Album from '@/components/common/AlbumList'
import MvList from '@/components/common/MvList'
import PlayList from '@/components/common/PlayList'
import Singer from '@/components/common/Singer'
import Pager from '@/components/common/pager'

export default {
  name: 'SingerDetails',
  components: {
    Pager,
    Singer,
    PlayList,
    Loading,
    Album,
    MvList
  },
  data () {
    return {
      // 歌手id
      id: this.$route.query.id,
      // 歌手描述
      singerDesc: '',
      songlist: [],
      hotSonglist: [],
      songlistTotal: 0,
      menuList: ['单曲', '专辑', 'MV', '相似歌手'],
      // 导航栏默认激活
      defaultActive: 0,
      // 热门 与 全部 默认激活
      hotAndTimeActive: 0,
      // 歌曲查询参数
      songListQuery: {
        id: this.$route.query.id,
        order: 'time',
        limit: 51,
        offset: 0
      },
      // 专辑查询参数
      albumQuery: {
        id: this.$route.query.id,
        limit: 50,
        offset: 0
      },
      isShow: false,
      // 专辑列表
      albumList: [],
      mvList: [],
      similarSingers: []
    }
  },
  async mounted () {
    await this.getSingerAllInfo()
    await this.getSonglist()
    await this.getTop50Songs()
    await this.getAlbum()
    await this.getMv()
    await this.getSimilarSingers()
    this.isShow = true
  },
  methods: {
    // 获取作者信息
    async getSingerAllInfo () {
      const { data: singerSingles } = await getSingerSingles(this.id)
      this.singerDesc = singerSingles.artist
    },
    // 获取全部歌曲
    async getSonglist () {
      const { data: allSongs } = await getAllTheSongsOfTheSinger(this.songListQuery)
      this.songlist = allSongs.songs
      this.songlistTotal = allSongs.total
      console.log(allSongs)
    },
    async getTop50Songs () {
      const { data: hotSongs } = await getSingerTop50Songs(this.id)
      this.hotSonglist = hotSongs.songs
    },
    // 获取专辑
    async getAlbum () {
      const { data: album } = await getSingerAlbum(this.albumQuery)
      this.albumList = album.hotAlbums
    },
    // 获取mv
    async getMv () {
      const { data: mv } = await getSingerMv(this.id)
      this.mvList = mv.mvs
    },
    // 获取相似歌手
    async getSimilarSingers () {
      const { data: similarSingers } = await getSimilarSingers(this.id)
      this.similarSingers = similarSingers.artists
    },
    // 导航激活
    navSwitch (i) {
      this.defaultActive = i
    },
    // 热门歌曲
    hotSong () {
      this.hotAndTimeActive = 0
      this.getTop50Songs()
    },
    // 按时间排序的歌曲
    timeSong () {
      this.hotAndTimeActive = 1
      this.getSonglist()
    },
    // 播放全部
    async playAll () {
      this.$store.commit('getPlaylist', this.songlist)
      await getMusicInfo(this.songlist[0].id)
      await lyrics()
      this.$store.commit('playing')
      await playMusic()
    },
    // 分页器
    handleCurrentChange (newPage) {
      this.songListQuery.offset = (newPage - 1) * this.songListQuery.limit
      this.getSonglist()
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

.singerInfo {
  width: 100%;
  height: 652px;
  background-image: url("../../assets/img/wallhaven-6k1dj7.jpg");
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
  border-radius: 0 0 30% 30%;

  img {
    width: 140px;
    height: 140px;
    border-radius: 100%;
    margin: 10px 0;
  }

  .name {
    margin: 10px 0;
    opacity: 0.8;
  }

  .desc {
    font-size: 14px;
    font-weight: 1000;
    height: 40px;
    opacity: 0.8;
    text-align: center;
  }

  .el-button {
    margin: 20px 0;
    background: rgba(0, 0, 0, .3);
    color: white;
    border-radius: 15px;
  }

  .dynamic {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    width: 100%;

    section {
      margin: 0 40px;
      text-align: center;

      p {
        font-size: 22px;
        font-weight: 1000;
        opacity: 0.9;
      }

      span {
        opacity: 0.8;
      }
    }
  }
}

.sort {
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;

    span {
      margin: 0 30px;
      color: #333333;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      font-weight: 1000;
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
  }

  .singleSore {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      font-size: 14px;
      color: #4a4a4a;
      cursor: pointer;
    }

    div {
      height: 20px;
      border-left: 1px solid black;
      margin: 0 20px;
    }

    .el-button {
      margin-left: 20px;
      background: #FA2800;
      color: white;
      border: none;
      outline: none;
    }

    .active {
      color: #FA2800;
      font-weight: 1000;
    }
  }
}
</style>
