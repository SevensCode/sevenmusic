<template>
  <div>
    <section class="container">
      <el-row class="label">
        <el-col :span="2">
          <el-button class="allType" @click="show=!show">
            <span v-if="query.cat===''">全部</span>
            <span v-else>{{ query.cat }}</span>
            <i class="el-icon-arrow-down"></i>
          </el-button>
        </el-col>
        <el-col :span="19" class="tag">
          <span>热门标签：</span>
          <ul>
            <li v-for="item in popularPlaylist" :key="item.id">
              <span @click="allTag(item)">{{ item.name }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="3" class="btn">
          <el-button :class="query.order==='hot'?'active':''" size="mini" @click="getPopularPlaylist">热门</el-button>
          <el-button size="mini" :class="query.order==='new'?'active':''" @click="getTheLatestPlaylist">最新</el-button>
        </el-col>
      </el-row>
      <!-- 全部歌单标签 -->
      <transition name="el-fade-in-linear">
        <el-card v-show="show">
          <ul>
            <li>
              <h1><i :class="'iconfont'+' '+icon[0]"></i>语种</h1>
              <el-tag v-for="item in language" :key="item.id" @click="allTag(item)">{{ item.name }}</el-tag>
            </li>
            <li>
              <h1><i :class="'iconfont'+' '+icon[1]"></i>风格</h1>
              <el-tag v-for="item in style" :key="item.id" @click="allTag(item)">{{ item.name }}</el-tag>
            </li>
            <li>
              <h1><i :class="'iconfont'+' '+icon[2]"></i>场景</h1>
              <el-tag v-for="item in scenes" :key="item.id" @click="allTag(item)">{{ item.name }}</el-tag>
            </li>
            <li>
              <h1><i :class="'iconfont'+' '+icon[3]"></i>情感</h1>
              <el-tag v-for="item in emotion" :key="item.id" @click="allTag(item)">{{ item.name }}</el-tag>
            </li>
            <li>
              <h1><i :class="'iconfont'+' '+icon[4]"></i>主题</h1>
              <el-tag v-for="item in theme" :key="item.id" @click="allTag(item)">{{ item.name }}</el-tag>
            </li>
          </ul>
        </el-card>
      </transition>
      <!-- 主内容区域 -->
      <el-main>
        <!-- 精品歌单标签列表 -->
        <section class="songList container">
          <ul>
            <li v-for="(item,i) in boutiquePlaylist" :key="i">
              <img :src="item.coverImgUrl" alt="">
              <span><i class="el-icon-caret-right"></i> {{ item.playCount }}</span>
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </section>
        <!-- 分页 -->
        <section class="pagination" v-if="total>49">
          <el-pagination
              @current-change="handleCurrentChange"
              :page-size="query.limit"
              background
              layout="total, prev, pager, next, jumper"
              :total=total>
          </el-pagination>
        </section>
      </el-main>
    </section>
  </div>
</template>

<script>
import '@/assets/css/Cart.less'
import '@/assets/css/pagination.less'
export default {
  name: 'SongList',
  data () {
    return {
      // 热门歌单
      popularPlaylist: [],
      // 分类
      categories: [],
      // 语种
      language: [],
      // 风格
      style: [],
      // 场景
      scenes: [],
      // 情感
      emotion: [],
      // 主题
      theme: [],
      // 全部分类显示与隐藏开关
      show: false,
      icon: ['icon-yuyan', 'icon-fengge1', 'icon-kafei', 'icon-zan', 'icon-yifu'],
      // 精选歌单
      boutiquePlaylist: [],
      // 总页数
      total: 10,
      query: {
        // 每页显示条数
        limit: 64,
        // 当前页码
        offset: 0,
        // 默认为热门歌单
        order: 'hot',
        // 歌单标签
        cat: ''
      }
    }
  },
  created () {
    this.getSonglist()
    this.getAllTagList()
  },
  methods: {
    async getSonglist () {
      // 热门歌单标签
      const { data: popularPlaylist } = await this.axios.get('/playlist/hot')
      this.popularPlaylist = popularPlaylist.tags
      // 精品歌单列表
      const { data: boutiquePlaylist } = await this.axios.get('/top/playlist', {
        params: this.query
      })
      boutiquePlaylist.playlists.forEach(item => {
        item.playCount = item.playCount.toString().split('')
        item.playCount = this.str(item.playCount.join(''))
      })
      this.boutiquePlaylist = boutiquePlaylist.playlists
      this.total = boutiquePlaylist.total
    },
    //  获取全部标签
    async getAllTagList () {
      // 全部标签列表
      const { data: res } = await this.axios.get('/playlist/catlist')
      this.categories = res.categories
      res.sub.forEach(item => {
        switch (item.category) {
          case 0:
            this.language.push(item)
            break
          case 1:
            this.style.push(item)
            break
          case 2:
            this.scenes.push(item)
            break
          case 3:
            this.emotion.push(item)
            break
          case 4:
            this.theme.push(item)
            break
        }
      })
    },
    handleCurrentChange (newPage) {
      this.query.offset = (newPage - 1) * 49
      this.getSonglist()
    },
    getPopularPlaylist () {
      this.query.order = 'hot'
      this.getSonglist()
    },
    getTheLatestPlaylist () {
      this.query.offset = 0
      this.query.order = 'new'
      this.getSonglist()
    },
    allTag (item) {
      this.query.cat = item.name
      this.show = false
      this.getSonglist()
    }
  }
}
</script>

<style lang="less" scoped>
.label {
  height: 40px;
  width: 100%;
  background: #F7F7F7;
  border-radius: 5px;

  .allType {
    border-radius: 5px 0 0 5px;
    background: #FA2800;
    color: white;
    border: none;
    width: 105px;
    height: 40px;
    position: relative;

    i {
      margin-left: 10px;
    }
  }

  .tag {
    display: flex;
    justify-content: left;
    align-items: center;
    height: 100%;
    color: #4a4a4a;
    font-size: 14px;
    line-height: 21px;

    ul {
      display: flex;
      height: 100%;
      justify-content: left;
      align-items: center;

      li {
        margin: 0 10px;
        cursor: pointer;
      }

      li:hover {
        color: #FA2800;
      }
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .el-button {
      //color: white;
    }
  }

  .active {
    background: #FA2800;
    color: white;
  }
}

.el-card::-webkit-scrollbar {
  /*滚动条宽高设置*/
  display: none;
}

.el-card {
  position: absolute;
  width: 720px;
  height: 400px;
  z-index: 100;
  overflow: auto;

  li {
    margin-bottom: 20px;

    h1 {
      width: 100%;
      font-size: 15px;
      line-height: 20px;
      margin-bottom: 20px;

      i {
        margin-right: 15px;
        line-height: 20px;
        font-size: 16px;
      }
    }

    .el-tag {
      margin: 5px 10px;
      font-size: 12px;
      color: #161e27;
      background: #F7F7F7;
      text-align: center;
      cursor: pointer;
      border-radius: 15px;
    }
  }
}

.el-main {
  padding: 0;
  margin-top: 20px;
}
</style>
