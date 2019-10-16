<template>
  <el-card
    class="orders-wrap"
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
        :data="ordersList"
        border
        height="570"
        class="table-box">
        <el-table-column
          type="index"
          label="#"
          width="80">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="310">
        </el-table-column>
        <el-table-column
          prop="order_price"
          width="130"
          label="订单价格">
        </el-table-column>
        <el-table-column
          width="100"
          label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'">已付款</el-tag>
            <el-tag v-if="scope.row.pay_status === '1'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          width="100"
          label="是否发货">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="130">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmtDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :hide-after="400" content="收货地址编辑" placement="top-start">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
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
        title="收货地址修改"
        :visible.sync="dialogEditOrderFormVisible"
        :close-on-click-modal="false">
        <el-form
          ref="orderForm"
          :model="orderForm">
          <el-form-item
            label="省市区"
            label-width="100px">
            <el-cascader
              clearable
              v-model="selectAddress"
              :options="areaList"
              :props="classifyDefaultProps">
            </el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            label-width="100px">
            <el-input
              v-model.trim="orderForm.address"
              placeholder="请输入详细地址"
              clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditOrderFormVisible = false">取 消</el-button>
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
  Message,
  Pagination,
  Tag,
  Dialog,
  Form,
  FormItem,
  Cascader
} from 'element-ui';
import areaList from '@/assets/area';

Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Cascader);

export default {
  name: 'orders',
  data() {
    return {
      crumbs: [
        { name: '首页', url: '/' },
        { name: '权限管理', url: '/orders' },
        { name: '订单列表' }
      ],
      loading: false,
      dialogEditOrderFormVisible: false,
      ordersList: [],
      areaList: [],
      selectAddress: [],
      pagenum: 1,
      pagesizes: [20, 30, 50, 100],
      pagesize: 20,
      total: 0,
      classifyDefaultProps: {
        expandTrigger: 'hover'
      },
      orderForm: {
        address: ''
      }
    };
  },
  created() {
    this.getOrders();
    this.getArea();
  },
  methods: {
    handleSizeChange(val = 20) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getOrders();
    },
    handleCurrentChange(val = 1) {
      this.pagenum = val;
      this.getOrders();
    },
    handleEdit() {
      this.dialogEditOrderFormVisible = true;
    },
    async getOrders() {
      this.loading = true;
      const result = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const { data, status } = result;
      if (status === 200) {
        const { data: retData, meta } = data;
        if (meta.status.toString().startsWith('2')) {
          const { goods = [], pagenum = 1, total = 0 } = retData;
          this.ordersList = goods;
          this.total = total;
          this.pagenum = Number(pagenum);
        } else {
          Message.warning(meta.msg);
          this.$router.push({ name: 'login' });
        }
      }
    },
    async getArea() {
      this.areaList = areaList;
    }
  }
};
</script>

<style scoped>
.orders-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.orders-wrap .page-box {
  padding-top: 20px;
}
</style>
