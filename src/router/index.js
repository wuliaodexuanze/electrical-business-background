import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login/login';
import Home from '@/views/home/home';
import Users from '@/views/users/users';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'users',
          name: 'users',
          component: Users
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
});
