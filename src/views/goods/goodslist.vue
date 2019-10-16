<template>
  <el-card
    class="goods-wrap"
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
            @click="$router.push({ name: 'goodsadd' })"
            icon="el-icon-circle-plus-outline"
            type="success"
            plain>添加商品</el-button>
        </el-col>
        <el-col :span="8" :offset="14">
          <el-input
            placeholder="请输入内容"
            v-model="query"
            clearable
            @clear="searchGoods">
            <el-button @click="searchGoods" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="body-box">
      <el-table
        :data="goodsList"
        height="570"
        border
        class="table-box">
        <el-table-column
          type="index"
          label="#"
          width="80">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="140">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.add_time | fmtDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="100">
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
        title="编辑商品"
        :visible.sync="dialogEditGoodsFormVisible"
        :close-on-click-modal="false">
        <div class="edit-modal">
          <el-steps class="steps" :active="1 * stepActive" align-center finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="提交添加"></el-step>
        </el-steps>
          <el-form
          ref="goodsForm"
          :model="goodsForm">
          <el-tabs
            tab-position="left"
            class="tabs"
            v-model="stepActive">
            <el-tab-pane class="tab-pane" name="1" label="商品参数">
              <el-form-item
                label="商品名称"
                prop="goods_name"
                :rules="[{ required: true, message: '商品名称不能为空', trigger: 'blur' }]">
                <el-input
                  v-model.trim="goodsForm.goods_name"
                  placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <el-form-item
                label="商品价格"
                prop="goods_price"
                :rules="[{ required: true, message: '商品价格不能为空', trigger: 'blur' }]">
                <el-input
                  v-model.number="goodsForm.goods_price"
                  placeholder="请输入商品价格"></el-input>
              </el-form-item>
              <el-form-item
                label="商品重量"
                prop="goods_weight"
                :rules="[{ required: true, message: '商品重量不能为空', trigger: 'blur' }]">
                <el-input
                  v-model.number="goodsForm.goods_weight"
                  placeholder="请输入商品重量"></el-input>
              </el-form-item>
              <el-form-item
                label="商品数量"
                prop="goods_number"
                :rules="[{ required: true, message: '商品数量不能为空', trigger: 'blur' }]">
                <el-input
                  v-model.number="goodsForm.goods_number"
                  placeholder="请输入商品数量"></el-input>
              </el-form-item>
              <el-form-item
                label="商品分类"
                :rules="[{ required: true, message: '商品分类不能为空', trigger: 'blur' }]">
                <el-cascader
                  class="classify-item"
                  v-model="goodsCats"
                  :options="goodsClassifys"
                  :props="goodsClassifyDefaultProps"
                  placeholder="请选择分类"
                  clearable>
                  <template slot-scope="{ node, data }">
                    <span>{{ data.cat_name }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane class="tab-pane" name="2" label="商品参数">
              <el-form-item
                v-for="item in goodsTrendsParmas"
                :key="item.id">
                <span style="display: block;" v-text="item.attr_name"></span>
                <el-checkbox-group
                  v-model="item.attr_vals"
                  size="mini"
                  style="display: block">
                  <el-checkbox
                    v-for="(val, index) in item.attr_vals"
                    :key="index"
                    :label="val"
                    border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane class="tab-pane" name="3" label="商品属性">
              <el-form-item
                v-for="(item, index) in goodsStaticParmas"
                :key="index"
                :label="item.attr_name">
                <el-input
                  v-model="item.attr_vals"
                  :placeholder="'请输入' + item.attr_name"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane class="tab-pane" name="4" label="商品图片">
              <el-form-item>
                <el-upload
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :file-list="currentPicList"
                  :on-success="handleUploadSuccess"
                  :on-remove="handleUploadRemove"
                  accept="image/png, image/jpeg, image/jpg"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip">只能上传jpeg/jpg/png文件</div>
                </el-upload>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane class="tab-pane" name="5" label="商品内容">
              <el-form-item>
                <quill-editor
                  class="content-edit"
                  v-model="goodsForm.goods_introduce"/>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane class="tab-pane" name="6" label="提交添加">
              <el-alert
                title="完成信息填写，即可点击按钮提交数据，进行商品添加。"
                type="success"
                :closable="false">
              </el-alert>
              <el-button
                class="add-btn"
                type="primary"
                @click.prevent="handleEditGoods">点击提交</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditGoodsFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { BASE_URL } from '@/config';

import {
  Card,
  Table,
  TableColumn,
  Button,
  Tooltip,
  Message,
  Row,
  Col,
  Dialog,
  MessageBox,
  Pagination,
  Cascader,
  CheckboxGroup,
  Checkbox,
  Upload,
  Form,
  FormItem,
  Steps,
  Step,
  Tabs,
  TabPane,
  Alert,
  Tag
} from 'element-ui';

Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Cascader);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Alert);
Vue.use(Upload);
Vue.use(Tag);

