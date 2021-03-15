<template>
  <div class="login">
    <header>
      <h1>SevensMusic</h1>
<!--      <p>仿网易云音乐</p>-->
      <section>
        <router-link to="/"><i class="iconfont icon-tubiao115"></i></router-link>
        <p></p>
        <a @click="toAccess"><i class="iconfont icon-fanhui"></i></a>
      </section>
    </header>
    <main>
      <p>Login</p>
      <section class="form">
        <label>
          <i class="el-icon-user"></i>
          <input ref="phone" v-model="loginForm.phone" @blur="checkPhone" type="text" placeholder="Phone">
        </label>
        <label>
          <i class="el-icon-lock"></i>
          <input ref="password" v-model="loginForm.password" @blur="checkPassword" type="password"
                 placeholder="Password">
        </label>
        <label class="rememberAccountName">
          <input type="checkbox" v-model="isRememberAccountName">
          <span>是否记住手机号</span>
        </label>
        <button @click="Login"><span class="s1"></span><i class="iconfont icon-youjiantou"></i><span class="s2"></span>
        </button>
      </section>
      <section class="register">还没有账号?
        <router-link to="/register">立即注册</router-link>
      </section>
    </main>
    <footer>
      <p>注: 登录账号是你的网易云音乐绑定的手机号,密码同理!</p>
      <p>本网站仅供学习前端使用</p>
    </footer>
  </div>
</template>

<script>
import { getUserInfo, loginByPhone } from '@/API/server/userApi'

export default {
  data () {
    return {
      // 登录表单
      loginForm: {
        phone: '',
        password: ''
      },
      phoneVerification: false,
      passwordVerification: false,
      // 是否记住用户名
      isRememberAccountName: false
    }
  },
  mounted () {
    if (window.localStorage.getItem('RememberAccountName')) {
      this.loginForm.phone = parseInt(window.localStorage.getItem('RememberAccountName'))
      this.isRememberAccountName = true
    }
  },
  methods: {
    async Login () {
      if (!this.phoneVerification && !this.passwordVerification) return this.$message.info('请填写表单信息')
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
      // 判断是否记住账号
      if (this.isRememberAccountName) {
        window.localStorage.setItem('RememberAccountName', this.loginForm.phone)
      }
      // 判断是否从别的页面跳转来的
      if (window.sessionStorage.getItem('recording')) {
        return await this.$router.push(window.sessionStorage.getItem('recording'))
      }
      await this.$router.push('/home')
    },
    toAccess () {
      if (window.sessionStorage.getItem('recording')) {
        return this.$router.push(window.sessionStorage.getItem('recording'))
      } else {
        return this.$router.push('/')
      }
    },
    checkPhone () {
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (this.loginForm.phone.length === 0) {
        this.phoneVerification = false
        this.$refs.phone.classList.remove('error')
      } else if (reg.test(this.loginForm.phone)) {
        this.phoneVerification = true
        this.$refs.phone.classList.remove('error')
      } else {
        this.$message.error('请输入正确的手机号!')
        this.$refs.phone.classList.add('error')
        this.phoneVerification = false
      }
    },
    checkPassword () {
      if (this.loginForm.password.length === 0) {
        this.passwordVerification = false
        this.$refs.password.classList.remove('error')
      } else if (this.loginForm.password.length >= 6 && this.loginForm.password.length <= 18) {
        this.passwordVerification = true
        this.$refs.password.classList.remove('error')
      } else {
        this.passwordVerification = false
        this.$message.error('长度为8-18个字符')
        this.$refs.password.classList.add('error')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: 'Arimo', sans-serif;
  background: linear-gradient(to right, #7AB6B6 50%, #E5CFAA 50%);
  header {
    height: 150px;
    width: 100%;
    background: #66677c;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #d5d6e2;
    flex-direction: column;
    h1 {
      font-size: 33px;
    }
    section {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      a {
        color: #d5d6e2;
        i {
          font-size: 31px;
          cursor: pointer;
          transition: 0.2s;
        }
      }
      a:hover i {
        color: white;
      }
      p {
        width: 2px;
        height: 50px;
        background: #d5d6e2;
        margin: 0 20px;
        transform: rotate3d(0, 0, 1, 22.5deg);
      }
    }
  }
  main {
    width: 360px;
    height: 416px;
    background: white;
    padding: 30px 30px;
    color: #555555;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 3px;
    p {
      text-align: center;
      font-weight: 600;
      font-size: 33px;
      margin-bottom: 50px;
    }
    .form {
      label {
        display: flex;
        justify-content: left;
        align-items: center;
        height: 60px;
        input {
          width: 260px;
          color: #7AB6B6;
          background-color: #fff;
          font-size: 17px;
          letter-spacing: 1px;
          height: 40px;
          padding: 5px 10px 2px 25px;
          box-shadow: 0 0 0 0 transparent;
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          display: inline-block;
        }
        .error {
          border: 2px solid #fa2800;
          outline-color: #fa2800;
        }
        i {
          font-size: 20px;
          margin-right: 20px;
        }
      }
      button {
        color: #7AB6B6;
        background-color: #EDF6F5;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 1px;
        border-radius: 5px;
        width: 50%;
        height: 45px;
        padding: 7px 30px;
        margin: 0 auto 25px;
        border: none;
        display: block;
        position: relative;
        transition: all 0.3s ease;
        outline: none;
        overflow: hidden;
        cursor: pointer;
        clear: both;
        i {
          position: relative;
          z-index: 10;
          font-size: 32px;
          transition: all 0.3s ease;
        }
        span {
          position: absolute;
          background: #7AB6B6;
          transition: all 0.3s ease;
        }
        .s1 {
          left: 0;
          bottom: 0;
          width: 2px;
          height: 50%;
        }
        .s2 {
          right: 0;
          top: 0;
          width: 2px;
          height: 50%;
        }
      }
      button:hover i {
        color: white;
      }
      button:hover span {
        width: 100%;
        height: 100%;
      }
      .rememberAccountName {
        width: 120px;
        text-align: center;
        float: right;
        height: 30px;
        user-select: none;
        margin-bottom: 20px;
        input {
          width: 17px;
          height: 17px;
          line-height: 30px;
          margin-top: 1px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
    .register {
      width: 100%;
      text-align: center;
      color: #333333;
      font-weight: 700;
      a {
        color: #d6bc8b;
        transition: .1s;
      }
      a:hover {
        color: #7AB6B6;
      }
    }
  }
  footer {
    height: 70px;
    width: 100%;
    background: #66677c;
    color: #d5d6e2;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
