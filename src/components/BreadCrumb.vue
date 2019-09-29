<template>
  <el-breadcrumb>
    <el-breadcrumb-item
      v-for="(item, index) in crumbs"
      :key="index">
        <a v-if="(index+1) !== crumbs.length" :href="item.url" v-text="item.name"></a>
        <span v-else v-text="item.name"></span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import Vue from 'vue';
import {
  Breadcrumb,
  BreadcrumbItem
} from 'element-ui';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

export default {
  name: 'BreadCrumb',
  props: ['crumbs']
};
</script>

<style scoped>

</style>
