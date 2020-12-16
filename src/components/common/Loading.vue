<template>
  <div ref="loading" class="loading"><i class="iconfont icon-loading"></i></div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    height: {
      type: String,
      default: '100%'
    }
  },
  mounted () {
    this.editHeight()
  },
  methods: {
    editHeight () {
      this.$refs.loading.style.height = this.height
    }
  },
  watch: {
    height: function () {
      this.editHeight()
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    padding: 10px;
    font-size: 40px;
    color: #FA2800;
    margin-bottom: 60px;
    animation: loading 1s ease-in-out infinite;
  }
}

@keyframes loading {
  to {
    transform: rotateZ(0deg);
  }
  from {
    transform: rotateZ(-720deg);
  }
}
</style>
