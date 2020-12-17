<template>
  <div class="register">
    <header>
      <h1>SevensMusic</h1>
      <p>仿网易云音乐</p>
      <section class="home">
        <router-link to="/"><i class="iconfont icon-tubiao115"></i></router-link>
        <p></p>
        <a @click="toAccess"><i class="iconfont icon-fanhui"></i></a>
      </section>
    </header>
    <main>
      <h1 class="title">Register</h1>
      <section class="form">
        <label>
          <span>手机号 :</span>
          <input ref="phone" v-model="registerQuery.phone" @blur="checkPhone" type="text" placeholder="你的手机号">
        </label>
        <label>
          <span>验证码 :</span>
          <input v-model="registerQuery.captcha" type="text" placeholder="点击右边按钮">
          <input type="button" ref="yzm" @click="verificationCode" value="获取验证码" class="captcha">
        </label>
        <label>
          <span>密码 :</span>
          <input ref="password" v-model="registerQuery.password" @blur="checkPassword" type="password"
                 placeholder="长度为8-18个字符且由数字、字母组成!">
        </label>
        <label>
          <span>确定密码 :</span>
          <input ref="confirmPassword" v-model="confirmPassword" @blur="checkConfirmPassword" type="password"
                 placeholder="再次输入密码">
        </label>
        <label>
          <span>昵称 :</span>
          <input ref="nickname" v-model="registerQuery.nickname" @blur="checkNickname" type="text"
                 placeholder="长度为2-12个字符">
        </label>
        <button class="b1" @click="register"><span class="s1"></span><i class="iconfont icon-youjiantou"></i><span
            class="s2"></span>
        </button>
        <section class="login">已有账号?
          <router-link to="/login">立即登录</router-link>
        </section>
      </section>
    </main>
    <footer>
      <p>注: 登录账号是你的网易云音乐绑定的手机号,密码同理!</p>
      <p>本网站仅供学习前端使用</p>
    </footer>
  </div>
</template>

<script>
import {
  getVerificationCode,
  verificationcode,
  registerOrChangePassword,
  checkIfTheMobilePhoneNumberIsRegistered
} from '@/API/server/userApi'

