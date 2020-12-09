<template>
  <div>
    <section class="bj"></section>
    <section class="main container">
      <!-- 个人信息 -->
      <el-card body-style="padding:0" class="personalInformation">
        <section class="bj">
          <img :src="userInfo.profile.backgroundUrl" alt="">
        </section>
        <section class="content">
          <img :src="userInfo.profile.avatarUrl" alt="">
          <h2>{{ userInfo.profile.nickname }}</h2>
          <el-button>签到</el-button>
        </section>
        <section class="info">
          <p>等级：<i class="iconfont icon-dengji"></i><span>{{ userInfo.level }}</span></p>
          <p>年龄：</p>
          <p>地区：</p>
        </section>
        <section class="activity">
          <section>
            <p>动态</p>
            <p>{{ userInfo.profile.eventCount }}</p>
          </section>
          <section>
            <p>关注</p>
            <p>{{ userInfo.profile.follows }}</p>
          </section>
          <section>
            <p>粉丝</p>
            <p>{{ userInfo.profile.followeds }}</p>
          </section>
        </section>
        <section class="btn">
          <el-button>个人设置</el-button>
          <el-button>我的等级</el-button>
        </section>
      </el-card>
      <!-- 听歌排行列表 -->
      <el-card class="listOfListeningSongs">
        <header class="header">
          <section class="left">
            <span class="bar"></span>
            <p>听歌排行<span>（累计听歌{{ userInfo.listenSongs }}首）</span></p>
          </section>
          <section class="right">
            <span :class="active==='recent'?'active':''" @click="recent">最近一周</span>
            <div></div>
            <span :class="active==='all'?'active':''" @click="all">所有时间</span>
          </section>
        </header>
        <button><i class="iconfont icon-bofang1"></i>播放全部</button>
        <PlayList v-if="isShow" :play-list="songRankingList"></PlayList>
        <Loading v-else></Loading>
      </el-card>
      <!-- 我的歌单列表 -->
      <section class="mySongList">
        <!--我创建的歌单列表-->
        <el-card class="myCreateSongList">
          <header>
            <span class="bar"></span>
            <span>我创建的歌单</span>
          </header>
          <SongList :column="2" :songlist="myCreateSongList"></SongList>
        </el-card>
        <!--我收藏的歌单列表-->
        <el-card class="myCreateSongList fu">
          <header>
            <span class="bar"></span>
            <span>我创建的歌单</span>
          </header>
          <SongList :column="2" :songlist="myKeepSongList"></SongList>
        </el-card>
      </section>
    </section>
  </div>
</template>

<script>
import { getUserPlaybackHistory, getUserSonglist } from '@/API/server/userApi'
import Loading from '@/components/common/Loading'
import { getMusicInfo, lyrics, pauseMusic, playMusic } from '@/utils/playSong'
import SongList from '@/components/common/SongList'
import PlayList from '@/components/common/PlayList'

