<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">Ccsp CMS</h3>
      <el-form-item prop="account">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="account" type="text" v-model="loginForm.account" autoComplete="on" placeholder="account" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="password"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="code">
            <span class="svg-container">
              <svg-icon icon-class="security"></svg-icon>
            </span>
            <el-input name="code" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.code" autoComplete="off" placeholder="security code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <img class="code-img" :src="codeImg.url" alt="" @click="changeCode">
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error(this.$t('message.invalidAccount')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error(this.$t('message.invalidPassword')))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error(this.$t('message.invalidCode')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: '',
        code: '',
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      pwdType: 'password',
      codeImg: ''
    }
  },
  methods: {
    
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    //登录
    handleLogin() {
      this.$http.post(process.env.API_ROOT+'/cms/sys/login',this.loginForm,{'headers':{
          'Content-Type':'application/json'
       }}
        ).then(function(response){
          const datas = response.data
          if(datas.data!=null){
              this.GLOBAL.token = datas.data.token
              // this.TSetC(datas.data.token,1)
               setToken(datas.data.token)
            if(this.GLOBAL.token!='1'){
              this.$router.push({ path: '/dashboard' })
            }
          }else{
            if(datas.code===1001){
              this.$message({
                message: this.$t('message.codeError'),
                type: 'error'
              })
              this.changeCode()
            }else if(datas.code===301){
              this.$message({
                message: this.$t('message.Akunataukatasandisalah'),
                type: 'error'
              })
            }
          }
        },function(error){
            // console.log(error)
        })

    },
    TSetC(token,exdays){
      var exdate = new Date();
      exdate.setTime(exdate.getTime()+ 24*60*60*1000*exdays);
      window.document.cookie="token"+"="+token+";path=/;expires="+exdate.toGMTString();
    },
    //刷新验证码
    changeCode() {
      this.$http({
        method:'GET',
        url:process.env.API_ROOT+'/cms/getVerityCode?t=' + parseInt(Date.now())
      }).then(function(response){
        const datas = response.data
        this.codeImg = response
      },function(error){
        // console.log(error)
      })
    }
  },
  //获取验证码
  created() {
    this.$http({
      method:'GET',
      url:process.env.API_ROOT+'/cms/getVerityCode'
    }).then(function(response){
        this.codeImg = response
    },function(error){
      // console.log(error)
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .el-col {
    .el-input {
      width: 110px;
    }
  }
  .code-img {
    padding: 3px 0;
    position: absolute;
    right: 0;
    cursor: pointer;
  }
}
</style>
