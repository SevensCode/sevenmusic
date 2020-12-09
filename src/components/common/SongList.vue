<template>
  <div ref="songlist" class="song-list">
    <section v-for="item in songlist" :key="item.id" class="song-item">
      <section class="song-cover" @click="openSongDetails(item)">
        <img :src="item.picUrl||item.coverImgUrl" alt="" :onerror="defaultImg">
        <span v-if="item.playCount" class="song-playCount">
          <i class="el-icon-caret-right"></i>
          {{ item.playCount | playCount }}
        </span>
      </section>
      <p class="song-name suo2">{{ item.name }}</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songlist: Array,
    column: Number
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$refs.songlist.style.gridTemplateColumns = 'repeat(' + this.column + ', 132.5px)'
    },
    openSongDetails (item) {
      this.$router.push({
        path: '/songDetails',
        query: { id: item.id }
      })
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/defaultImg.png') + '"'
    }
  },
  watch: {
    column: function () {
      this.$refs.songlist.style.gridTemplateColumns = 'repeat(' + this.column + ', 132.5px)'
    }
  }
}
</script>

<style lang="less" scoped>
.song-list {
  margin-top: 20px;
  width: 100%;
  display: grid;
  justify-content: space-between;
  grid-row-gap: 20px;
  align-items: center;

  .song-item {
    border-radius: 3px;
    height: 182.5px;

    .song-cover {
      height: 132.5px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      box-shadow: 0 0 5px black;
      border-radius: 3px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        transition: 1s;
      }

      .song-playCount {
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

    .song-name {
      margin-top: 10px;
      color: #4a4a4a;
      font-size: 14px;
      font-weight: 1000;
    }

    .song-cover:hover img {
      transform: scale(1.1);
    }
  }
}
</style>
