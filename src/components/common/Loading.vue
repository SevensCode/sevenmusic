<template>
  <div class="loading"><i class="iconfont icon-loading"></i></div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="less" scoped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    padding: 10px;
    font-size: 40px;
    color: #11c0fa;
    margin-bottom: 60px;
    animation: loading 0.8s ease-in-out infinite;
  }
}

@keyframes loading {
  to {
    transform: rotateZ(0deg);
  }
  from {
    transform: rotateZ(-360deg);
  }
}
</style>
