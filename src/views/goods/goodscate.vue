<template>
  <el-card
    class="goodscate-wrap"
    :body-style="{height:'100%'}"
    v-loading="loading"
    element-loading-text="加载中...">
    <div
      slot="header"
      class="clearfix">
      <bread-crumb :crumbs="crumbs"></bread-crumb>
      <el-row :gutter="20" class="search-box">
        <el-col :span="2">
          <el-button
            @click="showEditDialog"
            icon="el-icon-circle-plus-outline"
            type="success"
            plain>添加分类</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="body-box">
      <el-table
        :data="categoryList"
        style="width: 100%"
        height="570px"
        row-key="cat_id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          label="属性名称"
          prop="cat_name">
        </el-table-column>
        <el-table-column
          label="级别">
          <template slot-scope="scope">
            <span v-text="cateLevel[scope.row.cat_level]"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否有效">
          <template slot-scope="scope">
            <span v-text="scope.row.cat_deleted ? '无效': '有效'"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="desc">
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
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog
        title="分类添加"
        :visible.sync="dialogGoodscateFormVisible"
        :close-on-click-modal="false">
        <el-form :model="categoryForm" ref="categoryForm">
            <el-form-item
              label="分类名称"
              label-width="120px"
              prop="cat_name"
              :rules="[
                { required: true, message: '分类名称不能为空' }
              ]">
              <el-input
                autocomplete="off"
                clearable
                v-model.trim="categoryForm.cat_name"
                placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item
              v-if="currentType === 'add'"
              label="分类"
              label-width="120px"
              prop="data">
              <el-cascader
                v-model="cateparamsCats"
                :options="cateparamsClassifys"
                :props="cascaderDefaultProps"
                placeholder="请选择分类"
                clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.cat_name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogGoodscateFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addGoodscateSubmit('categoryForm')">确 定</el-button>
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
  Tag,
  Dialog,
  MessageBox,
  Cascader,
  Form,
  FormItem,
  Steps,
  Step,
  Tabs,
  TabPane,
  Select,
  Pagination
} from 'element-ui';

Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Cascader);
Vue.use(Select);
Vue.use(Pagination);

export default {
  name: 'goodscate',
  data() {
    return {
      crumbs: [
        { name: '首页', url: '/' },
        { name: '商品管理', url: '/goods' },
        { name: '商品分类' }
      ],
      loading: false,
      categoryList: [],
      pagenum: 1,
      pagesizes: [20, 30, 50, 100],
      pagesize: 20,
      total: 0,
      categoryForm: {
        cat_name: ''
      },
      cateLevel: ['一级', '二级', '三级'],
      cateparamsCats: [],
      cateparamsClassifys: [],
      cascaderDefaultProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name'
      },
      dialogGoodscateFormVisible: false,
      currentType: 'add'
    };
  },
  created() {
    this.getGoodscateList();
  },
  methods: {
    showEditDialog() {
      this.currentType = 'add';
      this.getCategoryList();
    },
    handleSizeChange(val = 20) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodscateList();
    },
    handleCurrentChange(val = 1) {
      this.pagenum = val;
      this.getGoodscateList();
    },
    handleEdit(row = {}) {
      this.currentType = 'edit';
      const {
        cat_name: catName
      } = row;
      if (catName) {
        this.categoryForm = row;
        this.dialogGoodscateFormVisible = true;
      }
    },
    addGoodscateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.currentType === 'add') {
          let catPid = 0;
          let catLevel = 0;
          if (this.cateparamsCats.length === 1) {
            catPid = this.cateparamsCats[0];
            catLevel = 1;
          } else if (this.cateparamsCats.length === 2) {
            catPid = this.cateparamsCats[1];
            catLevel = 2;
          }
          const reqData = {
            ...this.categoryForm,
            cat_pid: catPid,
            cat_level: catLevel
          };
          this.addCateparams(reqData);
        } else {
          this.updateCateparams();
        }
      });
    },
    handleDelete(row = {}) {
      const { cat_name: catName = '', cat_id: catId = '' } = row;
      if (catName && catId !== '') {
        MessageBox.confirm(`<span>确认是否删除分类名称为 <strong style="color: coral;">${catName}</strong> 的数据？</span>`, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true;
          this.deleteCategory(Number(catId));
        }).catch(() => {});
      }
    },
    editCateparamsSubmit() {
      this.updateParams(Number(this.paramsEditForm.attr_id));
    },
    async editGoods() {
      this.loading = true;
      const result = await this.$http.put(`goods/${this.currentGoodsId}`, this.goodsForm);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { meta: { status: state, msg } } = data;
        if (state.toString().startsWith('2')) {
          Message.success(msg);
          this.clearGoodsForm();
          this.getGoodsList();
        } else {
          Message.warning(msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async getGoodscateList() {
      this.loading = true;
      const result = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          const { result: ret = [], total = 0 } = retData;
          this.categoryList = ret;
          this.total = total;
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async addCateparams(reqData) {
      this.loading = true;
      const result = await this.$http.post('categories', reqData);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { meta } = data;
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.dialogGoodscateFormVisible = false;
          this.$refs['categoryForm'].resetFields();
          this.cateparamsCats.length = 0;
          this.getGoodscateList();
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async updateCateparams() {
      this.loading = true;
      const {
        cat_id: catId,
        cat_name: catName
      } = this.categoryForm;
      const result = await this.$http.put(`categories/${catId}`, { cat_name: catName });
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { meta } = data;
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.dialogGoodscateFormVisible = false;
          this.$refs['categoryForm'].resetFields();
          this.cateparamsCats.length = 0;
          this.getGoodscateList();
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async deleteCategory(attrId) {
      this.loading = true;
      const ret = await this.$http.delete(`categories/${attrId}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.pagenum = 1;
          this.getGoodscateList();
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async getCategoryList() {
      this.loading = true;
      const result = await this.$http.get('categories?type=2');
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.cateparamsClassifys = retData;
          this.dialogGoodscateFormVisible = true;
        } else {
          Message.warning(meta.msg);
        }
      }
    }
  }
};
</script>

<style scoped>
.goodscate-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.goodscate-wrap .search-box {
  margin-top: 15px;
}
.goodscate-wrap  .page-box {
  padding-top: 20px;
}
</style>
