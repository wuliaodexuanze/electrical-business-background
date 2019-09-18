import axios from 'axios';

const Http = {};
Http.install = (Vue) => {
  const vue = Vue;
  vue.prototype.$http = axios;
};

export default Http;
