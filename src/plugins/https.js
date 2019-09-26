import axios from 'axios';

const Http = {};
Http.install = (Vue) => {
  const vue = Vue;
  axios.defaults.baseURL = 'http://39.108.193.251:8888/api/private/v1/';
  vue.prototype.$http = axios;
};

export default Http;
