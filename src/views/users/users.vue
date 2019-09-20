<template>
  <el-card
    class="users-wrap"
    :body-style="{height:'100%'}">
    <div
      slot="header"
      class="clearfix">
      <el-breadcrumb>
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20" class="search-box">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-user" type="primary" plain>添加用户</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="body-box">
      <el-table
        :data="tableData"
        border
        height="600"
        class="table-box">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="address"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="用户状态"
          width="80">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
        </el-table-column>
      </el-table>
      <el-pagination
        class="page-box"
        background
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="1000">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue';
import {
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Input,
  Button,
  Row,
  Col,
  Table,
  TableColumn,
  Pagination
} from 'element-ui';

Vue.use(Card);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

export default {
  name: 'users',
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const AUTH_TOKEN = localStorage.getItem('business_token');
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      const result = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(result);
    }
  }
};
</script>

<style scoped>
.users-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.users-wrap .search-box {
  margin-top: 15px;
}
.users-wrap .page-box {
  padding-top: 20px;
}
</style>
