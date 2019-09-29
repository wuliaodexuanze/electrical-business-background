import axios from 'axios';

const Http = {};
Http.install = (Vue) => {
  const vue = Vue;
  axios.defaults.baseURL = 'http://39.108.193.251:8888/api/private/v1/';
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
    Promise.reject(error);
  });
  vue.prototype.$http = axios;
};

export default Http;
