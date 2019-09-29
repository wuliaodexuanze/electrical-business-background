<template>
  <el-container class="home-wrap">
    <el-header class="header-box">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple header-left">
            <img src="../../assets/logo.png" height="100%" alt="logo">
          </div>
        </el-col>
        <el-col :span="2" :offset="18">
          <div class="grid-content bg-purple header-right">
            <el-dropdown @command="handleLogout">
              <span class="el-dropdown-link">
                <i class="el-icon-user-solid el-icon--left"></i>
                <span v-text="username"></span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-switch-button">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside-box" width="240px">
        <el-menu
          class="aside-nav"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true">
          <el-submenu
            v-for="(item, index) in permissions"
            :key="item.id"
            :index="index.toString()">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span v-text="item.authName"></span>
            </template>
            <el-menu-item
              v-for="(subItem) in item.children"
              :key="subItem.id"
              :index="subItem.path">
              <i class="el-icon-s-grid"></i>
              <span v-text="subItem.authName"></span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="main-box">
          <router-view></router-view>
        </el-main>
        <el-footer
          class="footer-box">&copy;&nbsp;2019-2019&nbsp;by&nbsp;1169655050@qq.com</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Vue from 'vue';
import {
  Container,
  Header,
  Footer,
  Aside,
  Main,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  MenuItem,
  Submenu,
  Message
} from 'element-ui';

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);

export default {
  name: 'home',
  data() {
    return {
      username: '',
      loading: false,
      permissions: []
    };
  },
  mounted() {
    this.username = localStorage.getItem('business_username');
  },
  created() {
    this.getPermissions();
  },
  methods: {
    handleLogout() {
      localStorage.clear();
      Message.success('退出成功');
      this.$router.push({ name: 'login' });
    },
    async getPermissions() {
      this.loading = true;
      const result = await this.$http.get('menus');
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.permissions = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      } else {
        Message.error('网络请求失败');
      }
    }
  }
};
</script>

<style scoped>
  .home-wrap {
    height: 100%;
  }
  .header-box {
    background-color: #f8f8f8;
  }
  .header-box .header-left {
    height: 60px;
  }
  .header-box .header-right {
    line-height: 60px;
    text-align: center;
  }
  .aside-box {
    float: left;
    overflow: hidden;
    height: 100%;
  }
  .aside-box .aside-nav {
    height: 100%;
    overflow-y: auto;
  }
  .main-box {
    height: 100%;
    overflow: hidden;
    background-color: #e9eef3;
  }
  .footer-box {
    line-height: 60px;
    background-color: #bfc6ce;
    text-align: center;
    color: #666;
  }
</style>
