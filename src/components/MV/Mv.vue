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
    <!-- MV列表 -->
    <ul v-if="!$store.state.loading" class="video">
      <li v-for="(item,i) in mvList" :key="i" @click="openVideoPlayer(item)">
        <!-- Mv封面 -->
        <img :src="item.cover" alt="">
        <!-- 播放量 -->
        <span class="playVolume"><i class="el-icon-caret-right"></i>{{ item.playCount }}</span>
        <!-- 遮罩 -->
        <section class="mask">
          <!-- 作者 -->
          <span class="author">{{ item.artistName }}</span>
          <!-- 视频时间 -->
          <span class="time">{{ item.duration }}</span>
        </section>
        <!-- 标题 -->
        <p>{{ item.name }}</p>
        <el-button circle><i class="el-icon-caret-right"></i></el-button>
      </li>
    </ul>
    <Loading v-else></Loading>
  </div>
</template>

<script>
import '@/assets/css/common/Tag.less'
import '@/assets/css/common/video.less'
import Loading from '@/components/common/Loading/Loading'
import tool from '@/utils/tool'
import { getAllMv } from '@/API/server/api'

export default {
  name: 'Mv',
  components: { Loading },
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
      orderActive: '上升最快'
    }
  },
  created () {
    this.getMvList()
  },
  methods: {
    async getMvList () {
      const { data: res } = await getAllMv(this.query)
      res.data.forEach(item => {
        // 补0
        const mm = tool.formatZero(new Date(item.duration).getMinutes())
        const ss = tool.formatZero(new Date(item.duration).getSeconds())
        item.duration = mm + ':' + ss
        // 换算播放量
        item.playCount = item.playCount.toString().split('')
        item.playCount = tool.formatPlayCount(item.playCount.join(''))
      })
      this.mvList = res.data
      console.log(res)
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
        path: '/videoDeatils',
        query: { id: item.id }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
