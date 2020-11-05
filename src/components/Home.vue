<template>
  <div v-cloak>
    <!-- 头部 -->
    <el-card class="box-card">
      <section class="container">
        <el-row>
          <el-col :span="4">
            <!-- Logo区域 -->
            <section class="logo">
              <img src="../assets/img/logo.png" height="43" width="43" alt="sevenmusic"/>
              <span>SevenMusic</span>
            </section>
          </el-col>
          <!-- 导航栏区域 -->
          <el-col :span="16">
            <el-menu v-cloak :default-active="defaultActive" text-color="#161e27" active-text-color="#fa2800"
                     mode="horizontal"
                     @select="selectMenu">
              <el-menu-item :index="item.name" :key="i" v-for="(item,i) in menuList">
                {{ item.name }}
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="4">
            <!-- 搜索登录区域 -->
            <section class="searchAndLogin">
              <i class="el-icon-search" @click="searchShow=true"></i>
              <div class="line"></div>
              <el-button type="text" @click="login" v-show="noLogin">登录</el-button>
              <!-- 头像 -->
              <el-avatar v-show="hasLogin" :src="user.avatarUrl"></el-avatar>
              <el-dropdown trigger="click" v-show="hasLogin" @command="handleCommand">
                  <span class="el-dropdown-link">{{ user.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="center"><i class="iconfont icon-yonghu"></i>个人中心</el-dropdown-item>
                  <el-dropdown-item command="grade"><i class="iconfont icon-huizhang"></i>我的等级</el-dropdown-item>
                  <el-dropdown-item command="setUp"><i class="iconfont icon-shezhi"></i>个人设置</el-dropdown-item>
                  <el-dropdown-item command="signOut" divided><i class="iconfont icon-tuichu"></i>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </section>
          </el-col>
        </el-row>
      </section>
    </el-card>
    <!-- 主内容 -->
    <el-main>
      <router-view></router-view>
    </el-main>
    <!-- 底部 -->
    <footer class="footer">
      <div>
        <p><span>SevenMusic</span></p>
        <p class="content">sevenmusic</p>
        <i>1</i>
        <i>2</i>
      </div>
    </footer>
    <!--返回顶部 -->
    <el-backtop :bottom="100" :right="25">
      <i class="iconfont icon-yinle" style="color: #FA2800"></i>
    </el-backtop>
    <!-- 搜索弹出框 -->
    <transition name="slide-fade">
      <div class="searchDialog" v-if="searchShow">
        <div @click.stop="searchShow=false"></div>
        <section>
          <section class="search">
            <label>
              <input type="text" v-model="searchContent">
            </label>
          </section>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [{
        name: '发现音乐'
      }, {
        name: '排行榜'
      }, {
        name: '歌单'
      }, {
        name: '歌手'
      }, {
        name: '视频'
      }, {
        name: 'MV'
      }],
      path: 1,
      defaultActive: '发现音乐', // 默认激活的导航项
      // 没登录了
      noLogin: true,
      // 登录了
      hasLogin: false,
      // 用户的信息
      user: {
        avatarUrl: '../assets/img/logo.png',
        nickname: ''
      },
      // 搜索对话框是否显示
      searchShow: false,
      searchContent: ''
    }
  },
  created () {
    switch (window.location.hash) {
      case '#/find':
        this.defaultActive = '发现音乐'
        break
      case '#/leaderboard':
        this.defaultActive = '排行榜'
        break
      case '#/songlist':
        this.defaultActive = '歌单'
        break
      case '#/singer':
        this.defaultActive = '歌手'
        break
      case '#/video':
        this.defaultActive = '视频'
        break
      case '#/mv':
        this.defaultActive = 'MV'
    }
    if (window.sessionStorage.getItem('token')) {
      this.noLogin = false
      this.hasLogin = true
      this.user = this.$route.query.user
      this.user = JSON.parse(this.user)
    }
  },
  methods: {
    selectMenu (name) {
      switch (name) {
        case '发现音乐':
          this.$router.push({
            path: '/find',
            query: { user: JSON.stringify(this.$route.query.user) }
          })
          break
        case '排行榜':
          this.$router.push({
            path: '/leaderboard',
            query: { user: JSON.stringify(this.$route.query.user) }
          })
          break
        case '歌单':
          this.$router.push({
            path: '/songlist',
            query: { user: JSON.stringify(this.$route.query.user) }
          })
          break
        case '歌手':
          this.$router.push({
            path: '/singer',
            query: { user: JSON.stringify(this.$route.query.user) }
          })
          break
        case '视频':
          this.$router.push({
            path: '/video',
            query: { user: JSON.stringify(this.$route.query.user) }
          })
          break
        case 'MV':
          this.$router.push({
            path: '/mv',
            query: { user: JSON.stringify(this.$route.query.user) }
          })
          break
      }
    },
    // 跳转到登录页面
    login () {
      this.$router.push('/login')
    },
    // 下拉菜单触发的事件
    handleCommand (command) {
      switch (command) {
        case 'center':
          this.$router.push({
            path: '/user',
            query: { userInfo: JSON.stringify(this.user) }
          })
          break
        case 'signOut':// 退出登录
          window.sessionStorage.removeItem('token')
          this.noLogin = true
          this.hasLogin = false
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  user-select: none;

  .el-row {
    padding: 0 20px;
  }

  .logo {
    font-size: 20px;
    height: inherit;
    position: relative;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }

    span {
      height: 70px;
      line-height: 70px;
      position: relative;
      margin-left: 5px;
      font-weight: 1000;
      user-select: none;
    }
  }

  .el-menu {
    float: left;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .searchAndLogin {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;

    i {
      cursor: pointer;
      font-size: 18px;
    }

    .line {
      margin: 0 20px;
      border-left: 1px #e1e1e1 solid;
      height: 22px;
    }

    .el-button {
      color: #4a4a4a;
      font-size: 14px;
    }

    .el-button:hover {
      color: #FA2800;
    }
  }
}

.footer {
  width: 100%;
  height: 250px;
  background: #161e27;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 90%;
    height: 150px;

    .content {
      color: #6d7685;
      margin: 20px 0;
    }
  }
}

.el-avatar {
  margin-right: 15px;
}

.searchDialog {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  //background-image: url("../assets/img/loginBj.jpg");
  //background-size: cover;
  //background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100002;
  }

  section {
    position: relative;
    z-index: 100003;
    width: 790px;
    height: 350px;
    border-radius: 5px;

    .search {
      height: 50%;
      width: 100%;
      background-image: url("../assets/img/searchBj.jpg");
      background-position: center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;

      input {
        width: 300px;
        height: 40px;
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 0 15px;
      }
    }
  }
}

.searchDialog:after {
  content: "";
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  filter: blur(15px); /*为了模糊更明显，调高模糊度*/
  z-index: 10001;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  //transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to .slide-fade-leave-active {
  transition: all 1s;
  transform: translateY(10px);
}

</style>
