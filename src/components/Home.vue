<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/icon.jpg" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单-->
        <el-menu background-color="#333744" text-color="#fff"
                 active-text-color="#409eef"
                 unique-opened
                 :collapse="isCollapsed"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''"
                      v-for="item in menulist"
                      :key="item.id">
            <!--一级菜单模板-->
            <template slot="title">
              <!--图标-->
              <i :class="iconobj[item.id]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/' + subitem.path"
                          v-for="subitem in item.children"
                          :key="subitem.id"
                          @click="saveNav('/' + subitem.path)">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span>{{ subitem.authName }}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧边栏-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconobj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 默认不折叠菜单
      isCollapsed: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse() {
      // 点击按钮控制菜单的折叠和展开
      this.isCollapsed = !this.isCollapsed
    },
    saveNav(activePath) {
      // 保存链接的激活状态
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
    }
    span{
      margin-left: 15px;
    }
    img{
      height: 60px;
      width: 60px;
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
