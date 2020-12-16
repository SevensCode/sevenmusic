<template>
  <div ref="albumList" class="album-list">
    <section v-for="item in albumList" :key="item.id" class="album-item">
      <section class="album-cover">
        <img :onerror="defaultImg" :key="item.id" v-lazy="item.blurPicUrl" alt="">
        <span class="album-stor"><i class="el-icon-caret-right"></i>{{ item.type }}</span>
      </section>
      <section class="album-details">
        <p class="album-name suo1">{{ item.name }}</p>
        <p class="album-author suo1">{{ item.artist.name }}</p>
        <p class="album-cartedTime suo1">{{ item.publishTime | formatYearMonthDay }}</p>
      </section>
    </section>
  </div>
</template>

<script>

export default {
  name: 'Album',
  props: {
    // 专辑列表
    albumList: Array,
    // 列
    column: Number
  },
  data () {
    return {}
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 显示几列
      this.$refs.albumList.style.gridTemplateColumns = 'repeat(' + this.column + ', 185px)'
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/tpwzd.jpg') + '"'
    }
  }
}
</script>

<style lang="less" scoped>
.album-list {
  margin-top: 20px;
  display: grid;
  justify-content: space-between;
  grid-row-gap: 20px;
  align-content: center;

  .album-item {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    position: relative;

    .album-cover {
      width: 100%;
      height: 185px;
      position: relative;
      cursor: pointer;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        transition: 1s;
      }

      .album-stor {
        position: absolute;
        right: 5px;
        top: 5px;
        color: white;
        padding: 1px 5px;
        background-color: black;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .album-details {
      .album-name {
        font-size: 15px;
        color: #4a4a4a;
        font-weight: 600;
        margin-top: 10px;
      }

      .album-author, .album-cartedTime {
        font-size: 12px;
        color: #999999;
        margin-top: 5px;
      }
    }
  }

  .album-cover:hover img {
    transform: scale(1.2);
  }
}
</style>
