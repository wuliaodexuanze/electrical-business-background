<template>
  <el-card
    class="goodsadd-wrap"
    :body-style="{flex: 1, overflow: 'hidden'}"
    v-loading="loading"
    element-loading-text="加载中...">
    <div slot="header" class="clearfix">
      <bread-crumb :crumbs="crumbs"></bread-crumb>
    </div>
    <div class="body-box">
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
          v-model="stepActive"
          @tab-click="handleTabClick">
          <el-tab-pane class="tab-pane" name="1" label="商品参数">
            <el-form-item
              label="商品名称"
              :rules="[{ required: true, message: '商品名称不能为空', trigger: 'blur' }]">
              <el-input
                v-model="goodsForm.goods_name"
                placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              :rules="[{ required: true, message: '商品价格不能为空', trigger: 'blur' }]">
              <el-input
                v-model="goodsForm.goods_price"
                placeholder="请输入商品价格"></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              :rules="[{ required: true, message: '商品重量不能为空', trigger: 'blur' }]">
              <el-input
                v-model="goodsForm.goods_weight"
                placeholder="请输入商品重量"></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              :rules="[{ required: true, message: '商品数量不能为空', trigger: 'blur' }]">
              <el-input
                v-model="goodsForm.goods_number"
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
                :file-list="picList"
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
              @click.prevent="handleAddGoods">点击提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue';
import {
  Card,
  Steps,
  Step,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Cascader,
  Message,
  Checkbox,
  CheckboxGroup,
  Upload,
  Alert
} from 'element-ui';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { BASE_URL } from '@/config';

Vue.use(Card);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Cascader);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Alert);
Vue.use(Upload);

export default {
  name: 'goodsAdd',
  components: {
    quillEditor
  },
  data() {
    return {
      uploadUrl: `${BASE_URL}upload`,
      crumbs: [
        { name: '首页', url: '/' },
        { name: '商品管理', url: '/goods' },
        { name: '商品添加' }
      ],
      loading: false,
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
      picList: []
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    handleAddGoods() {
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
      this.addGoods();
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
    handleUploadRemove(file, filelist = []) {
      const list = [];
      filelist.forEach((item) => {
        const { response: { data } } = item;
        list.push(data.tmp_path);
      });

      this.goodsForm.pics = list;
    },
    handleTabClick() {
      const cats = this.goodsCats;
      if (this.stepActive === '2') {
        if (cats.length === 3) {
          this.getParamsList(cats[2]);
          return;
        }
        this.goodsTrendsParmas = [];
        Message.warning('请选择三级商品分类后再操作');
      } else if (this.stepActive === '3') {
        if (cats.length === 3) {
          this.getStaticParamsList(cats[2]);
          return;
        }
        this.goodsStaticParmas = [];
        Message.warning('请选择三级商品分类后再操作');
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
    async getParamsList(id) {
      this.loading = true;
      const result = await this.$http.get(`categories/${id}/attributes?sel=many`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          this.goodsTrendsParmas = retData;
          this.goodsTrendsParmas.forEach((item) => {
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
          this.goodsStaticParmas = retData;
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async addGoods() {
      this.loading = true;
      const result = await this.$http.post('goods', this.goodsForm);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { meta: { status: state, msg } } = data;
        if (state.toString().startsWith('2')) {
          Message.success(msg);
          this.$router.push({ name: 'goods' });
        } else {
          Message.warning(msg);
          this.$router.push({ name: 'login' });
        }
      }
    }
  }
};
</script>

<style scoped>
.goodsadd-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.goodsadd-wrap .body-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.goodsadd-wrap .steps {
  margin-bottom: 10px;
}
.goodsadd-wrap .tabs {
  flex: 1;
}
.goodsadd-wrap .tabs .tab-pane {
  height: 520px;
  overflow-y: auto;
}
.goodsadd-wrap .classify-item {
  width: 100%;
}
.goodsadd-wrap .content-edit {
  height: 400px;
}
.goodsadd-wrap .add-btn {
  margin-top: 20px;
}
</style>
