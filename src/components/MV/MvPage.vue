<template>
  <div class="container">
    <ul class="tag">
      <li v-for="(item,i) in areaList" :key="i" :class="areaActive===item?'active':''"
          @click="areaTag(item)">
        {{ item }}
      </li>
    </ul>
    <ul class="tag">
      <li v-for="(item,i) in typeList" :key="i" :class="typeActive===item?'active':''"
          @click="typeTag(item)">
        {{ item }}
      </li>
    </ul>
    <ul class="tag">
      <li v-for="(item,i) in orderList" :key="i" :class="orderActive===item?'active':''"
          @click="orderTag(item)">
        {{ item }}
      </li>
    </ul>
    <MvList v-if="!$store.state.loading&&isShow" :mv-list="mvList" :column="4"></MvList>
    <Loading v-else></Loading>
  </div>
</template>

<script>
import '@/assets/css/common/Tag.less'
import Loading from '@/components/common/Loading'
import { getAllMv } from '@/API/server/api'
import MvList from '@/components/common/MvList'

export default {
  name: 'Mv',
  components: {
    Loading,
    MvList
  },
  data () {
    return {
      mvList: [],
      query: {
        // 地区
        area: '',
        // 类型
        type: '',
        order: '',
        limit: 30
      },
      areaList: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      typeList: ['全部', '官方版', '原生', '现场版', '网易出品'],
      orderList: ['上升最快', '最热', '最新'],
      areaActive: '全部',
      typeActive: '全部',
      orderActive: '上升最快',
      isShow: false
    }
  },
  async mounted () {
    await this.getMvList()
    this.isShow = true
  },
  methods: {
    async getMvList () {
      const { data: res } = await getAllMv(this.query)
      this.mvList = res.data
    },
    areaTag (item) {
      this.areaActive = item
      this.query.area = item
      this.getMvList()
    },
    typeTag (item) {
      this.typeActive = item
      this.query.type = item
      this.getMvList()
    },
    orderTag (item) {
      this.orderActive = item
      this.query.order = item
      this.getMvList()
    },
    openVideoPlayer (item) {
      this.$router.push({
        path: '/videoDetails',
        query: { id: item.id }
      })
    }
  }
}
</script>

<style scoped>
</style>