export default {
  name: 'User',
  components: {
    PlayList,
    SongList,
    Loading
  },
  data () {
    return {
      // 当前用户信息
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      cookie: window.sessionStorage.getItem('cookie'),
      // 当前用户id
      userId: JSON.parse(window.sessionStorage.getItem('userInfo')).profile.userId,
      // 听歌排行列表
      songRankingList: [],
      // 听歌排行查询参数
      queryInfo: {
        type: 1
      },
      active: 'recent',
      i: 0,
      // 我创建的歌单
      myCreateSongList: [],
      // 我收藏的歌单
      myKeepSongList: [],
      isShow: false
    }
  },
  created () {
    this.getrankingList()
    this.getMyCreateSongList()
  },
  methods: {
    // 获取听歌排行列表
    async getrankingList () {
      const { data: rankingList } = await getUserPlaybackHistory({
        uid: this.userId,
        type: this.queryInfo.type
      })
      rankingList.weekData ? this.songRankingList = rankingList.weekData : this.songRankingList = rankingList.allData
      const arr = []
      this.songRankingList.forEach(item => {
        arr.push(item.song)
      })
      this.songRankingList = arr
      this.isShow = true
    },
    // 获取我创建的歌单列表
    async getMyCreateSongList () {
      const { data: myCreateSongList } = await getUserSonglist({ uid: this.userId })
      myCreateSongList.playlist.forEach(item => {
        if (item.creator.userId === this.userId) {
          this.myCreateSongList.push(item)
        } else {
          this.myKeepSongList.push(item)
        }
      })
    },
    // 获取最近一周听歌排行
    recent () {
      this.queryInfo.type = 1
      this.active = 'recent'
      this.getrankingList()
    },
    // 获取全部听歌排行
    all () {
      this.queryInfo.type = 0
      this.active = 'all'
      this.getrankingList()
    },
    async playMusic (item) {
      // 获取歌单列表
      const arr = []
      this.songRankingList.forEach(item => {
        arr.push(item.song)
      })
      this.$store.commit('getPlaylist', arr)
      console.log(arr)
      // 获取歌曲信息
      await getMusicInfo(item.song.id)
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
      const arr = []
      this.songRankingList.forEach(item => {
        arr.push(item.song)
      })
      this.$store.commit('getPlaylist', arr)
      await getMusicInfo(arr[0].id)
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
  }
}
</script>

<style lang="less" scoped>
.bj {
  width: 100%;
  height: 350px;
  background-image: url("../../assets/img/personal.jpg");
  background-size: cover;
  background-position: top center;
}

.main {
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns:340px 620px 350px;
  grid-column-gap: 20px;
  justify-content: center;
  align-items: start;
  overflow: visible;

  .personalInformation {
    position: relative;
    top: -100px;
    border: none;

    .bj {
      height: 140px;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 25px;

      img {
        width: 64px;
        height: 64px;
        margin-bottom: 30px;
        border-radius: 5px;
      }

      h2 {
        width: 150px;
        font-size: 16px;
      }

      .el-button {
        width: 56px;
        height: 24px;
        padding: 0;
        text-align: center;
        border-radius: 15px;
        background: #FA2800;
        color: white;
        font-size: 12px;
      }
    }

    .info {
      padding: 10px 40px;

      p {
        position: relative;
        height: 24px;
        font-size: 13px;
        color: #4a4a4a;
        line-height: 24px;

        i {
          font-size: 12px;
        }

        span {
          font-weight: 1000;
          font-family: Ebrima, serif;
        }
      }

      p::before {
        display: block;
        position: absolute;
        content: '';
        left: -15px;
        top: 50%;
        margin-top: -4.5px;
        width: 7px;
        height: 7px;
        border-radius: 5px;
        background: #FA2800;
      }
    }

    .activity {
      padding: 0 40px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 20px 0;

      section {
        text-align: center;
        color: #958ebb;
        font-size: 14px;
        cursor: pointer;

        p {
          line-height: 24px;
        }
      }
    }

    .btn {
      display: flex;
      padding: 0 40px;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 30px;

      .el-button {
        border: none;
        background: linear-gradient(90deg, rgb(255, 75, 43), rgb(255, 65, 108));
        color: white;
      }
    }
  }

  .listOfListeningSongs {
    height: auto;

    .header {
      display: flex;
      justify-content: space-between;
      justify-items: center;

      .left {
        display: flex;

        p {
          color: #4a4a4a;
          font-size: 14px;
          font-weight: 1000;

          span {
            font-size: 12px;
            color: #666666;
            font-weight: 500;
          }
        }
      }

      .right {
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          height: 13px;
          border-left: 1px solid #999999;
          margin: 0 10px;
        }

        span {
          font-size: 12px;
          color: #666666;
          cursor: pointer;
        }

        .active {
          color: #FA2800;
        }
      }
    }

    button {
      background: linear-gradient(90deg, rgb(255, 75, 43), rgb(255, 65, 108));
      width: 107px;
      height: 33px;
      border: none;
      color: white;
      line-height: 0;
      display: block;
      outline: none;
      border-radius: 15px;
      font-size: 14px;
      float: right;
      margin-top: 20px;
      cursor: pointer;
      margin-bottom: 20px;

      i {
        margin-right: 5px;
        font-size: 12px;
      }
    }

    .singer {
      display: flex;
      justify-content: left;
      align-items: center;

      img {
        margin-right: 10px;
      }
    }

    .album {
      display: -webkit-box; /*将对象转为弹性盒模型展示*/
      -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
      -webkit-line-clamp: 1; /*限制文本行数*/
      overflow: hidden; /*超出隐藏*/
    }

    .playAndPause {
      display: none;
      color: #FA2800;
      cursor: pointer;
    }
  }

  .mySongList {
    padding: 0;

    .fu {
      margin-top: 20px;
    }

    .myCreateSongList {
      position: relative;

      header {
        color: #4a4a4a;
        font-size: 14px;
        font-weight: 1000;
      }
    }
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

.red {
  color: #FA2800;
}
</style>
