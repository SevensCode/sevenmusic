<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
      <p>登录</p>
      <el-form-item prop="phone">
        <el-input v-model="loginForm.phone" placeholder="请输入手机号" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">注册</el-button>
        <el-button type="primary" @click="Login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserInfo, loginByPhone } from '@/API/server/userApi'

export default {
  data () {
    return {
      // 登录表单
      loginForm: {
        phone: '13310311196',
        password: 'sp154618'
      }, // 登录表单验证规则
      loginFormRules: {
        // 验证手机号
        phone: [{
          required: true,
          message: '请输入手机！',
          trigger: 'blur'
        }, {
          min: 11,
          max: 11,
          message: '请输入正确手机号',
          trigger: 'blur'
        }], // 验证密码是否合法
        password: [{
          required: true,
          message: '请输入登录密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 18,
          message: '长度在 6 到 18 个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    Login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: user } = await loginByPhone(this.loginForm)
        if (user.code !== 200) return this.$message.error(user.message)
        // 保存登录成功后获取到的 token
        window.sessionStorage.setItem('token', user.token)
        // 保存登录成功后获取到的 cookie
        window.sessionStorage.setItem('cookie', user.cookie)
        // 调用获取用户信息接口
        const { data: userInfo } = await getUserInfo(user.profile.userId)
        // 保存用户信息
        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        this.$message.success('登录成功')
        if (window.sessionStorage.getItem('recording')) {
          return await this.$router.push(window.sessionStorage.getItem('recording'))
        }
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: #4facde;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 350px;
  height: 300px;
  background: whitesmoke;
  padding: 30px;
  border-radius: 10px;
}

.login-form p {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.el-button {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
