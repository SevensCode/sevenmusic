<template>
    <div class="searchDialog">
      <div @click="$store.commit('hideSearchDialog')"></div>
      <section class="rong">
        <section class="search">
          <label>
            <input v-model="keywords" placeholder="请输入关键字并按回车即可搜索..." type="text" @keyup.enter="search">
          </label>
        </section>
        <section v-if="searchHistoryList.length!==0" class="popularSearch">
          <header>
            <p><i class="iconfont icon-jiaoyin"></i>搜索历史</p>
            <el-tag v-for="(item,i) in searchHistoryList" :key="i" closable @click="hotSearch(item)"
                    @close="removeTag(i)">
              {{ item }}
            </el-tag>
          </header>
        </section>
        <section class="popularSearch">
          <header>
            <p><i class="iconfont icon-huo"></i>热门搜索</p>
            <el-tag v-for="(item,i) in hotSearchList" :key="i" @click="hotSearch(item.first)">{{
                item.first
              }}
            </el-tag>
          </header>
        </section>
      </section>
    </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  name: 'SearchDialog',
  data () {
    return {
      // 搜索对话框是否显示
      // 搜索关键字
      keywords: '',
      // 热搜列表
      hotSearchList: [],
      searchHistoryList: []
    }
  },
  created () {
    this.getHotSearchList()
    if (window.localStorage.getItem('searchHistoryList')) {
      this.searchHistoryList = window.localStorage.getItem('searchHistoryList').split(',')
    }
    if (this.searchHistoryList.length === 0) {
      window.localStorage.removeItem('searchHistoryList')
    }
  },
  methods: {
    async getHotSearchList () {
      const { data: hotSearchList } = await axios.get('/search/hot')
      this.hotSearchList = hotSearchList.result.hots
    },
    search () {
      this.addSearchList(this.keywords)
      this.$store.commit('hideSearchDialog')
    },
    hotSearch (keywords) {
      this.$store.commit('hideSearchDialog')
      this.addSearchList(keywords)
    },
    removeTag (index) {
      if (this.searchHistoryList.length === 0) {
        return window.localStorage.removeItem('searchHistoryList')
      }
      this.searchHistoryList.splice(index, 1)
      window.localStorage.setItem('searchHistoryList', this.searchHistoryList)
    },
    addSearchList (keywords) {
      let flog = true
      this.searchHistoryList.forEach(item => {
        if (item === keywords) {
          flog = false
        }
      })
      if (flog) {
        this.searchHistoryList.push(keywords)
        window.localStorage.setItem('searchHistoryList', this.searchHistoryList)
        window.sessionStorage.setItem('search', keywords)
        this.$router.push('/search')
      } else {
        window.sessionStorage.setItem('search', keywords)
        this.$router.push('/search')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.searchDialog {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  background: rgba(120, 129, 147, .22);
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

  .rong {
    z-index: 100003;
    width: 790px;
    height: auto;
    border-radius: 5px;
    background: white;

    .search {
      height: 200px;
      width: 100%;
      background-image: url("../../../assets/img/personal.jpg");
      background-position: top center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      position: relative;
      border-radius: 5px 5px 0 0;

      input {
        width: 600px;
        text-align: center;
        height: 40px;
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 0 15px;
        position: relative;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.3);
        color: white;
        font-size: 13px;
      }

      input::placeholder {
        color: white;
      }
    }

    .search::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background: inherit;
      position: absolute;
      left: 0;
      top: 0;
      filter: blur(6px);
    }

    .popularSearch {
      background: white;
      border-radius: 5px;
      width: 100%;

      header {
        margin: 20px 30px;

        p {
          color: #4a4a4a;
          font-size: 15px;

          i {
            color: #FA2800;
            font-size: 22px;
            margin-right: 8px;
          }

          margin-bottom: 15px;
        }

        .el-tag {
          margin: 5px;
          cursor: pointer;
          color: #6d7685;
          background: #f4f4f5;
        }
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
