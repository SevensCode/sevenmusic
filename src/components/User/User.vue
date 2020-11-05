<template>
  <div>用户</div>
</template>

<script>
export default {
  name: 'User',
  created () {
    console.log(this.$route.query.userInfo)
  }
}
</script>

<style scoped>

</style>
