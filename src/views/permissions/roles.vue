<template>
  <el-card
    class="roles-wrap"
    :body-style="{height:'100%'}"
    v-loading="loading"
    element-loading-text="加载中...">
    <div
      slot="header"
      class="clearfix">
      <bread-crumb :crumbs="crumbs"></bread-crumb>
      <el-button
        class="add-role-btn"
        icon="el-icon-circle-plus-outline"
        type="primary"
        @click="dialogAddRoleFormVisible = true">添加角色</el-button>
    </div>
    <div class="body-box">
      <el-table
        :data="roleList"
        height="610"
        class="table-box">
        <el-table-column
          type="expand"
          width="60">
          <template slot-scope="scope">
            <el-row
              v-for="(item1) in scope.row.children"
              :key="item1.id"
              class="list-item">
              <el-col :span="3">
                <el-tag
                  closable
                  @close="handleDeletePermission(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="21">
                <el-row
                  v-for="(item2) in item1.children"
                  :key="item2.id"
                  class="role-item">
                  <el-col :span="3">
                    <el-tag
                      type="success"
                      closable
                      @close="handleDeletePermission(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="21">
                    <el-tag
                      class="tag-item"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="handleDeletePermission(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div v-if="scope.row.children.length === 0">
              <span class="tip-text">未分配权限</span>
              <el-button
                type="success"
                icon="el-icon-setting"
                size="mini"
                @click="handleShowEditRolesDialog(scope.row)"
                round>点击分配权限</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="210">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="210">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :hide-after="400" content="编辑" placement="top-start">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                plain
                @click="showEditRoleDialog(scope.row)"
                circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :hide-after="400" content="删除" placement="top-start">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                plain
                @click="handleDeleteRole(scope.row)"
                circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :hide-after="400" content="分配权限" placement="top-start">
              <el-button
                type="success"
                icon="el-icon-setting"
                size="mini"
                plain
                @click="handleShowEditRolesDialog(scope.row)"
                circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加用户"
        :visible.sync="dialogAddRoleFormVisible"
        :close-on-click-modal="false">
          <el-form :model="addRoleForm" ref="addRoleForm" :rules="addRoleRules">
            <el-form-item
              label="角色名"
              label-width="100px"
              prop="roleName">
              <el-input
                autocomplete="off"
                clearable
                v-model="addRoleForm.roleName"
                placeholder="请输入角色名"></el-input>
            </el-form-item>
            <el-form-item
              label="权限描述"
              label-width="100px">
              <el-input
                autocomplete="off"
                clearable
                v-model="addRoleForm.roleDesc"
                placeholder="请输入权限描述"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddRoleFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoleSubmit('addRoleForm')">确 定</el-button>
          </div>
        </el-dialog>
      <el-dialog
        title="配置权限"
        :visible.sync="dialogEditRolesVisible"
        :close-on-click-modal="false"
        @closed="closeDialogEditRoles">
        <div class="ckeck-roles">
          <el-tree
            ref="rolesTree"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys"
            show-checkbox>
          </el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateRoles">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="编辑权限"
        :visible.sync="dialogEditRoleFormVisible"
        :close-on-click-modal="false">
        <el-form :model="editRoleForm" ref="editRoleForm">
          <el-form-item
            label="角色名"
            label-width="100px">
            <div v-text="editRoleForm.roleName"></div>
          </el-form-item>
          <el-form-item
            label="角色描述"
            label-width="100px">
            <el-input
              autocomplete="off"
              clearable
              v-model="editRoleForm.roleDesc"
              placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditRoleFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleSubmit('editRoleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue';
import {
  Card,
  Table,
  TableColumn,
  Button,
  Tooltip,
  Message,
  Row,
  Col,
  Tag,
  Dialog,
  Tree,
  MessageBox
} from 'element-ui';

Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Tree);

