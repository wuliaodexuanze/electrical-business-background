import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login/login';
import Home from '@/views/home/home';
import Users from '@/views/users/users';
import Permissions from '@/views/permissions/permissions';
import Roles from '@/views/permissions/roles';

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
        },
        {
          path: 'rights',
          name: 'rights',
          component: Permissions
        },
        {
          path: 'roles',
          name: 'roles',
          component: Roles
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