export default {
  data () {
    return {
      // 注册
      registerQuery: {
        // 手机号
        phone: '',
        // 密码
        password: '',
        // 验证码
        captcha: '',
        // 昵称
        nickname: ''
      },
      // 确认密码
      confirmPassword: '',
      phoneVerification: false,
      passwordVerification: false,
      confirmPasswordVerification: false,
      nicknameVerification: false,
      time: 60,
      dsq: null
    }
  },
  methods: {
    async Login () {
    },
    checkPhone () {
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (this.registerQuery.phone.length === 0) {
        this.phoneVerification = false
        this.$refs.phone.classList.remove('error')
      } else if (reg.test(this.registerQuery.phone)) {
        this.phoneVerification = true
      } else {
        this.$message.error('请输入正确的手机号!')
        this.$refs.phone.classList.add('error')
        this.phoneVerification = false
      }
    },
    toAccess () {
      if (window.sessionStorage.getItem('recording')) {
        return this.$router.push(window.sessionStorage.getItem('recording'))
      } else {
        return this.$router.push('/')
      }
    },
    checkPassword () {
      const verify = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/
      if (this.registerQuery.password.length === 0) {
        this.$refs.password.classList.remove('error')
        this.passwordVerification = false
      } else if (verify.test(this.registerQuery.password)) {
        this.passwordVerification = true
      } else {
        this.passwordVerification = false
        this.$message.error('长度为8-18个字符且由数字、字母组成!')
        this.$refs.password.classList.add('error')
      }
    },
    checkConfirmPassword () {
      if (this.confirmPassword.length === 0) {
        this.confirmPasswordVerification = false
        this.$refs.confirmPassword.classList.remove('error')
      } else if (this.registerQuery.password.length === 0) {
        this.$message.error('亲，先把密码输入了再输入确定密码！')
        this.$refs.confirmPassword.classList.add('error')
        this.confirmPasswordVerification = false
      } else if (this.registerQuery.password === this.confirmPassword) {
        this.confirmPasswordVerification = true
      } else {
        this.confirmPasswordVerification = false
        this.$message.error('俩次输入的密码不一样')
        this.$refs.confirmPassword.classList.add('error')
      }
    },
    checkNickname () {
      if (this.registerQuery.nickname.length === 0) {
        this.nicknameVerification = false
        this.$refs.nickname.classList.remove('error')
      } else if (this.registerQuery.nickname.length < 2 || this.registerQuery.nickname.length > 12) {
        this.nicknameVerification = false
        this.$message.error('长度为2-12个字符')
        this.$refs.nickname.classList.add('error')
      } else {
        this.nicknameVerification = true
      }
    },
    // 发生验证码
    verificationCode () {
      if (this.phoneVerification) {
        getVerificationCode(this.registerQuery.phone).then(() => {
          this.dsq = setInterval(() => {
            this.time--
            this.$refs.yzm.value = this.time + ' ' + '秒'
            this.$refs.yzm.disabled = true
            if (this.time === 0) {
              this.time = 60
              this.$refs.yzm.value = '获取验证码'
              this.$refs.yzm.disabled = false
              clearInterval(this.dsq)
            }
          }, 1000)
        }).catch(() => {
          this.$message.success('每个手机号每天只能发送5次验证码! 换个手机号再试试,或者明天再来!')
        })
      } else {
        this.$message.info('请输入正确手机号')
      }
    },
    async register () {
      if (!(this.phoneVerification && this.passwordVerification && this.confirmPasswordVerification && this.nicknameVerification)) {
        return this.$message.error('请填写完整表单')
      }
      // 验证手机号是否已注册
      const { data: res } = await checkIfTheMobilePhoneNumberIsRegistered(this.registerQuery.phone)
      if (res.exist === 1) return this.$message.warning('手机号已注册!')
      // 验证验证码是否正确
      verificationcode(this.registerQuery.phone, this.registerQuery.captcha).then(async (data) => {
        if (data.data.data) {
          const { data: register } = await registerOrChangePassword(this.registerQuery)
          if (register.code === 200) {
            this.$message.success('注册成功！已自动返回登录页面')
            await this.$router.push('/login')
          }
        }
      }).catch((e) => {
        if (e.response.status === 503) {
          this.$message.warning('验证码错误!')
        } else if (e.response.status === 505) {
          this.$message.warning('该昵称已被占用!')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.register {
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
    .home {
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
    width: 400px;
    height: 500px;
    background: white;
    padding: 30px 30px 10px 30px;
    color: #555555;
    position: relative;
    .title {
      text-align: center;
      font-weight: 600;
      font-size: 33px;
      margin-bottom: 20px;
    }
    .form {
      label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        height: 60px;
        input {
          width: 260px;
          color: #7AB6B6;
          background-color: #fff;
          font-size: 17px;
          letter-spacing: 1px;
          height: 30px;
          padding: 5px 10px 2px 25px;
          box-shadow: 0 0 0 0 transparent;
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          display: inline-block;
        }
        input::placeholder {
          font-size: 12px;
          color: #4a4a4a;
        }
        .error {
          border: 2px solid #fa2800;
          outline-color: #fa2800;
        }
        i {
          font-size: 20px;
          margin-right: 20px;
        }
        span {
          font-size: 14px;
          color: #7AB6B6;
          font-weight: 1000;
        }
        .captcha {
          display: block;
          position: absolute;
          right: -1px;
          height: 32px;
          font-size: 12px;
          padding: 0;
          background: #7AB6B6;
          text-align: center;
          border: none;
          outline: none;
          color: #4a4a4a;
          cursor: pointer;
          border-radius: 0 3px 3px 0;
          width: 70px;
        }
        .default {
          display: block;
          position: absolute;
          right: -1px;
          height: 32px;
          font-size: 12px;
          padding: 0 5px;
          background: #a5a5c1;
          border: none;
          outline: none;
          color: #4a4a4a;
          border-radius: 0 3px 3px 0;
          width: 70px;
        }
      }
      .b1 {
        color: #7AB6B6;
        background-color: #EDF6F5;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 1px;
        border-radius: 5px;
        width: 50%;
        height: 45px;
        padding: 7px 30px;
        margin: 10px auto 15px;
        border: none;
        display: block;
        position: relative;
        transition: all 0.3s ease;
        outline: none;
        overflow: hidden;
        cursor: pointer;
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
      .login {
        width: 100%;
        text-align: center;
        color: #333333;
        font-weight: 700;
        margin-top: 10px;
        a {
          color: #d6bc8b;
          transition: .1s;
        }
        a:hover {
          color: #7AB6B6;
        }
      }
      .b1:hover i {
        color: white;
      }
      .b1:hover span {
        width: 100%;
        height: 100%;
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
