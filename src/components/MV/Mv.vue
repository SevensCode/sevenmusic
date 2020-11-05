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
    <ul class="MV">
      <li v-for="(item,i) in mvList" :key="i">
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
  </div>
</template>

<script>
import '@/assets/css/Tag.less'

export default {
  name: 'Mv',
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
      const { data: res } = await this.axios.get('/mv/all', { params: this.query })
      res.data.forEach(item => {
        // 换算mv时长
        const mm = this.doubleDate(new Date(item.duration).getMinutes())
        const ss = this.doubleDate(new Date(item.duration).getSeconds())
        item.duration = mm + ':' + ss
        // 换算播放量
        item.playCount = item.playCount.toString().split('')
        item.playCount = this.str(item.playCount.join(''))
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
    doubleDate (n) {
      if (n < 10) {
        return '0' + n
      } else {
        return n
      }
    }
  }
}
</script>

<style lang="less" scoped>
.MV {
  display: grid;
  grid-template-columns: repeat(4, 315px);
  grid-column-gap: 40px;
  justify-content: left;
  justify-items: center;
  margin-top: 20px;

  li {
    width: 100%;
    height: 176px;
    border-radius: 5px;
    position: relative;
    margin-bottom: 60px;

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      border-radius: 5px;
    }

    .playVolume {
      font-size: 12px;
      color: white;
      background: black;
      padding: 5px 10px;
      position: absolute;
      right: 5px;
      top: 5px;
      border-radius: 10px;
    }

    .mask {
      width: 100%;
      height: 35px;
      position: absolute;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
      font-size: 14px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    }

    p {
      position: absolute;
      left: 0;
      bottom: -30px;
      font-size: 14px;
      color: #4a4a4a;
      display: -webkit-box; /*将对象转为弹性盒模型展示*/
      -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
      -webkit-line-clamp: 1; /*限制文本行数*/
      overflow: hidden; /*超出隐藏*/
    }

    .el-button {
      background: #FA2800;
      width: 32px;
      height: 32px;
      color: white;
      border: none;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -16px;
      margin-left: -16px;
      font-size: 22px;
      display: none;

      i {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -12px;
        margin-left: -12px;
      }
    }
  }

  li:hover .el-button {
    display: block;
  }
}
</style>
