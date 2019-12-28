<template>
  <div>
    <!--面包屑区域-->
    <el-breadcrumb separator-cla ss="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <el-row>
        <!--表格-->
        <tree-table :data="catelist" :columns="columns"></tree-table>
        <!--分页区域-->
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据列表
      catelist: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }
      ]
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取所有商品分类
    async getCatelist() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      // 把数据列表赋值
      this.catelist = res.data.result
      // 赋值总条数
      this.total = res.data.total
    }
  }

}
</script>

<style lang="less" scoped>

</style>
