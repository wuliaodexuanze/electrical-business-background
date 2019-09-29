<template>
  <el-card
    class="permissions-wrap"
    :body-style="{height:'100%'}"
    v-loading="loading"
    element-loading-text="加载中...">
    <div
      slot="header"
      class="clearfix">
      <bread-crumb :crumbs="crumbs"></bread-crumb>
    </div>
    <div class="body-box">
      <el-table
        :data="permissions"
        border
        height="670"
        class="table-box">
        <el-table-column
          type="index"
          label="#"
          width="80">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          label="层级">
          <template slot-scope="scope">
            {{ levels[scope.row.level] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue';
import {
  Card,
  Table,
  TableColumn,
  Message
} from 'element-ui';

Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);

export default {
  name: 'permissions',
  data() {
    return {
      crumbs: [
        { name: '首页', url: '/' },
        { name: '权限管理', url: '/' },
        { name: '权限列表' }
      ],
      levels: ['一级', '二级', '三级'],
      loading: false,
      permissions: []
    };
  },
  created() {
    this.getPermissions();
  },
  methods: {
    async getPermissions() {
      this.loading = true;
      const result = await this.$http.get('/rights/list');
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
.permissions-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
