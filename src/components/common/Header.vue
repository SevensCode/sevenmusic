<template>
  <el-card class="box-card">
    <section class="container">
      <el-row>
        <el-col :span="4">
          <!-- Logo区域 -->
          <section class="logo">
            <img alt="sevenmusic" height="43" src="../../assets/img/logo.png" width="43"/>
            <span>SevenMusic</span>
          </section>
        </el-col>
        <!-- 导航栏区域 -->
        <el-col :span="16" class="menu">
          <router-link :to="{path:'/find'}" active-class="active">发现音乐</router-link>
          <router-link :to="{path:'/leaderboard'}" active-class="active">排行榜</router-link>
          <router-link :to="{path:'/songList'}" active-class="active">歌单</router-link>
          <router-link :to="{path:'/singer'}" active-class="active">歌手</router-link>
          <router-link :to="{path:'/video'}" active-class="active">视频</router-link>
          <router-link :to="{path:'/mv'}" active-class="active">MV</router-link>
        </el-col>
        <el-col :span="4">
          <!-- 搜索登录区域 -->
          <section class="searchAndLogin">
            <i class="el-icon-search" @click="showSearchDialog"></i>
            <div class="line"></div>
            <el-button v-show="noLogin" type="text" @click="login">登录</el-button>
            <!-- 头像 -->
            <el-avatar v-show="hasLogin" :src="user.profile.avatarUrl"></el-avatar>
            <el-dropdown v-show="hasLogin" style="margin-left: 20px" trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{ user.profile.nickname }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link to="/user"><i
                      class="iconfont icon-yonghu"></i>个人中心
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/grade"><i class="iconfont icon-huizhang"></i>我的等级</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/setting"><i class="iconfont icon-shezhi"></i>个人设置</router-link>
                </el-dropdown-item>
                <el-dropdown-item command="signOut" divided><i class="iconfont icon-tuichu"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </section>
        </el-col>
      </el-row>
    </section>
    <transition name="slide-fade">
      <search-dialog v-show="$store.state.searchDialog"></search-dialog>
    </transition>
  </el-card>
</template>

<script>
import SearchDialog from '@/components/common/SearchDialog'

export default {
  name: 'Header',
  components: { 'search-dialog': SearchDialog },
  data () {
    return {
      // 没登录
      noLogin: true,
      // 登录了
      hasLogin: false,
      // 用户的信息
      user: {
        profile: {
          avatarUrl: '../assets/img/logo.png',
          nickname: '默认'
        }
      }
    }
  },
  created () {
    if (window.sessionStorage.getItem('userInfo')) {
      this.noLogin = false
      this.hasLogin = true
      this.user = JSON.parse(window.sessionStorage.getItem('userInfo'))
    }
  },
  methods: {
    // 跳转到登录页面
    login () {
      this.$router.push('/login')
    },
    // 下拉菜单触发的事件
    handleCommand (command) {
      // 退出登录
      if (command === 'signOut') {
        window.sessionStorage.removeItem('userInfo')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('cookie')
        this.noLogin = true
        this.hasLogin = false
        if (window.location.hash === '#/user') {
          return this.$router.push('/find')
        }
        location.reload()
      }
    },
    showSearchDialog () {
      this.$store.commit('showSearchDialog')
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

  .menu {
    display: flex;
    justify-content: left;
    align-items: center;
    height: 70px;
    font-size: 14px;

    a {
      margin: 0 20px;
      line-height: 30px;
      position: relative;
    }
  }

  .active {
    color: #FA2800;
  }

  .active::after {
    display: block;
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background: #FA2800;
    margin-left: -2.5px;
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

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: .5;
  transform: translateY(100%);
}
</style>
