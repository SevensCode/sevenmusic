<template>
  <div>
    <!-- 搜索区域 -->
    <section class="bj">
      <el-input v-model="queryInfo.keywords" placeholder="请输入音乐/MV/歌单/歌手" type="text" @input="search">
        <i slot="suffix" class="el-icon-search search"></i>
      </el-input>
    </section>
    <!-- tab标签栏 -->
    <section class="container searchTab">
      <h1>搜索结果</h1>
      <span v-for="(item,i) in tabsList" :key="i" :class="activeIndex===i?'active':''" @click="tabs(i)">{{
          item
        }}</span>
      <el-button v-if="activeIndex===0"><i class="iconfont icon-bofang1"></i>播放全部</el-button>
    </section>
    <!-- 主内容区域 -->
    <main class="container playlist">
      <!-- 单曲区域 -->
      <section v-if="activeIndex===0">
        <el-table v-if="!$store.state.loading" :data="single" row-class-name="hoverPlay" stripe style="width: 100%">
          <el-table-column align="center" label="序号" width="130">
            <template slot-scope="scope">
              <span class="index">{{ scope.row.index }}</span>
              <i class="el-icon-video-play play"></i>
            </template>
          </el-table-column>
          <el-table-column label="歌曲" prop="name" show-overflow-tooltip width="514">
            <template slot-scope="scope">
              <div class="songmap">
                <img :src="scope.row.al.picUrl" alt="">
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌手" show-overflow-tooltip width="300">
            <template slot-scope="scope">
            <span v-for="(item,i) in scope.row.ar" :key="i">
              <span v-if="scope.row.ar.length===1">{{ item.name }}</span>
              <span v-else-if="scope.row.ar.length>1">
                {{ item.name }}
                <span v-if="item.name===scope.row.ar[scope.row.ar.length - 1].name"></span>
                <span v-else>/</span>
              </span>
            </span>
            </template>
          </el-table-column>
          <el-table-column label="专辑" prop="al.name" show-overflow-tooltip width="300"></el-table-column>
          <el-table-column label="时长" prop="dt"></el-table-column>
        </el-table>
        <Loading v-else></Loading>
      </section>
      <!-- 歌手区域 -->
      <section v-if="activeIndex===1" class="singer">
        <ul v-if="!$store.state.loading" class="singerList">
          <li v-for="item in singer" :key="item.id">
            <img :src="item.img1v1Url" alt="">
            <h2>{{ item.name }}</h2>
          </li>
        </ul>
        <Loading v-else></Loading>
      </section>
      <!-- 专辑区域 -->
      <section v-if="activeIndex===2" class="playlist">
        <ul v-if="!$store.state.loading" class="list">
          <li v-for="(item,i) in album" :key="i">
            <img :src="item.blurPicUrl" alt="">
            <span><i class="el-icon-caret-right"></i> {{ item.type }}</span>
            <h1>{{ item.name }}</h1>
          </li>
        </ul>
        <Loading v-else></Loading>
      </section>
      <!-- 视频区域 -->
      <section v-if="activeIndex===3">
        <ul v-if="!$store.state.loading" class="video">
          <li v-for="(item,i) in video" :key="i">
            <!-- Mv封面 -->
            <img :src="item.coverUrl" alt="">
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
        <ul v-if="!$store.state.loading" class="list">
          <li v-for="(item,i) in songlist" :key="i">
            <img :src="item.coverImgUrl" alt="">
            <span><i class="el-icon-caret-right"></i> {{ item.playCount }}</span>
            <h1>{{ item.name }}</h1>
          </li>
        </ul>
        <Loading v-else></Loading>
      </section>
    </main>
  </div>
</template>

<script>
import '../../assets/css/common/singerList.less'
import '../../assets/css/common/playlist.less'
import '../../assets/css/common/video.less'
import Loading from '@/components/common/Loading/Loading'
import { search } from '@/API/server/api'

export default {
  components: { Loading },
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
      index: 0
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
      let index = 1
      const { data: res } = await search(this.queryInfo)
      if (this.queryInfo.type === 1) {
        res.result.songs.forEach(item => {
          item.index = index++
          const mm = this.tool.formatZero(new Date(item.dt).getMinutes())
          const ss = this.tool.formatZero(new Date(item.dt).getSeconds())
          item.dt = mm + ':' + ss
        })
      }
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
      if (this.queryInfo.type === 1000) {
        res.result.playlists.forEach(item => {
          // 换算播放量
          item.playCount = item.playCount.toString().split('')
          item.playCount = this.tool.formatPlayCount(item.playCount.join(''))
        })
      }
      this.songlist = res.result.playlists
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
    }
  }
}
</script>

<style lang="less" scoped>
.bj {
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

.bj::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(188, 27, 27, 0.2);
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

  .play {
    display: none;
    color: #FA2800;
    cursor: pointer;
  }

  .hoverPlay:hover .play {
    display: block;
  }

  .hoverPlay:hover .index {
    display: none;
  }
}

</style>
