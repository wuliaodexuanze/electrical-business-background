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
        type="warning">
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
          <el-tab-pane label="动态参数" name="1">
          <el-button
            type="primary"
            plain>设置动态参数</el-button>
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
                    @close="handleTagClose(props.row.attr_vals, tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="dyInputVisible"
                    v-model="dyIputValue"
                    ref="saveDyTagInput"
                    placeholder="输入参数"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row.attr_vals)"
                    @blur="handleInputConfirm(props.row.attr_vals)">
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
          <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        title="编辑商品"
        :visible.sync="dialogEditGoodsFormVisible"
        :close-on-click-modal="false">
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
      activeName: '1',
      dialogEditGoodsFormVisible: false,
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
    handleCategory() {
      if (this.cateparamsCats.length === 3) {
        this.showParams = true;
        this.getParamsList(Number(this.cateparamsCats[2]));
      } else {
        this.showParams = false;
        Message.warning('请选择三级商品分类后再操作');
      }
    },
    handleTabClick() {},
    handleInputConfirm(attrs = []) {
      const dyIputValue = this.dyIputValue;
      if (dyIputValue) {
        attrs.push(dyIputValue);
      }
      this.dyInputVisible = false;
      this.dyIputValue = '';
    },
    showCateparams() {
      this.dyInputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveDyTagInput.$refs.input.focus();
      });
    },
    handleTagClose(attrs, tag) {
      attrs.splice(attrs.indexOf(tag), 1);
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
    clearGoodsForm() {
      this.goodsForm = {};
      this.currentGoodsId = '';
      this.goodsCats = [];
      this.cateparamsClassifys = [];
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
    async deleteGoods(goodId) {
      this.loading = true;
      const ret = await this.$http.delete(`goods/${goodId}`);
      this.loading = false;
      const { data: { meta }, status } = ret;
      if (status === 200) {
        if (meta.status.toString().startsWith('2')) {
          Message.success(meta.msg);
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
