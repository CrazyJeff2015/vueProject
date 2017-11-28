<template>
  <div>
      <div  class="el-card__header">
        <span>说明：将代理金额转入到任意有效的会员账户</span>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <h4 class="r_money">代理可转出金额:<span v-text="loginScore"></span>(金额)   <el-button :plain="true" type="danger" size="small" @click="allGive()">全部转出</el-button></h4>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small">
                  <el-form-item label='会员账号'>
                    <el-input type="text" v-model="gaccount" auto-complete="off"  disabled></el-input>
                  </el-form-item>
                  <el-form-item  label="转入金额" prop="score" required>
                    <el-input type="text" v-model="ruleForm.score" auto-complete="off" placeholder="请输入金额"></el-input>
                  </el-form-item>
                  <el-form-item  label="安全密码" prop="pwd1" required>
                    <el-input type="password" v-model="ruleForm.pwd1" :placeholder="ifPerfect"></el-input>
                  </el-form-item>
                  <!--<el-form-item  type="text" label="二级密码" prop="pwd2" required>-->
                    <!--<el-input v-model="ruleForm.pwd2" placeholder="如未完善二级安全密码，请点击左侧导航“修改安全密码”"></el-input>-->
                  <!--</el-form-item>-->
                  <el-form-item type="text" label="验证码" prop="captcha" required>
                    <el-input v-model="ruleForm.captcha" placeholder="请输入验证码" style="width: 150px"></el-input>
                    <img :src="imgUrl+random" style="height:40px;margin-left: 20px" @click="changeImg()">
                  </el-form-item>
                  <el-form-item class="submitBtn">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "withdrawals",
    props: ['gaccount'],
    data: function () {
      var checkCount = (rule, value, callback) => {
        var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (value === '') {
          callback(new Error('转入金额不能为空'));
        } else if( reg.test(value) == false) {
          callback(new Error('请输入正确的金额'));
        } else if (value < 20) {
          callback(new Error('填写金额不可低于20'));
        }else if(value>this.loginScore){
          callback(new Error('填写金额超过可转出金额'));
        }else {
          callback();
        }
      };
      var checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入安全密码'));
        } else {
          callback();
        }
      };
//      var checkPwd2 = (rule, value, callback) => {
//        if (value === '') {
//          callback(new Error('请输入二级安全密码'));
//        } else {
//          this.showImg =true;
//          callback();
//        }
//      };
      return {
        userData: [],
        imgUrl: api.apiUrl + api.imgUrl,
        random: 1,
        showImg:false,
        ruleForm: {
          gaccount: '',
          pwd1: '',
          captcha: '',
          score:'',
        },
        rules:{
          pwd1: [
            { validator: checkPwd, trigger: 'blur' }
          ],
//          pwd2: [
//            { validator: checkPwd2, trigger: 'blur' }
//          ],
          score:[
            { validator: checkCount, trigger: 'change' }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      loginScore: function () {
        return Number(this.$store.state.login.loginData.loginScore);
      },
      loginPerfect: function () {
        return this.$store.state.login.loginData.loginPerfect;
      },
      ifPerfect:function () {
        if(this.loginPerfect==1){
            return '请输入安全密码';
        }else {
            return '请先完善资料';
        }
      }
    },
    mounted: function () {
      this.changeImg();
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sentMoney();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      refresh: function () {
        var _this = this;
        this.$ajax.get(api.updateUserInfo)
          .then(function (response) {
            _this.userData = response.data.data;
            _this.$store.dispatch('getLoginData', {
              'loginId': _this.userData.id,
              'loginAgentName': _this.userData.agent_name,
              'loginName': _this.userData.aname,
              'loginScore': _this.userData.score,
              'loginScale': _this.userData.scale,
              'loginIsOn': _this.userData.is_on,
              'loginPerfect': _this.userData.perfect,
              'loginBankScore': _this.userData.bank_score,
              'isChild': _this.userData.is_child,
              'isOperate': _this.userData.is_operate,
              'pid': _this.userData.pid,
              'isSole': _this.userData.is_sole,
              'soleScore':_this.userData.sole_score,
              'createdAt':_this.userData.created_at,
              'lastLoginTime':_this.userData.last_login_time,
              'is_agent':_this.userData.is_agent,
              'qq':_this.userData.qq,
              'cell':_this.userData.cell,
              'email':_this.userData.email,
              'sole_scale':_this.userData.sole_scale,
              'default_sole_scale':_this.userData.default_sole_scale,
              'default_scale':_this.userData.default_scale,
              'updateTime': _this.dataFormat(new Date(),"yyyy-MM-dd hh:mm:ss")
            });
          }).catch(function (error) {
        })
      },
      sentMoney: function () {
       this.ruleForm.gaccount = this.gaccount;
        var _this = this;
        _this.changeImg();
        this.$ajax({
          url: api.giveMoney,
          method: 'post',
          data: _this.ruleForm
        })
          .then(function (response) {
            if (response.data.code == 200) {
              _this.changeImg();
              _this.refresh();
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
            }
          })
          .catch(function (error) {

          });
      },
      changeImg: function () {
        this.random = Math.random();
      },
      allGive: function () {
        this.ruleForm.score = this.$store.state.login.loginData.loginScore;
      },

    },
    destroyed: function () {

    },

  }
</script>

<style type="text/css" scoped>

  .tips {
    margin-bottom: 0;
    padding-top: 7px;
  }
  .r_money span {
    color: red;
  }

  p {
    margin: 20px;
  }

  h4 {
    margin: 18px;
  }

  @media (min-width: 768px) {
    .reset-label {
      text-align: right;
      margin-bottom: 0;
      padding-top: 7px;
    }
  }
</style>




