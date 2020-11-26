<template>
  <div v-if="isShow" class="container songDetails">
    <!-- 歌单详情页 -->
    <el-card>
      <!-- 歌单信息 -->
      <header>
        <section class="songImg">
          <img :src="songlistInfo.playlist.coverImgUrl" alt="">
        </section>
        <section class="info">
          <h1 class="title">{{ songlistInfo.playlist.name }}</h1>
          <section class="user">
            <img :src="songlistInfo.playlist.creator.avatarUrl" alt="">
            <span class="name">{{ songlistInfo.playlist.creator.nickname }}</span>
            <span class="time">{{ songlistInfo.playlist.createTime }}创建</span>
          </section>
          <section class="tag">
            <span>标签:</span>
            <ul>
              <li v-for="(item,i) in songlistInfo.playlist.tags" :key="i">
                <el-tag><span>{{ item }}</span></el-tag>
              </li>
            </ul>
          </section>
          <p class="content">{{ songlistInfo.playlist.description }}</p>
          <p class="all">全部 ></p>
        </section>
      </header>
      <!-- 按钮收藏区域 -->
      <section class="butAndKeep">
        <el-button class="all" @click="playAll"><i class="iconfont icon-bofang1"></i>播放全部</el-button>
        <el-button class="keep"><i class="iconfont icon-zan"></i>收藏</el-button>
      </section>
      <!-- 歌曲列表 -->
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
              <i v-if="$store.state.musicInfo.id===scope.row.id&&$store.state.playing" class="el-icon-video-pause pause"
                 @click="pauseMusic()"></i>
              <i v-else class="el-icon-video-play play" @click="playMusic(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="歌曲" prop="name" width="360">
          <template slot-scope="scope">
            <div class="songmap">
              <img :src="scope.row.al.picUrl" alt="">
              <span :class="red(scope.row)">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="歌手" width="225">
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
        <el-table-column label="专辑" prop="al.name" show-overflow-tooltip width="135">
          <template slot-scope="scope">
            <span :class="red(scope.row)">{{ scope.row.al.nmae }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时长" prop="dt">
          <template slot-scope="scope">
            <span :class="red(scope.row)">{{ scope.row.dt }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 其他 -->
    <section>
      <!-- 歌单收藏者 -->
      <el-card class="other">
        <span class="bar"></span>
        <span class="title">喜欢这个歌单的人</span>
        <section class="collectorUser">
          <img v-for="(item,i)  in subscribers" :key="i" :src="item.avatarUrl" :title="item.nickname" alt=""/>
        </section>
      </el-card>
      <!-- 相关推荐 -->
      <el-card class="other">
        <span class="bar"></span>
        <span class="title">相关推荐</span>
        <section v-for="(item,i) in relatedSuggestion" :key="i" class="relatedSuggestion" @click="openSonglist(item)">
          <img :src="item.coverImgUrl" alt="">
          <section class="content">
            <h3 class="suo1">{{ item.name }}</h3>
            <p class="suo1">By.{{ item.creator.nickname }}</p>
          </section>
        </section>
      </el-card>
      <!-- 最近评论 -->
      <el-card class="other">
        <span class="bar"></span>
        <span class="title">最近评论</span>
        <section v-for="(item,i) in recentComments" :key="i" class="recentComments">
          <img :src="item.user.avatarUrl" alt="">
          <div class="content">
            <section>
              <h3 class="suo1">{{ item.user.nickname }}</h3>
              <span>{{ item.time }}</span>
            </section>
            <p>{{ item.content }}</p>
          </div>
        </section>
      </el-card>
    </section>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import Loading from '@/components/common/Loading/Loading'
import {
  getPalylistDetails,
  getPlaylistCollector,
  getPlaylistComments,
  getRelatedPlaylistRecommendations,
  getSongDetails
} from '@/API/server/api'
import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'

export default {
  name: 'SongDetails',
  components: { Loading },
  data () {
    return {
      songlistInfo: {}, // 歌单推荐
      id: this.$route.query.id,
      cookie: window.sessionStorage.getItem('cookie'), // 歌曲列表
      songlist: [], // 收藏者列表
      subscribers: [], // 相关推荐列表
      relatedSuggestion: [], // 最近评论列表
      recentComments: [],
      isShow: false
    }
  },
  created () {
    this.getSongDetails()
    this.getPlaylistCollector()
    this.getRelatedSongRecommendations()
    this.playlistReviews()
  },
  methods: {
    async getSongDetails () {
      // 获取歌单详情
      const { data: res } = await getPalylistDetails({
        id: this.id,
        cookie: this.cookie
      })
      const date = new Date(res.playlist.createTime)
      const y = date.getFullYear()
      const m = this.tool.formatZero(date.getMonth() + 1)
      const d = this.tool.formatZero(date.getDate())
      res.playlist.createTime = y + '-' + m + '-' + d
      this.songlistInfo = res
      const songlistId = []
      // 获取全部歌曲的id
      this.songlistInfo.playlist.trackIds.forEach(item => {
        songlistId.push(item.id)
      })
      // 获取全部歌曲
      let index = 1
      const { data: songlist } = await getSongDetails(songlistId.join(','))
      songlist.songs.forEach(item => {
        item.index = index++
        const mm = this.tool.formatZero(new Date(item.dt).getMinutes())
        const ss = this.tool.formatZero(new Date(item.dt).getSeconds())
        item.dt = mm + ':' + ss
      })
      this.songlist = songlist.songs
      this.isShow = true
    }, // 获取歌单收藏者
    async getPlaylistCollector () {
      const { data: res } = await getPlaylistCollector({
        id: this.id,
        limit: 28
      })
      this.subscribers = res.subscribers
    }, // 获取相关歌曲推荐
    async getRelatedSongRecommendations () {
      const { data: res } = await getRelatedPlaylistRecommendations(this.id)
      this.relatedSuggestion = res.playlists
    }, // 歌单评论列表
    async playlistReviews () {
      const { data: res } = await getPlaylistComments({ id: this.id })
      res.comments.forEach(item => {
        item.time = this.tool.getDistanceSpecifiedTime(item.time)
      })
      this.recentComments = res.comments
    },
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
    async playAll () {
      this.$store.commit('getPlaylist', this.songlist)
      await getMusicInfo(this.songlist[0].id)
      await lyrics()
      this.$store.commit('playing')
      await playMusic()
    },
    red (item) {
      return this.$store.state.musicInfo.id === item.id && this.$store.state.playing ? 'red' : ''
    },
    openSonglist (item) {
      this.$router.push({
        path: '/songDetails',
        query: { id: item.id }
      })
      location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.songDetails {
  display: grid;
  grid-template-columns: 980px 380px;
  justify-content: space-between;
  align-items: start;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .songImg {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 10px;
        z-index: 2;
      }
    }

    .songImg::before {
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      display: block;
      content: '';
      position: absolute;
      right: -5px;
      bottom: -5px;
      background: rgba(0, 0, 0, .2);
      border-radius: 10px;
      z-index: 1;
    }

    .info {
      width: 700px;
      height: 210px;

      h1 {
        font-size: 24px;
        color: #4a4a4a;
        margin-bottom: 10px;
      }

      .user {
        display: flex;
        margin: 10px 0;
        justify-content: left;
        align-items: center;
        font-size: 14px;

        img {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          cursor: pointer;
        }

        .name {
          margin: 0 25px;
          color: #4a4a4a;
          font-weight: 700;
          cursor: pointer;
          transition: .6s;
        }

        .name:hover {
          color: #FA2800;
        }

        .time {
          color: #808080;
        }
      }

      .tag {
        display: flex;
        margin: 10px 0;
        justify-content: left;
        align-items: center;

        span {
          color: #4a4a4a;
          font-size: 14px;
        }

        ul {
          display: flex;

          li {
            margin: 0 8px;

            .el-tag {
              background: #FA2800;
              color: white;
              border-radius: 15px;
              height: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              border: none;
              cursor: pointer;

              span {
                color: white;
                font-size: 12px;
              }
            }
          }
        }
      }

      .content {
        font-size: 14px;
        display: -webkit-box; /*将对象转为弹性盒模型展示*/
        -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
        -webkit-line-clamp: 2; /*限制文本行数*/
        overflow: hidden; /*超出隐藏*/
        margin: 10px 0;
      }

      .all {
        color: #FA2800;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  .butAndKeep {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;

    .el-button {
      font-size: 14px;
      border-radius: 15px;
    }

    .all {
      background: #FA2800;
      color: white;

      i {
        font-size: 13px;
      }
    }

    i {
      margin-right: 6px;
    }
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

  .other {
    margin-bottom: 20px;

    .title {
      font-size: 14px;
      color: #404040;
      font-weight: 1000;
    }

    .collectorUser {
      display: grid;
      justify-content: center;
      align-items: center;
      grid-template-columns: repeat(7, 37px);
      grid-column-gap: 15px;
      grid-row-gap: 15px;
      margin-top: 20px;

      img {
        width: 37px;
        height: 37px;
        cursor: pointer;
      }
    }

    .relatedSuggestion {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;

      img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        cursor: pointer;
      }

      .content {
        width: 270px;
        height: 50px;
        position: relative;

        h3 {
          width: 100%;
          font-size: 14px;
          color: #4a4a4a;
          margin-bottom: 10px;
          transition: 0.3s;
          cursor: pointer;
        }

        h3:hover {
          color: #FA2800;
        }

        p {
          color: #a5a5c1;
          font-size: 12px;
        }
      }
    }

    .recentComments {
      margin-top: 20px;
      width: 100%;
      display: flex;

      img {
        width: 45px;
        height: 45px;
        border-radius: 100%;
        cursor: pointer;
        margin-right: 10px;
      }

      .content {
        width: 100%;

        section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          h3 {
            width: 200px;
            font-size: 15px;
            color: #4a4a4a;
            cursor: pointer;
            transition: .3s;
          }

          h3:hover {
            color: #FA2800;
          }

          span {
            color: #a5a5c1;
            font-size: 12px;
          }
        }

        p {
          width: 100%;
          background: #f5f5f5;
          height: auto;
          color: #666666;
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }
  }
}

.red {
  color: #FA2800;
}
</style>
