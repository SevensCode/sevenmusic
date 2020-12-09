<template>
  <div class="container singer">
    <ul class="tag">
      <li v-for="(item,i) in areaList" :key="i" :class="areaActive===item.index?'active':''" @click="areaTag(item)">
        {{ item.name }}
      </li>
    </ul>
    <ul class="tag">
      <li v-for="(item,i) in typeList" :key="i" :class="typeActive===item.index?'active':''" @click="typeTag(item)">
        {{ item.name }}
      </li>
    </ul>
    <ul class="tag">
      <li v-for="(item,i) in letterList" :key="i" :class="letterActive===item.name?'active':''"
          @click="letterTag(item)">
        {{ item.name }}
      </li>
    </ul>
    <Singer :column="10" :singer-list="singerList" v-if="!$store.state.loading"></Singer>
    <Loading v-else></Loading>
  </div>
</template>

<script>
import '@/assets/css/common/Tag.less'
import Loading from '@/components/common/Loading'
import { getSingerSortList } from '@/API/server/api'
import Singer from '@/components/common/Singer'

export default {
  name: 'SingerPage',
  components: {
    Loading,
    Singer
  },
  data () {
    return {
      query: {
        // 显示数量
        limit: 30,
        // 地区
        area: -1,
        type: -1,
        // 按首字母索引查找
        initial: -1,
        // 分页
        offset: 0
      },
      // 歌手列表
      singerList: [],
      // 地区列表
      areaList: [{
        name: '全部',
        index: -1
      }, {
        name: '华语',
        index: 7
      }, {
        name: '欧美',
        index: 96
      }, {
        name: '日本',
        index: 8
      }, {
        name: '韩国',
        index: 16
      }, {
        name: '其他',
        index: 0
      }],
      // 歌手类型列表
      typeList: [{
        name: '全部',
        index: -1
      }, {
        name: '男歌手',
        index: 1
      }, {
        name: '女歌手',
        index: 2
      }, {
        name: '乐队',
        index: 3
      }],
      // 字母列表
      letterList:
          [{
            name: '热门',
            index: 1
          }, { name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'I' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'O' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' }, { name: 'Y' }, { name: 'Z' }, {
            name: '其他',
            index: 0
          }],
      // 默认
      areaActive: -1,
      typeActive: -1,
      letterActive: '热门',
      loading: false
    }
  },
  created () {
    this.getPopularSingers()
  },
  methods: {
    async getPopularSingers () {
      const { data: res } = await getSingerSortList(this.query)
      this.singerList = res.artists
      console.log(res)
    },
    // 地区标签
    areaTag (item) {
      this.areaActive = item.index
      this.query.area = item.index
      this.getPopularSingers()
    },
    // 类型标签
    typeTag (item) {
      this.typeActive = item.index
      this.query.type = item.index
      this.getPopularSingers()
    },
    // 字母标签
    letterTag (item) {
      this.letterActive = item.name
      if (item.name === '其他') {
        this.query.initial = -0
        return this.getPopularSingers()
      }
      if (item.name === '热门') {
        this.query.initial = -1
        return this.getPopularSingers()
      }
      this.query.initial = item.name
      this.getPopularSingers()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
