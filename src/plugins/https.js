import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import { BASE_URL } from '@/config';

const Http = {};
Http.install = (Vue) => {
  const vue = Vue;
  axios.defaults.baseURL = BASE_URL;
  axios.interceptors.request.use((config) => {
    const conf = config;
    if (conf.url !== 'login') {
      conf.headers['Authorization'] = localStorage.getItem('business_token');
    }
    return config;
  }, (error) => {
    Promise.reject(error);
  });
  axios.interceptors.response.use((config) => {
    return config;
  }, (error) => {
    Message.closeAll();
    Message.error('网络出现异常，请稍后再试');
    router.push({ name: 'login' });
    Promise.reject(error);
  });
  vue.prototype.$http = axios;
};

export default Http;
