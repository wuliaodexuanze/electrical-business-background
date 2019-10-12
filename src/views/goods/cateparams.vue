<template>
  <el-card
    class="cateparams-wrap"
    :body-style="{height:'100%'}"
    v-loading="loading"
    element-loading-text="加载中...">
    <div
      slot="header"
      class="clearfix">
      <bread-crumb :crumbs="crumbs"></bread-crumb>
      <el-alert
        class="info-text"
        title="只允许为第三级分类设置参数"
        type="warning"
        :closable="false">
      </el-alert>
      <el-form>
        <el-form-item style="margin-bottom: 0;"
          label="商品分类">
          <el-cascader
            v-model="cateparamsCats"
            :options="cateparamsClassifys"
            :props="cateparamsClassifyDefaultProps"
            :show-all-levels="false"
            placeholder="请选择分类"
            clearable
            @change="handleCategory">
            <template slot-scope="{ node, data }">
              <span>{{ data.cat_name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-box">
      <div v-show="showParams">
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            plain
            @click="dialogCateparamsFormVisible = true">添加动态参数</el-button>
            <el-table
              :data="cateparamsTrendsParmas"
              style="width: 100%"
              height="520px">
              <el-table-column type="expand" label="#">
                <template slot-scope="props">
                  <el-tag
                    :key="tag"
                    v-for="tag in props.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleTagClose(props.row, tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="dyInputVisible"
                    v-model="dyIputValue"
                    ref="saveDyTagInput"
                    placeholder="输入参数"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)">
                  </el-input>
                  <el-button
                    class="button-new-tag"
                    size="mini"
                    v-else
                    type="success"
                    @click="showCateparams"><i class="el-icon-plus"></i> 添加参数</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name">
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
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="only">
            <el-button
              type="primary"
              plain
              @click="dialogCateparamsFormVisible = true">添加静态参数</el-button>
            <el-table
              :data="cateparamsStaticParmas"
              style="width: 100%"
              height="520px">
              <el-table-column
                type="index"
                label="#"
                width="80">
              </el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name">
              </el-table-column>
              <el-table-column
                label="属性值"
                prop="attr_vals">
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        title="参数添加"
        :visible.sync="dialogCateparamsFormVisible"
        :close-on-click-modal="false">
        <el-form :model="paramsForm" ref="paramsForm">
            <el-form-item
              label="参数名称"
              :rules="[
                { required: true, message: '参数名称不能为空' }
              ]">
              <el-input
                autocomplete="off"
                clearable
                v-model="paramsForm.attr_name"
                placeholder="请输入参数名"></el-input>
            </el-form-item>
            <el-form-item
              label="属性值"
              prop="data">
              <el-alert
                v-if="activeName === 'many'"
                title="动态参数支持添加多个，输入时以英文输入法下逗号分隔，如，内存（4G,8G,16G）"
                type="warning"
                :closable="false">
              </el-alert>
              <el-input
                autocomplete="off"
                clearable
                v-model="paramsForm.attr_vals"
                placeholder="请输入属性值"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCateparamsFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateparamsSubmit">确 定</el-button>
          </div>
      </el-dialog>
      <el-dialog
        title="参数编辑"
        :visible.sync="dialogEditCateparamsFormVisible"
        :close-on-click-modal="false">
        <el-form :model="paramsEditForm" ref="paramsEditForm">
            <el-form-item
              label="参数名称"
              :rules="[
                { required: true, message: '参数名称不能为空' }
              ]">
              <el-input
                autocomplete="off"
                clearable
                v-model="paramsEditForm.attr_name"
                placeholder="请输入参数名"></el-input>
            </el-form-item>
            <el-form-item
              label="属性值"
              prop="data">
              <el-alert
                v-show="activeName === 'many'"
                title="动态参数支持添加多个，输入时以英文输入法下逗号分隔，如，内存（4G,8G,16G）"
                type="warning"
                :closable="false">
              </el-alert>
              <el-input
                autocomplete="off"
                clearable
                v-model="paramsEditForm.attr_vals"
                placeholder="请输入属性值"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditCateparamsFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCateparamsSubmit">确 定</el-button>
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
  Alert,
  Select
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
Vue.use(Alert);
Vue.use(Select);

