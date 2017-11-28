<template>
  <el-row :gutter="10" type="flex" justify="center">
    <el-col :xs="20" :sm="12" :md="8" :lg="6">
     <div class="main">
       <h1> <i class="icon-login icons"></i> Login</h1>
       <div class="grid-content bg-purple-light">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
           <el-form-item label='' prop="agent_name">
             <el-input type="text" v-model="ruleForm.agent_name" auto-complete="off"  placeholder="登录名"></el-input>
           </el-form-item>
           <el-form-item  prop="pwd">
             <el-input type="password" v-model="ruleForm.pwd" auto-complete="off" placeholder="密码"></el-input>
           </el-form-item>
           <el-form-item  prop="captcha">
             <el-input v-model="ruleForm.captcha" placeholder="验证码"></el-input>
           </el-form-item>
           <el-form-item v-show="showImg" class="img">
           <img :src="imgUrl+random" :style="{height:40+'px'}" @click="changeImg()">
           </el-form-item>
           <el-form-item class="submitBtn">
             <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
             <el-button @click="resetForm('ruleForm')">重置</el-button>
           </el-form-item>
         </el-form>
       </div>
     </div>
    </el-col>

  </el-row>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "login",
    data: function () {
      var checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          this.showImg = true;
          callback();
        }
      };
      return {
        showImg:false,
        userData: [],
        imgUrl: api.apiUrl + api.imgUrl,
        random: Math.random(),
        ruleForm: {
          agent_name: '',
          pwd: '',
          captcha: ''
        },
        rules:{
          agent_name: [
            { required: true, message: '请输入登录名', trigger: 'blur' },
            { min: 3, message: '请输入正确的登录名', trigger: 'blur' }
          ],
          pwd: [
            { validator: checkPwd, trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }

      }
    },
    mounted: function () {
      "use strict";

      var _this = this;
      $(document).ready(function () {
        //=================Preloader===========//
        $(window).on('load', function () {
          $('.preloader img').fadeOut();
          $('.preloader').fadeOut();
        });

      });
    },
    computed: {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.random = Math.random();
            this.loginAct();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      loginAct: function () {
        this.removeCookie();
        var _this = this;
        this.$ajax({
          url: api.login,
          method: 'post',
          data: {
            agent_name: _this.ruleForm.agent_name,
            pwd: _this.ruleForm.pwd,
            captcha: _this.ruleForm.captcha
          }
        })
          .then(function (response) {
               _this.userData = response.data.data;
               var value = _this.userData.access_token;
               var time = 7 * 24 * 60 * 60 * 1000;
               _this.savecookie(value, time);
               _this.$store.dispatch('getLoginData', {'loginScale': _this.userData.scale});
               _this.$store.dispatch('getToken', _this.getCookie());
               _this.successLogin();
          })
      },
      changeImg: function () {
        this.random = Math.random();
      },
      savecookie: function (value, time) {
        this.saveCookie(value, time);
      },

      successLogin: function () {
        //获取最新用户数据
        var _this = this;
        this.$ajax.get(api.updateUserInfo)
          .then(function (response) {
            var data =  response.data.data;
           if(data.is_child ==1){
               _this.$router.push('/')
           }else if(data.id==1){
               _this.$router.push('/dIndex')
           }else if(data.is_operate==1||data.is_operate==4){
               _this.$router.push('/oIndex')
           }else {
             _this.$router.push('/aIndex')
           }
          }).catch(function (error) {

        })
      },
    },
    destroyed: function () {

    }
  }
</script>
<!--<style src="../vendors/simple-line-icons/css/simple-line-icons.css"></style>-->
<style type="text/css" scoped>
  .el-row {
    padding-top: 6.5%;
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f5;
    overflow-y: auto;
  }
  .submitBtn{
    text-align: center;
  }
  .main {
    padding: 20px;
    background: #fafafa;
  }
  .name input:before{
    content: "\E003";
  }
  .img{
    text-align: center;
  }
  h1{
    color: #ccc;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
  }
</style>
