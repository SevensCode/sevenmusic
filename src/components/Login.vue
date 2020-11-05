<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
      <p>登录</p>
      <el-form-item prop="phone">
        <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password v-model="loginForm.password" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">注册</el-button>
        <el-button type="primary" @click="Login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import $bus from '@/components/$bus'
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
        const { data: res } = await this.axios.post('/login/cellphone', this.loginForm)
        if (res.code !== 200) return this.$message.error(res.message)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token)
        // 组件传值
        // $bus.$emit('user', res.profile)
        await this.$router.push({
          name: 'home',
          path: '/home',
          query: { user: JSON.stringify(res.profile) }
        })
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
