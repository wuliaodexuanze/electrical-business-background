<template>
  <el-card
    class="users-wrap"
    :body-style="{height:'100%'}"
    v-loading="loading"
    element-loading-text="加载中...">
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
          <el-input
            placeholder="请输入姓名"
            v-model="query"
            clearable
            @clear="searchUser">
            <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            @click="dialogAddFormVisible = true"
            icon="el-icon-user"
            type="primary"
            plain>添加用户</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="body-box">
      <el-table
        :data="userLists"
        border
        height="570"
        class="table-box">
        <el-table-column
          type="index"
          label="#"
          width="80">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="200">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机"
          width="180">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="130">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmtDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleChangeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :hide-after="400" content="编辑" placement="top-start">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                size="mini"
                plain
                circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :hide-after="400" content="删除" placement="top-start">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                size="mini"
                plain
                circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :hide-after="400" content="分配角色" placement="top-start">
              <el-button
                type="success"
                icon="el-icon-setting"
                size="mini"
                plain
                @click="handleAffirm(scope.row)"
                circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加用户" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false">
          <el-form :model="addUserForm" ref="addUserForm" :rules="userInfoRules">
            <el-form-item
              label="用户名"
              label-width="100px"
              :rules="[
                { required: true, message: '用户名不能为空' },
                { min:4, message: '用户名长度不能小于4' },
                { max:32, message: '用户名长度不能大于32' }
              ]"
              prop="username">
              <el-input
                autocomplete="off"
                clearable
                v-model="addUserForm.username"
                placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              label-width="100px"
              :rules="[
                { required: true, message: '密码不能为空' },
                { min:6, message: '密码长度不能小于6' },
                { max:32, message: '密码长度不能大于32' }
              ]"
              prop="password">
              <el-input
                show-password
                autocomplete="off"
                clearable
                v-model="addUserForm.password"
                placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              label-width="100px"
              prop="email"
              :rules="[
                { required: false },
                { type:'email', message: '请输入正确格式的邮箱' }
              ]">
              <el-input
                autocomplete="off"
                clearable
                v-model="addUserForm.email"
                placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号码"
              label-width="100px"
              prop="mobile">
              <el-input
                autocomplete="off"
                v-model="addUserForm.mobile"
                placeholder="请输入手机号码"
                maxlength="11"
                clearable
                show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
          </div>
        </el-dialog>
      <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false">
          <el-form :model="editUserForm" ref="editUserForm" :rules="userInfoRules">
            <el-form-item
              label="用户名"
              label-width="100px">
              <div v-text="editUserForm.username"></div>
            </el-form-item>
            <el-form-item
              label="邮箱"
              label-width="100px"
              prop="email"
              :rules="[
                { required: false },
                { type:'email', message: '请输入正确格式的邮箱' }
              ]">
              <el-input
                autocomplete="off"
                clearable
                v-model="editUserForm.email"
                placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号码"
              label-width="100px"
              prop="mobile">
              <el-input
                autocomplete="off"
                v-model="editUserForm.mobile"
                placeholder="请输入手机号码"
                maxlength="11"
                clearable
                show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
          </div>
        </el-dialog>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogAffirmFormVisible"
        :close-on-click-modal="false">
          <el-form :model="affirmUserForm" ref="affirmUserForm">
            <el-form-item
              label="用户名"
              label-width="100px">
              <div v-text="affirmUserForm.username"></div>
            </el-form-item>
            <el-form-item
              label="角色"
              label-width="100px">
              <el-select
                v-model="affirmUserForm.roleId"
                placeholder="请选择角色">
                <el-option
                  label="请选择"
                  :value="-1">
                </el-option>
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAffirmFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleRoleSubmit('affirmUserForm')">确 定</el-button>
          </div>
        </el-dialog>
      <el-pagination
        class="page-box"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
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
  Pagination,
  Message,
  Loading,
  Switch,
  Tooltip,
  Dialog,
  MessageBox,
  Select,
  Option
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
Vue.use(Loading);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);