export default {
  name: 'roles',
  data() {
    return {
      crumbs: [
        { name: '首页', url: '/' },
        { name: '权限管理', url: '/roles' },
        { name: '角色列表' }
      ],
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      permissions: [],
      roleList: [],
      dialogEditRolesVisible: false,
      treeData: [],
      currentRoleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      dialogEditRoleFormVisible: false,
      dialogAddRoleFormVisible: false
    };
  },
  created() {
    this.getRoleList();
    this.getPermissions();
  },
  methods: {
    expandedList(data = []) {
      const li = [];
      function addExpandedId(arr) {
        arr.forEach((item) => {
          li.push(item.id);
          if (item.children && item.children.length > 0) {
            addExpandedId(item.children);
          }
        });
      }
      addExpandedId(data);
      return li;
    },
    checkedList(data) {
      const li = [];
      function addCheckedId(arr) {
        arr.forEach((item) => {
          if (!item.children || item.children.length === 0) {
            li.push(item.id);
          } else {
            addCheckedId(item.children);
          }
        });
      }
      addCheckedId(data);
      return li;
    },
    closeDialogEditRoles() {
      this.treeData = [];
    },
    addRoleSubmit() {
      this.addRole();
    },
    editRoleSubmit() {
      this.updateRoleInfo();
    },
    handleDeletePermission(role, permissionId) {
      this.deletePermission(role, permissionId);
    },
    showEditRoleDialog(row) {
      const { id, roleName, roleDesc } = row;
      if (roleName) {
        this.editRoleForm.id = id;
        this.editRoleForm.roleName = roleName;
        this.editRoleForm.roleDesc = roleDesc;
        this.dialogEditRoleFormVisible = true;
      }
    },
    handleDeleteRole(row = {}) {
      const { roleName = '', id } = row;
      if (roleName) {
        MessageBox.confirm(`<span>确认是否删除角色名为 <strong style="color: coral;">${roleName}</strong> 的数据？</span>`, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true;
          this.deleteRole(id);
        }).catch(() => {});
      }
    },
    handleUpdateRoles() {
      const checkedKeys = this.$refs.rolesTree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.rolesTree.getHalfCheckedKeys();
      const ridsStr = [...checkedKeys, ...halfCheckedKeys].join(',');
      this.updateRoles(ridsStr);
    },
    handleShowEditRolesDialog(row = {}) {
      const { id, children } = row;
      this.treeData = this.permissions;
      this.currentRoleId = id;
      this.defaultExpandedKeys = this.expandedList(children);
      this.defaultCheckedKeys = this.checkedList(children);
      this.dialogEditRolesVisible = true;
    },
    async getRoleList() {
      this.loading = true;
      const result = await this.$http.get('roles');
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.roleList = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async deletePermission(role = {}, permissionId) {
      const row = role;
      this.loading = true;
      const result = await this.$http.delete(`roles/${row.id}/rights/${permissionId}`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          row.children = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async getPermissions() {
      this.loading = true;
      const result = await this.$http.get('rights/tree');
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
      }
    },
    async updateRoles(rids) {
      if (this.currentRoleId) {
        this.loading = true;
        const result = await this.$http.post(`roles/${this.currentRoleId}/rights`, { rids });
        this.loading = false;
        const { data, status } = result;
        if (status === 200) {
          const { meta } = data;
          if (meta.status.toString().startsWith('2')) {
            this.dialogEditRolesVisible = false;
            Message.success(meta.msg);
            this.getRoleList();
          } else {
            Message.warning(meta.msg);
            this.$router.push({ name: 'login' });
          }
        }
      }
    },
    async addRole() {
      this.loading = true;
      const ret = await this.$http.post('roles', this.addRoleForm);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.getRoleList();
          this.dialogAddRoleFormVisible = false;
          this.addRoleForm = {};
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async deleteRole(id) {
      this.loading = true;
      const ret = await this.$http.delete(`roles/${id}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.getRoleList();
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async updateRoleInfo() {
      const { id, ...others } = this.editRoleForm;
      this.loading = true;
      const ret = await this.$http.put(`roles/${id}`, others);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          this.dialogEditRoleFormVisible = false;
          Message.success(meta.msg);
          this.editUserForm = {};
          this.getRoleList();
        } else {
          Message.warning(meta.msg);
        }
      }
    }
  }
};
</script>

<style scoped>
  .roles-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .roles-wrap .add-role-btn {
    margin-top: 20px;
  }
  .roles-wrap .list-item {
    margin-bottom: 10px;
  }
  .roles-wrap .list-item:last-child {
    margin-bottom: 0;
  }
  .roles-wrap .role-item {
    margin-bottom: 4px;
  }
  .roles-wrap .role-item:last-child {
    margin-bottom: 0;
  }
  .roles-wrap .tag-item {
    margin-right: 3px;
  }
  .roles-wrap .tag-item:last-child {
    margin-right: 0;
  }
  .roles-wrap .tip-text {
    margin-right: 10px;
    vertical-align: middle;
  }
  .roles-wrap .ckeck-roles {
    height: 400px;
    overflow-y: auto;
  }
</style>
