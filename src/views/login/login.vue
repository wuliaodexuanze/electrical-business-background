<template>
  <div class="login-wrap">
    <el-form
      ref="loginForm"
      label-position="right"
      :model="loginForm"
      :rules="rules"
      class="login-form">
      <h2 class="title">后台管理系统</h2>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          autocomplete="off"
          clearable
          placeholder="请输入用户名">
          <template slot="prepend"><i class="el-icon-user-solid"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          autocomplete="off"
          clearable
          show-password
          placeholder="请输入密码">
          <template slot="prepend"><i class="el-icon-lock"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-btn"
          type="primary"
          :loading="loginForm.loadingState"
          :disabled="loginForm.disabledState"
          @click.prevent="submitForm('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Form, FormItem, Button, Input, Message } from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

export default {
  name: 'login',
  data() {
    const changeState = (state) => {
      this.loginForm.disabledState = state;
    };

    const validateUsernameAndPassword = (form) => {
      if (form.username.trim() && form.password.trim()) {
        changeState(false);
        return true;
      }
      changeState(true);
      return false;
    };

    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入用户名'));
      }
      const valLen = value.length;
      if (valLen < 3 || valLen > 32) {
        callback(new Error('用户名长度为4至32'));
      }
      if (validateUsernameAndPassword(this.loginForm)) {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入密码'));
      }
      const valLen = value.length;
      if (valLen < 6 || valLen > 32) {
        callback(new Error('密码长度为6至32'));
      }
      if (validateUsernameAndPassword(this.loginForm)) {
        callback();
      }
    };

    return {
      loginForm: {
        username: '',
        password: '',
        disabledState: true,
        loadingState: false
      },
      rules: {
        username: {
          validator: validateUsername
        },
        password: {
          validator: validatePassword
        }
      }
    };
  },
  methods: {
    async login() {
      const { username, password } = this.loginForm;
      const result = await this.$http.post('login', { username, password });
      if (result.status === 200) {
        const { data, meta: { msg, status } } = result.data;
        let type = 'warning';
        if (status.toString().startsWith('2')) {
          type = 'success';
          localStorage.setItem('business_token', data.token);
          localStorage.setItem('business_username', data.username);
          this.$router.push({ name: 'home' });
        }
        Message({ message: msg, type });
        this.loginForm.loadingState = false;
      }
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loginForm.loadingState = true;
          this.login();
        } else {
          console.error('输入信息有误');
        }
      });
    }
  }
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
}
.login-form .title {
  font-size: 30px;
  font-weight: 500;
  color: #fefefe;
  text-align: center;
}
.login-wrap .submit-btn {
  width: 100%;
}
</style>
