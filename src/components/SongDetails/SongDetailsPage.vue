<template>
  <div v-if="isShow" class="container songDetails">
    <!-- 歌单详情页 -->
    <el-card>
      <!-- 歌单信息 -->
      <header>
        <section class="songImg">
          <img :onerror="defaultImg" :src="songlistInfo.playlist.coverImgUrl" alt="">
        </section>
        <section class="info">
          <h1 class="title">{{ songlistInfo.playlist.name }}</h1>
          <section class="user">
            <img :onerror="defaultImg" :src="songlistInfo.playlist.creator.avatarUrl" alt="">
            <span class="name"
                  @click="openUserInfo(songlistInfo.playlist.creator.userId)">{{ songlistInfo.playlist.creator.nickname
              }}</span>
            <span class="time">{{ songlistInfo.playlist.createTime }}创建</span>
          </section>
          <section v-if="songlistInfo.playlist.tags.length>0" class="tag">
            <span>标签:</span>
            <ul>
              <li v-for="(item,i) in songlistInfo.playlist.tags" :key="i">
                <el-tag><span @click="openSongSort(item)">{{ item }}</span></el-tag>
              </li>
            </ul>
          </section>
          <p class="content">{{ songlistInfo.playlist.description }}</p>
          <p class="all">全部 ></p>
        </section>
      </header>
      <!-- 按钮收藏区域 -->
      <transition mode="out-in" name="btn">
        <section v-if="!$store.state.allCommentAreaisShow" :key="transitionKey.a" class="butAndKeep">
          <el-button class="all" @click="playAll"><i class="iconfont icon-bofang1"></i>播放全部
          </el-button>
          <el-button class="keep"><i class="iconfont icon-zan"></i>收藏</el-button>
        </section>
        <section v-else :key="transitionKey.b" class="viewSongList">
          <el-button @click="$store.commit('toggleDisplayOfAllCommentAreas')">歌曲列表</el-button>
        </section>
      </transition>
      <!-- 歌曲列表 -->
      <transition name="show">
        <PlayList v-if="!$store.state.allCommentAreaisShow" :play-list="songlist"></PlayList>
      </transition>
      <transition name="show">
        <Comment v-if="$store.state.allCommentAreaisShow" :comment-list="allComment" :get-comment-list="playlistReviews"
                 :query="songlistQuery" :type="2"></Comment>
      </transition>
    </el-card>
    <!-- 其他 -->
    <section>
      <!-- 歌单收藏者 -->
      <el-card class="other">
        <span class="bar"></span>
        <span class="title">喜欢这个歌单的人</span>
        <section v-if="subscribers.length>0" class="collectorUser">
          <img v-for="(item,i)  in subscribers" :key="i" :onerror="defaultImg" :src="item.avatarUrl"
               :title="item.nickname"
               alt="" @click="openUserInfo(item.userId)"/>
        </section>
        <p v-else class="nolike">还没有被人喜欢！</p>
      </el-card>
      <!-- 相关推荐 -->
      <el-card class="other">
        <span class="bar"></span>
        <span class="title">相关推荐</span>
        <section v-for="(item,i) in relatedSuggestion" :key="i" class="relatedSuggestion">
          <img :onerror="defaultImg" :src="item.coverImgUrl" alt="" @click="openSonglist(item)">
          <section class="content">
            <h3 class="suo1" @click="openSonglist(item)">{{ item.name }}</h3>
            <p class="suo1" @click="openUserInfo(item.creator.userId)">By.{{ item.creator.nickname }}</p>
          </section>
        </section>
      </el-card>
      <!-- 最近评论 -->
      <transition name="show">
        <el-card v-if="!$store.state.allCommentAreaisShow" class="other">
          <span class="bar"></span>
          <span class="title">最近评论</span>
          <span class="allComment"
                @click="$store.commit('toggleDisplayOfAllCommentAreas')">{{ recentComments.length > 0 ? '全部评论' : '去评论'
            }} ></span>
          <section v-if="recentComments.length>0">
            <section v-for="(item,i) in recentComments" :key="i" class="recentComments">
              <img @click="openUserInfo(item.user.userId)" :onerror="defaultImg" :src="item.user.avatarUrl" alt="">
              <div class="content">
                <section>
                  <h3 @click="openUserInfo(item.user.userId)" class="suo1">{{ item.user.nickname }}</h3>
                  <span>{{ item.time | howLongHasItBeenSinceLastTime }}</span>
                </section>
                <p>{{ item.content }}</p>
              </div>
            </section>
          </section>
          <section v-else class="noComment">还没有评论哦~</section>
        </el-card>
      </transition>
    </section>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import Loading from '@/components/common/Loading'
