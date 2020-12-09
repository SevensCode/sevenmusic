<template>
  <div ref="mvList" class="mv-list">
    <section v-for="item in mvList" :key="item.id" class="mv-item">
      <section class="mv-cover" @click="openVideoPlayer(item)">
        <img :onerror="defaultImg" :src="item.imgurl16v9||item.cover" alt="">
        <span class="mv-playCount"><i class="el-icon-caret-right"></i>{{ item.playCount | playCount }}</span>
        <section class="mv-mask">
          <span class="mv-author">{{ item.artistName }}</span>
          <span class="mv-playTime">{{ item.duration | playTime }}</span>
        </section>
        <div class="mv-playBtn"><i class="el-icon-caret-right"></i></div>
      </section>
      <p class="mv-name suo1">{{ item.name }}</p>
    </section>
  </div>
</template>

<script>

export default {
  name: 'MvList',
  props: {
    mvList: Array,
    column: Number
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$refs.mvList.style.gridTemplateColumns = 'repeat(' + this.column + ', 315px)'
    },
    // 打开播放视频页面
    openVideoPlayer (item) {
      this.$router.push({
        path: '/videoDetails',
        query: { id: item.id }
      })
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/defaultImg.png') + '"'
    }
  }
}
</script>

<style lang="less" scoped>
.mv-list {
  display: grid;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  .mv-item {
    height: 239px;
    border-radius: 3px;

    .mv-cover {
      height: 177px;
      position: relative;
      cursor: pointer;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        transition: 1s;
      }

      .mv-playCount {
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

      .mv-mask {
        width: 100%;
        position: absolute;
        bottom: 0;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 35px;
        background: rgba(0, 0, 0, .6);

        .mv-author, .mv-playTime {
          font-size: 14px;
          color: white;
        }
      }

      .mv-playBtn {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 32px;
        height: 32px;
        margin-top: -16px;
        margin-left: -16px;
        background-color: #FA2800;
        text-align: center;
        border-radius: 100%;
        display: none;

        i {
          color: white;
          font-size: 22px;
          line-height: 32px;
        }
      }

      video {
        width: 100%;
        height: 100%;
      }
    }

    .mv-cover:hover .mv-playBtn {
      display: block;
    }

    .mv-name {
      margin-top: 10px;
      font-size: 14px;
      color: #4a4a4a;
    }
  }

  .mv-cover:hover img {
    transform: scale(1.2);
  }
}
</style>
