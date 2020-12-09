<template>
  <div class="pagination">
    <el-pagination
        :page-size="limit"
        :total=total
        background
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pager',
  props: {
    limit: Number,
    total: Number,
    handleCurrentChange: Function
  }
}
</script>

<style lang="less">
.pagination {
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
