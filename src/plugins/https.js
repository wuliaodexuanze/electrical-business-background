import axios from 'axios';

const Http = {};
Http.install = (Vue) => {
  const vue = Vue;
  axios.defaults.baseURL = 'http://api.xiaomadagege.cn:3001/api/private/v1/';
  vue.prototype.$http = axios;
};

export default Http;
