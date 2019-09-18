<template>
  <div class="login-wrap">
    <el-form
      status-icon
      ref="loginForm"
      label-position="right"
      label-width="100px"
      :model="loginForm"
      :rules="rules"
      class="login-form">
      <h2 class="title">用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          autocomplete="off"
          placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-btn"
          type="primary"
          :loading="loginForm.loginState"
          @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Form, FormItem, Button, Input } from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入用户名'));
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入密码'));
      }
    };

    return {
      loginForm: {
        username: '',
        password: '',
        loginState: false,
      },
      rules: {
        username: {
          validator: validateUsername,
        },
        password: {
          validator: validatePassword,
        },
      },
    };
  },
  methods: {
    submitForm() {
    },
  },
};
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #324152;
}
.login-wrap .login-form {
  padding: 30px;
  width: 400px;
  border-radius: 5px;
  background-color: #fff;
}
.login-form .title {
  text-align: center;
}
.login-wrap .submit-btn {
  width: 100%;
}
</style>
