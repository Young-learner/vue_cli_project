<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--提示区域-->
      <el-alert title="添加商品的信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条区域-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              expand-trigger="hover" :props="cateProps"
              :options="catelist"
              v-model="addForm.goods_cat"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!--渲染表单的Item项-->
          <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <!--复选框-->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item1.attr_name" v-for="item1 in onlyTableData" :key="item1.attr_id">
            <el-input v-model="item1.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!--action图片上传地址-->
          <el-upload action="uploadURL" :on-preview="handlePreview"
            :on-remove="handleRemove" list-type="picture"
                     :headers="headerObj" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!--富文本编辑器组件-->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <!--添加商品-->
          <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览对话框-->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', tigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', tigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', tigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', tigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类'}
        ]
      },
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res}= await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    // 级联选择器变化函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return true
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.spilt(' ')
        })
        this.manyTableData = res.data
      } else if (this.avtiveIndex === '2') {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态数据失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => {
        x.pic = filePath
      })
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传的事件
    handleSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.vaildate(async vaild => {
        if (!vaild) {
          return this.$message.error('请填写必要的表单项')
        }
        const form = _.cloneDeep(this.addFrom)
        form.goods_cat = this.addForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        const {data: res} = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
      // 确定商品名称唯一
    }
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}

</script>

<style lang="less" scoped>
  .el-checkbox{
    margin: 0 10px 0 0 !important;
  }
  .previewImg{
    width: 100%;
  }
  .btnAdd{
    margin-top: 15px;
  }
</style>
