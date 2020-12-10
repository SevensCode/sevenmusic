<template>
  <div ref="singer" class="singer-list">
    <section v-for="item in singerList" :key="item.id" class="singer-item">
      <img :onerror="defaultImg" :src="item.img1v1Url" alt="" @click="openSingerDetails(item.id)">
      <h1 class="singer-name suo1">{{ item.name }}</h1>
      <p v-if="item.musicSize" class="singer-singleCount">单曲数 {{ item.musicSize }}</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Singer',
  props: {
    singerList: Array,
    column: Number
  },
  methods: {
    openSingerDetails (id) {
      if (window.location.hash.slice(0, 15) === '#/singerDetails') {
        this.$router.push({
          path: '/singerDetails',
          query: { id }
        })
        return location.reload()
      }
      this.$router.push({
        path: '/singerDetails',
        query: { id }
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
      this.$refs.singer.style.gridTemplateColumns = 'repeat(' + this.column + ', 108px)'
    }
  }
}
</script>

<style lang="less" scoped>
.singer-list {
  display: grid;
  grid-template-columns: repeat(10, 108px);
  grid-row-gap: 20px;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;

  .singer-item {
    height: 196px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    img {
      width: 108px;
      height: 108px;
      border-radius: 100%;
      cursor: pointer;
    }

    .singer-name {
      font-size: 14px;
      color: #4a4a4a;
      cursor: pointer;
    }

    .singer-singleCount {
      font-size: 12px;
      color: #FA2800;
    }
  }
}
</style>