export default {
  name: 'cateparams',
  data() {
    return {
      crumbs: [
        { name: '首页', url: '/' },
        { name: '商品管理', url: '/goods' },
        { name: '分类参数' }
      ],
      loading: false,
      showParams: false,
      paramsForm: {
        attr_name: '',
        attr_vals: ''
      },
      paramsEditForm: {
        attr_name: '',
        attr_vals: ''
      },
      activeName: 'many',
      dialogCateparamsFormVisible: false,
      dialogEditCateparamsFormVisible: false,
      cateparamsCats: [],
      cateparamsClassifys: [],
      cateparamsClassifyDefaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'
      },
      cateparamsTrendsParmas: [],
      cateparamsStaticParmas: [],
      dyInputVisible: false,
      dyIputValue: ''
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    checkedParams() {
      let flag = true;
      const { attr_name: attrName } = this.paramsForm;
      if (this.activeName === 'many') {
        flag = this.cateparamsTrendsParmas.every((item) => {
          return (item.attr_name.toUpperCase() !== attrName.toUpperCase());
        });
      } else {
        flag = this.cateparamsStaticParmas.every((item) => {
          return (item.attr_name.toUpperCase() !== attrName.toUpperCase());
        });
      }
      return flag;
    },
    showCateparams() {
      this.dyInputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveDyTagInput.$refs.input.focus();
      });
    },
    handleEdit(row = {}) {
      const {
        attr_id: attrId,
        attr_vals: attrVals = [],
        attr_name: attrName
      } = row;
      if (attrId) {
        this.dialogEditCateparamsFormVisible = true;
        this.paramsEditForm = {
          attr_id: attrId,
          attr_vals: Array.isArray(attrVals) ? attrVals.join(',') : attrVals,
          attr_sel: this.activeName,
          attr_name: attrName
        };
      }
    },
    addCateparamsSubmit() {
      const reqData = {
        ...this.paramsForm,
        attr_sel: this.activeName
      };
      if (this.checkedParams()) {
        this.addCateparams(reqData);
      } else {
        Message.warning('添加参数以存在,不能重复添加');
      }
    },
    editCateparamsSubmit() {
      this.updateParams(Number(this.paramsEditForm.attr_id));
    },
    handleCategory() {
      if (this.cateparamsCats.length === 3) {
        this.showParams = true;
        this.activeName = 'many';
        this.cateparamsTrendsParmas = [];
        this.cateparamsStaticParmas = [];
        this.getParamsList(Number(this.cateparamsCats[2]));
      } else {
        this.showParams = false;
        Message.warning('请选择三级商品分类后再操作');
      }
    },
    handleTabClick() {
      if (this.activeName === 'only') {
        if (this.cateparamsCats.length === 3) {
          this.getStaticParamsList(Number(this.cateparamsCats[2]));
        } else {
          Message.warning('请选择三级商品分类后再操作');
        }
      }
    },
    handleInputConfirm(row) {
      const {
        attr_id: attrId,
        attr_vals: attrVals = [],
        attr_name: attrName,
        attr_sel: attrSel
      } = row;
      let dyIputValue = this.dyIputValue;
      if (dyIputValue) {
        dyIputValue = dyIputValue.toUpperCase();
        const hasVal = attrVals.findIndex((v) => {
          return v === dyIputValue;
        });
        if (hasVal === -1) {
          attrVals.push(dyIputValue);
          this.dyInputVisible = false;
          this.dyIputValue = '';
          const reqData = {
            attr_name: attrName,
            attr_sel: attrSel,
            attr_vals: attrVals.join(',')
          };
          this.updateCateparams(attrId, reqData);
        } else {
          Message.warning('添加参数以存在,不能重复添加');
        }
      }
    },
    handleTagClose(row = {}, tag) {
      const {
        attr_id: attrId,
        attr_vals: attrVals = [],
        attr_name: attrName,
        attr_sel: attrSel
      } = row;
      attrVals.splice(attrVals.indexOf(tag), 1);
      const reqData = {
        attr_name: attrName,
        attr_sel: attrSel,
        attr_vals: attrVals.join(',')
      };
      this.updateCateparams(attrId, reqData);
    },
    handleDelete(row) {
      const { attr_name: attrName = '', attr_id: attrId = '' } = row;
      if (attrName && attrId !== '') {
        MessageBox.confirm(`<span>确认是否删除属性名称为 <strong style="color: coral;">${attrName}</strong> 的数据？</span>`, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true;
          this.deleteParams(Number(attrId));
        }).catch(() => {});
      }
    },
    async getCategoryList(type = 3) {
      this.loading = true;
      const result = await this.$http.get(`categories?type=${type}`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.cateparamsClassifys = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
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
          this.dialogEditGoodsFormVisible = false;
          this.clearGoodsForm();
          this.getGoodsList();
        } else {
          Message.warning(msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async getParamsList(id) {
      this.loading = true;
      const result = await this.$http.get(`categories/${id}/attributes?sel=many`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.cateparamsTrendsParmas = retData;
          this.cateparamsTrendsParmas.forEach((item) => {
            const val = item;
            val.attr_vals = val.attr_vals ? val.attr_vals.trim().split(',') : [];
          });
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async getStaticParamsList(id) {
      this.loading = true;
      const result = await this.$http.get(`categories/${id}/attributes?sel=only`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.cateparamsStaticParmas = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async updateCateparams(attrId, reqData) {
      this.loading = true;
      const result = await this.$http.put(`categories/${Number(this.cateparamsCats[2])}/attributes/${attrId}`, reqData);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { meta } = data;
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async addCateparams(reqData) {
      this.loading = true;
      const result = await this.$http.post(`categories/${Number(this.cateparamsCats[2])}/attributes`, reqData);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.dialogCateparamsFormVisible = false;
          this.paramsForm = {};
          Message.success(meta.msg);
          if (this.activeName === 'many') {
            this.getParamsList(Number(this.cateparamsCats[2]));
          } else {
            this.getStaticParamsList(Number(this.cateparamsCats[2]));
          }
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async deleteParams(attrId) {
      this.loading = true;
      const ret = await this.$http.delete(`categories/${Number(this.cateparamsCats[2])}/attributes/${attrId}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          if (this.activeName === 'many') {
            this.getParamsList(Number(this.cateparamsCats[2]));
          } else {
            this.getStaticParamsList(Number(this.cateparamsCats[2]));
          }
        } else {
          Message.warning(meta.msg);
        }
      }
    },
    async updateParams(attrId) {
      this.loading = true;
      const ret = await this.$http.put(`categories/${Number(this.cateparamsCats[2])}/attributes/${attrId}`, this.paramsEditForm);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.dialogEditCateparamsFormVisible = false;
          this.paramsEditForm = {};
          if (this.activeName === 'many') {
            this.getParamsList(Number(this.cateparamsCats[2]));
          } else {
            this.getStaticParamsList(Number(this.cateparamsCats[2]));
          }
        } else {
          Message.warning(meta.msg);
        }
      }
    }
  }
};
</script>

<style scoped>
.cateparams-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.cateparams-wrap .info-text {
  margin-top: 15px;
  margin-bottom: 15px;
}
.cateparams-wrap .el-tag + .el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
}
.cateparams-wrap .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.cateparams-wrap .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: top;
}

</style>