import {
  getPalylistDetails,
  getPlaylistCollector,
  getPlaylistComments,
  getRelatedPlaylistRecommendations,
  getSongDetails
} from '@/API/server/api'
import { getMusicInfo, lyrics, playMusic } from '@/utils/playSong'
import PlayList from '@/components/common/PlayList'
import Comment from '@/components/common/comment'

export default {
  name: 'SongDetails',
  components: {
    Comment,
    PlayList,
    Loading
  },
  data () {
    return {
      // 歌单信息
      songlistInfo: {},
      // 歌单id
      id: this.$route.query.id,
      cookie: window.sessionStorage.getItem('cookie'),
      // 歌曲列表
      songlist: [],
      // 收藏者列表
      subscribers: [],
      // 相关推荐列表
      relatedSuggestion: [],
      // 最近评论列表
      recentComments: [],
      allComment: [],
      isShow: false,
      // 歌单查询参数
      songlistQuery: {
        id: this.$route.query.id,
        limit: 20,
        offset: 0,
        before: 0
      },
      // 全部评论区域是否显示
      // allCommentAreaisShow: false,
      transitionKey: {
        a: 1,
        b: 2
      }
    }
  },
  async mounted () {
    await this.getSongDetails()
    await this.getPlaylistCollector()
    await this.getRelatedSongRecommendations()
    await this.playlistReviews()
    this.isShow = true
  },
  methods: {
    async getSongDetails () {
      // 获取歌单详情
      const { data: res } = await getPalylistDetails({
        id: this.id,
        cookie: this.cookie
      })
      // 歌单创建时间格式化
      res.playlist.createTime = this.tool.formatYearMonthDay(res.playlist.createTime)
      this.songlistInfo = res
      const songlistId = []
      // 获取全部歌曲的id
      this.songlistInfo.playlist.trackIds.forEach(item => {
        songlistId.push(item.id)
      })
      // 获取全部歌曲
      const { data: songlist } = await getSongDetails(songlistId.join(','))
      this.songlist = songlist.songs
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
      const { data: res } = await getPlaylistComments(this.songlistQuery)
      this.recentComments = res.comments
      console.log(res)
      this.allComment = res
    },
    async playAll () {
      this.$store.commit('getPlaylist', this.songlist)
      await getMusicInfo(this.songlist[0].id)
      await lyrics()
      this.$store.commit('playing')
      await playMusic()
    },
    openSonglist (item) {
      this.$router.push({
        path: '/songDetails',
        query: { id: item.id }
      })
      location.reload()
    },
    openSongSort (item) {
      this.$router.push({
        path: '/songlist',
        query: { tag: item }
      })
    },
    openUserInfo (userId) {
      this.$router.push({
        path: '/accessUserDetails',
        query: { id: userId }
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
        //margin: 10px 0;
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

  .viewSongList {
    width: 100%;
    margin-bottom: 20px;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .el-button {
      background: #FA2800;
      color: white;
      border: none;
      outline: none;
      border-radius: 15px;
    }
  }

  .other {
    margin-bottom: 20px;

    .title {
      font-size: 14px;
      color: #404040;
      font-weight: 1000;
    }

    .allComment {
      float: right;
      font-size: 13px;
      color: #FA2800;
      cursor: pointer;
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

    .nolike {
      width: 100%;
      text-align: center;
      font-size: 14px;
      margin-top: 20px;
      color: #FA2800;
      font-weight: 1000;
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
          cursor: pointer;
        }

        p:hover {
          color: #FA2800;
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

    .noComment {
      width: 100%;
      text-align: center;
      font-size: 14px;
      margin-top: 20px;
      color: #FA2800;
      font-weight: 1000;
    }
  }
}

.show-enter-active, .show-leave-active {
  transition: .5s;
}

.show-enter, .show-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.btn-enter-active, .btn-leave-active {
  transition: .3s;
}

.btn-enter, .btn-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
