<template>
  <div class="container">
    <section class="tag">
      <el-button class="allTag">全部 <i class="el-icon-arrow-down"></i></el-button>
      <section class="sortList">
        <span class="hotSort">热门分类：</span>
        <span v-for="item in videoCategoryList" :key="item.id">{{ item.name }}</span>
      </section>
    </section>
  </div>
</template>

<script>
import { getAListOfVideoCategories, getAListOfVideoTags, getAllVideoList } from '@/API/server/api'

export default {
  name: 'VideoList',
  data () {
    return {
      // 全部标签列表
      allTagList: [],
      // 视频分类列表
      videoCategoryList: [],
      cookie: window.sessionStorage.getItem('cookie'),
      // 全部视频分页 offset
      allOffset: 0
    }
  },
  async mounted () {
    await this.getAllVideoTag()
    await this.getVideoStorList()
    await this.getAllVideoLlist()
  },
  methods: {
    // 获取全部标签列表
    async getAllVideoTag () {
      const { data: res } = await getAListOfVideoTags()
      this.allTagList = res.data
    },
    // 获取视频分类列表
    async getVideoStorList () {
      const { data: res } = await getAListOfVideoCategories({ cookie: this.cookie })
      this.videoCategoryList = res.data
    },
    async getAllVideoLlist () {
      const { data: res } = await getAllVideoList({
        cookie: this.cookie,
        limit: 50
      })
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.tag {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  background: #F7F7F7;
  border-radius: 3px;

  .allTag {
    width: 105px;
    height: 100%;
    background: #FA2800;
    color: white;
    border: none;
    outline: none;
    border-radius: inherit;
  }

  .sortList {
    .hotSort {
      margin-left: 10px;
      cursor: default;
    }
    span {
      margin: 0 10px;
      cursor: pointer;
      font-size: 14px;
      color: #4a4a4a;
    }
  }
}
</style>