export default {
  name: 'goodslist',
  components: {
    quillEditor
  },
  data() {
    return {
      uploadUrl: `${BASE_URL}upload`,
      crumbs: [
        { name: '首页', url: '/' },
        { name: '商品管理', url: '/goods' },
        { name: '商品列表' }
      ],
      loading: false,
      goodsList: [],
      query: '',
      pagenum: 1,
      pagesizes: [20, 30, 50, 100],
      pagesize: 20,
      total: 0,
      dialogEditGoodsFormVisible: false,
      stepActive: '1',
      goodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      currentGoodsId: '',
      goodsCats: [],
      goodsClassifys: [],
      goodsClassifyDefaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'
      },
      goodsTrendsParmas: [],
      goodsStaticParmas: [],
      uploadHeaders: {
        Authorization: localStorage.getItem('business_token')
      },
      picList: [],
      currentPicList: []
    };
  },
  created() {
    this.getGoodsList();
    this.getCategoryList();
  },
  methods: {
    searchGoods() {
      this.pagenum = 1;
      this.getGoodsList();
    },
    handleEditGoods() {
      this.goodsForm.goods_cat = this.goodsCats.join(',');
      const dyArr = this.goodsTrendsParmas.map((item) => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });
      const staticsArr = this.goodsStaticParmas.map((item) => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });
      this.goodsForm.attrs = [...dyArr, ...staticsArr];
      this.picList.forEach((item) => {
        this.goodsForm.pics.push({ pic: item.url });
      });
      this.editGoods();
    },
    handleDelete(row) {
      const { goods_name: goodsName = '', goods_id: goodsId = '' } = row;
      if (goodsName && goodsId !== '') {
        MessageBox.confirm(`<span>确认是否删除商品名为 <strong style="color: coral;">${goodsName}</strong> 的数据？</span>`, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true;
          this.deleteGoods(goodsId);
        }).catch(() => {});
      }
    },
    handleSizeChange(val = 20) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsList();
    },
    handleCurrentChange(val = 1) {
      this.pagenum = val;
      this.getGoodsList();
    },
    handleUploadSuccess(res) {
      const { data: { tmp_path: pic }, meta: { msg, status } } = res;
      let type = 'warning';
      if (status.toString().startsWith('2')) {
        this.goodsForm.pics.push({ pic });
        type = 'success';
      }
      Message({
        message: msg,
        type
      });
    },
    handleUploadRemove(file) {
      const { url } = file;
      this.picList = this.picList.filter((item) => {
        return item.url !== url;
      });
    },
    clearGoodsForm() {
      this.goodsForm = {};
      this.currentGoodsId = '';
      this.goodsCats = [];
      this.goodsClassifys = [];
      this.goodsTrendsParmas = [];
      this.goodsStaticParmas = [];
      this.picList = [];
      this.currentPicList = [];
    },
    async handleEdit(row) {
      const ret = await this.getGoodsInfoById(Number(row.goods_id));
      if (!ret) {
        return;
      }
      const {
        pics = [],
        attrs = [],
        goods_id: goodsId = '',
        goods_name: goodsName = '',
        goods_number: goodsNumber = 0,
        goods_weight: goodsWeight = 0,
        goods_price: goodsPrice = 0,
        cat_one_id: oneId,
        cat_two_id: twoId,
        cat_three_id: threeId,
        goods_introduce: goodsIntroduce
      } = ret;
      if (goodsId !== '' && goodsName) {
        this.dialogEditGoodsFormVisible = true;
        this.currentGoodsId = Number(goodsId);
        this.picList = pics.map((item) => {
          return {
            url: item.pics_sma || item.pics_mid || item.pics_big
          };
        });
        this.currentPicList = pics.map((item) => {
          return {
            url: item.pics_sma_url || item.pics_mid_url || item.pics_big_url
          };
        });
        this.goodsForm = {
          ...this.goodsForm,
          goods_name: goodsName,
          goods_number: goodsNumber,
          goods_weight: goodsWeight,
          goods_price: goodsPrice,
          goods_introduce: goodsIntroduce
        };
        if (oneId != null && twoId != null && threeId != null) {
          this.goodsCats = [oneId, twoId, threeId];
        }
        const dyDataList = [];
        const staticDataList = [];
        attrs.forEach((item) => {
          const data = item;
          if (data.attr_sel === 'many') {
            data.attr_vals = data.attr_vals && data.attr_vals.split(',');
            dyDataList.push(data);
          } else if (data.attr_sel === 'only') {
            staticDataList.push(data);
          }
        });
        this.goodsTrendsParmas = dyDataList;
        this.goodsStaticParmas = staticDataList;
      }
    },
    async getGoodsList() {
      this.loading = true;
      const result = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          const { goods = [], pagenum = 1, total = 0 } = retData;
          this.goodsList = goods;
          this.total = total;
          this.pagenum = Number(pagenum);
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
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
          this.goodsClassifys = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async deleteGoods(goodId) {
      this.loading = true;
      const ret = await this.$http.delete(`goods/${goodId}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
          this.pagenum = 1;
          this.getGoodsList();
        } else {
          Message.warning(meta.msg);
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
          this.pagenum = 1;
          this.getGoodsList();
        } else {
          Message.warning(msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async getGoodsInfoById(id) {
      const result = await this.$http.get(`goods/${id}`);
      const { data, status } = result;
      if (status === 200) {
        const { data: retData } = data;
        return retData;
      }
      return false;
    }
  }
};
</script>

<style scoped>
.goods-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.goods-wrap .body-box {
  width: 100%;
  height: 100%;
}
.goods-wrap .search-box {
  margin-top: 15px;
}
.goods-wrap .table-box {
  box-sizing: content-box;
}
.goods-wrap .page-box {
  padding-top: 20px;
}
.goods-wrap .edit-modal {
  height: 500px;
}
.goods-wrap .steps {
  margin-bottom: 10px;
}
.goods-wrap .tabs {
  flex: 1;
}
.goods-wrap .tabs .tab-pane {
  height: 450px;
  overflow-y: auto;
}
.goods-wrap .classify-item {
  width: 100%;
}
.goods-wrap .content-edit {
  height: 300px;
}
.goods-wrap .add-btn {
  margin-top: 20px;
}
</style>
