import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import Login from '@/views/login/login';
import Home from '@/views/home/home';
import Users from '@/views/users/users';
import Permissions from '@/views/permissions/permissions';
import Roles from '@/views/permissions/roles';
import Goods from '@/views/goods/goodslist';
import GoodsAdd from '@/views/goods/goodsAdd';

Vue.use(Router);

const router = new Router({
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
        },
        {
          path: 'goods',
          name: 'goods',
          component: Goods
        },
        {
          path: 'goodsadd',
          name: 'goodsadd',
          component: GoodsAdd
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

// 路由守卫，路由配置之前生效
router.beforeEach((to, form, next) => {
  if (to.path !== '/login') {
    const token = localStorage.getItem('business_token');
    if (!token) {
      Message.error('请登录');
      router.push({ name: 'login' });
      return;
    }
  }
  next();
});

export default router;
