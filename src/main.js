// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import BreadCrumb from './components/BreadCrumb';
import router from './router';
import Http from './plugins/https';
import fmtDate from './filters/fmtDate';

import './assets/styles/base.css';

Vue.use(Http);
Vue.config.productionTip = false;
Vue.filter('fmtDate', fmtDate);
Vue.component(BreadCrumb.name, BreadCrumb);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
