<template>
  <div v-if="isShow">
    <section class="singerInfo">
      <img :src="singerDesc.img1v1Url" alt="">
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
        <el-table :data="songlist" row-class-name="hoverPlay" stripe style="width: 100%">
          <el-table-column align="center" class-name="" label="序号" width="100">
            <template slot-scope="scope">
              <div :class="$store.state.musicInfo.id===scope.row.id&&$store.state.playing?'hide':'index'">
              <span v-if="scope.row.index>8" :class="red(scope.row)">
                {{ scope.row.index }}
              </span>
                <span v-else :class="red(scope.row)">0{{ scope.row.index }}</span>
              </div>
              <div :class="$store.state.musicInfo.id===scope.row.id&&$store.state.playing?'show':'playAndPause'">
                <i v-if="$store.state.musicInfo.id===scope.row.id&&$store.state.playing"
                   class="el-icon-video-pause pause"
                   @click="pauseMusic()"></i>
                <i v-else class="el-icon-video-play play" @click="playMusic(scope.row)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌曲" prop="name" width="400">
            <template slot-scope="scope">
              <div class="songmap">
                <!--                <img :src="scope.row.al.picUrl" alt="">-->
                <span :class="red(scope.row)">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌手" width="400">
            <template slot-scope="scope">
            <span v-for="(item,i) in scope.row.ar" :key="i">
              <span v-if="scope.row.ar.length===1"
                    :class="red(scope.row)">{{ item.name }}</span>
              <span v-else-if="scope.row.ar.length>1" :class="red(scope.row)">
                {{ item.name }}
                <span v-if="item.name===scope.row.ar[scope.row.ar.length - 1].name" :class="red(scope.row)"></span>
                <span v-else :class="red(scope.row)">/</span>
              </span>
            </span>
            </template>
          </el-table-column>
          <el-table-column label="专辑" prop="al.name" show-overflow-tooltip width="400">
            <template slot-scope="scope">
              <span :class="red(scope.row)">{{ scope.row.al.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="时长" prop="dt">
            <template slot-scope="scope">
              <span :class="red(scope.row)">{{ scope.row.dt }}</span>
            </template>
          </el-table-column>
        </el-table>
        <section v-if="songlistTotal>50&&hotAndTimeActive===1" class="pagination">
          <el-pagination
              :page-size="songListQuery.limit"
              :total=songlistTotal
              background
              layout="total, prev, pager, next, jumper"
              @current-change="handleCurrentChange">
          </el-pagination>
        </section>
      </section>
      <section v-else-if="defaultActive===1" class="albumList">专辑</section>
      <section v-else-if="defaultActive===2" class="MvList">Mv</section>
      <section v-else-if="defaultActive===3" class="similarSingers">相识歌手</section>
    </section>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import { getAllTheSongsOfTheSinger, getSingerAlbum, getSingerSingles } from '@/API/server/api'
import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'
import Loading from '@/components/common/Loading/Loading'
import '@/assets/css/common/pagination.less'

export default {
  name: 'SingerDetails',
  components: { Loading },
  data () {
    return {
      // 歌手id
      id: this.$route.query.id,
      // 歌手描述
      singerDesc: '',
      songlist: [],
      songlistTotal: 0,
      menuList: ['单曲', '专辑', 'MV', '相似歌手'],
      // 导航栏默认激活
      defaultActive: 0,
      // 热门 与 全部 默认激活
      hotAndTimeActive: 0,
      // 歌曲查询参数
      songListQuery: {
        id: this.$route.query.id,
        order: 'hot',
        limit: 50,
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
      albumList: []
    }
  },
  async created () {
    await this.getSingerAllInfo()
    await this.getSonglist()
    await this.getAlbum()
    this.isShow = true
  },
  methods: {
    // 获取作者信息
    async getSingerAllInfo () {
      const { data: singerSingles } = await getSingerSingles(this.id)
      this.singerDesc = singerSingles.artist
      console.log(singerSingles)
    },
    // 获取歌曲
    async getSonglist () {
      const { data: hotSongs } = await getAllTheSongsOfTheSinger(this.songListQuery)
      let index = 1
      hotSongs.songs.forEach(item => {
        item.index = index++
        const mm = this.tool.formatZero(new Date(item.dt).getMinutes())
        const ss = this.tool.formatZero(new Date(item.dt).getSeconds())
        item.dt = mm + ':' + ss
      })
      this.songlist = hotSongs.songs
      this.songlistTotal = hotSongs.total
    },
    // 获取专辑
    async getAlbum () {
      const { data: album } = await getSingerAlbum(this.albumQuery)
      console.log(album)
      this.albumList = album.hotAlbums
    },
    // 导航激活
    navSwitch (i) {
      this.defaultActive = i
    },
    // 播放音乐激活 红色字体
    red (item) {
      return this.$store.state.musicInfo.id === item.id && this.$store.state.playing ? 'red' : ''
    },
    // 热门歌曲
    hotSong () {
      this.songListQuery.order = 'hot'
      this.hotAndTimeActive = 0
      this.songListQuery.offset = 0
      this.getSonglist()
    },
    // 按时间排序的歌曲
    timeSong () {
      this.songListQuery.order = 'time'
      this.hotAndTimeActive = 1
      this.songListQuery.offset = 0
      this.getSonglist()
    },
    // 播放Music
    async playMusic (item) {
      // 获取歌单列表
      this.$store.commit('getPlaylist', this.songlist)
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
      this.songListQuery.offset = (newPage - 1) * 50
      this.getSonglist()
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

.red {
  color: #FA2800;
}

.hoverPlay {
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

  .playAndPause {
    display: none;
    color: #FA2800;
    cursor: pointer;
  }
}

.hoverPlay:hover .index {
  display: none;
}

.hoverPlay:hover .playAndPause {
  display: block;
}

.hide {
  display: none;
}

.show {
  display: block;
  color: #FA2800;
  text-align: center;
}
</style>