export default {
  name: 'users',
  data() {
    const checkMobile = (rule, value = '', callback) => {
      const patt = /^[1]([3-9])[0-9]{9}$/;
      if (value && !(patt.test(value))) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    return {
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      affirmUserForm: {
        id: '',
        username: '',
        roleId: -1
      },
      query: '',
      pagenum: 1,
      pagesizes: [2, 3, 5, 10],
      pagesize: 10,
      total: 0,
      userLists: [],
      loading: true,
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      dialogAffirmFormVisible: false,
      userInfoRules: {
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },
      roles: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    handleRoleSubmit() {
      this.changeRole();
    },
    handleSizeChange(val = 20) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val = 1) {
      this.pagenum = val;
      this.getUserList();
    },
    handleEdit(row) {
      const { id = '', username = '', email = '', mobile = '' } = row;
      if (!(id === '') && username) {
        this.editUserForm.id = id;
        this.editUserForm.username = username;
        this.editUserForm.email = email;
        this.editUserForm.mobile = mobile;
        this.dialogEditFormVisible = true;
      }
    },
    handleDelete(row = {}) {
      const { username = '', id } = row;
      if (username) {
        MessageBox.confirm(`<span>确认是否删除用户名为 <strong style="color: coral;">${username}</strong> 的数据？</span>`, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true;
          this.deleteUser(id);
        });
      }
    },
    handleChangeState(row) {
      const { id, mg_state: mgState } = row;
      if (id) {
        this.changeState(id, mgState);
      }
    },
    searchUser() {
      this.getUserList();
    },
    addUserSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.addUser();
        } else {
          Message.warning('数据格式不符合提交要求,注意检查数据填写数据格式！');
        }
      });
    },
    editUserSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.editUser();
        } else {
          Message.warning('数据格式不符合提交要求,注意检查数据填写数据格式！');
        }
      });
    },
    async changeState(id, type) {
      const ret = await this.$http.put(`users/${id}/state/${type}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.getUserList();
        } else {
          Message.warning(meta.msg);
        }
      } else {
        Message.error('请求错误');
      }
    },
    async getRoleId(id = '') {
      if (id) {
        const ret = await this.$http.get(`users/${id}`);
        this.loading = false;
        const { data: { data, meta }, status } = ret;
        if (status === 200) {
          if (meta.status.toString().startsWith('2')) {
            return data;
          }
          Message.warning(meta.msg);
        } else {
          Message.error('请求错误');
        }
      } else {
        Message.error('用户角色错误');
      }
      return '';
    },
    async getRoles() {
      const ret = await this.$http.get('roles');
      this.loading = false;
      const { data: { data, meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          return data;
        }
        Message.warning(meta.msg);
      } else {
        Message.error('请求错误');
      }
      return [];
    },
    async handleAffirm(row) {
      const { username, id } = row;
      if (username && id) {
        const roles = await this.getRoles();
        const role = await this.getRoleId(id);
        this.roles = roles || [];
        if (role !== '') {
          this.affirmUserForm.id = id;
          this.affirmUserForm.username = username;
          this.affirmUserForm.roleId = role.rid;
          this.dialogAffirmFormVisible = true;
        }
      }
    },
    async changeRole() {
      const { id, roleId } = this.affirmUserForm;
      const ret = await this.$http.put(`users/${id}/role`, { rid: roleId });
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          this.dialogAffirmFormVisible = false;
          Message.success(meta.msg);
          this.affirmUserForm = {};
        } else {
          Message.warning(meta.msg);
        }
      } else {
        Message.error('请求错误');
      }
    },
    async editUser() {
      const { id, ...others } = this.editUserForm;
      const ret = await this.$http.put(`users/${id}`, others);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          this.dialogEditFormVisible = false;
          Message.success(meta.msg);
          this.editUserForm = {};
          this.getUserList();
        } else {
          Message.warning(meta.msg);
        }
      } else {
        Message.error('请求错误');
      }
    },
    async deleteUser(id) {
      const ret = await this.$http.delete(`users/${id}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.pagenum = 1;
          this.getUserList();
        } else {
          Message.warning(meta.msg);
        }
      } else {
        Message.error('请求错误');
      }
    },
    async addUser() {
      const ret = await this.$http.post('users', this.addUserForm);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.getUserList();
          this.dialogAddFormVisible = false;
          this.addUserForm = {};
        } else {
          Message.warning(meta.msg);
        }
      } else {
        Message.error('请求错误');
      }
    },
    async getUserList() {
      const result = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          const { users = [], pagenum = 1, total = 0 } = retData;
          this.userLists = users;
          this.total = total;
          this.pagenum = pagenum;
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
.users-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.users-wrap .search-box {
  margin-top: 15px;
}
.users-wrap .table-box {
  box-sizing: content-box;
}
.users-wrap .page-box {
  padding-top: 20px;
}
</style>
