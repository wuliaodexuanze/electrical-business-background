<template>
  <el-card
    class="reports-wrap"
    :body-style="{height:'100%'}"
    v-loading="loading"
    element-loading-text="加载中...">
    <div
      slot="header"
      class="clearfix">
      <bread-crumb :crumbs="crumbs"></bread-crumb>
    </div>
    <div class="body-box">
      <el-row :gutter="20" class="list">
        <el-col :span="12" class="list-col">
          <div id="echartsBox" style="width: 100%;height: 100%"></div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue';
import {
  Card,
  Row,
  Col,
  Message
} from 'element-ui';

const echarts = require('echarts');

Vue.use(Card);
Vue.use(Row);
Vue.use(Col);

export default {
  name: 'reports',
  data() {
    return {
      crumbs: [
        { name: '首页', url: '/' },
        { name: '数据统计', url: '/reports' },
        { name: '数据报表' }
      ],
      loading: false
    };
  },
  mounted() {
    this.useEchart();
  },
  methods: {
    async useEchart() {
      const myChart = echarts.init(document.getElementById('echartsBox'));
      const defaultOptions = {
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      };
      const options = await this.getData();
      if (options) {
        myChart.setOption({ ...defaultOptions, ...options });
      }
    },
    async getData() {
      this.loading = true;
      const result = await this.$http.get('reports/type/1');
      this.loading = false;
      const { data = {}, status } = result;
      if (status === 200) {
        const { data: retData, meta: { status: state, msg } } = data;
        if (state.toString().startsWith('2')) {
          return retData;
        }
        Message.warning(msg);
        return false;
      }
      return false;
    }
  }
};
</script>

<style scoped>
.reports-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.reports-wrap .body-box {
  width: 100%;
  height: 100%;
}
.reports-wrap .body-box .list {
  height: 100%;
}
.reports-wrap .body-box .list-col {
  height: 300px;
}
</style>
