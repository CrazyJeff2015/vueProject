<template>
  <div class="secure">
    <!--未完善安全密码-->
    <el-card class="box-card"  v-if="isPerfect==0">
      <div slot="header" class="clearfix">
        <span>初始化安全密码信息，请您先完善后方可进行商户余额提款等操作</span>
      </div>
      <em class="text-left" style="margin-bottom: 20px">说明：安全密码在代理转出提款时作为验证信息，请要求完善，因随意填写造成信息核对严重不符，平台有权扣留佣金以免冒领。</em>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="small">
        <el-form-item label='安全密码' prop="pwd1" required>
          <el-input type="password" v-model="ruleForm.pwd1" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">必须是数字或字母，密码长度为6-12位。</span>
        <el-form-item label="确认安全密码" prop="confirmpwd1" required>
          <el-input type="password" v-model="ruleForm.confirmpwd1" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">必须与安全密码输入一致。</span>
        <!--<el-form-item label="二级密码" prop="pwd2" required>-->
          <!--<el-input type="text" v-model="ruleForm.pwd2" placeholder=""></el-input>-->
        <!--</el-form-item>-->
        <!--<span class="el-tips">必须为中文汉字，最少4位，最多20位，如需修改二级安全密码必须以姓名作为凭证。</span>-->
        <!--<el-form-item type="text" label="确认二级密码" prop="confirmpwd2" required>-->
          <!--<el-input v-model="ruleForm.confirmpwd2" placeholder=""></el-input>-->
        <!--</el-form-item>-->
        <!--<span class="el-tips">必须与二级安全密码输入一致。</span>-->
        <el-form-item type="text" label="姓名" prop="name" required>
          <el-input v-model="ruleForm.name" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips"> <span style="color: red;">必须牢记，提交后不能修改，</span>可填写真实姓名或平台会员账户或昵称等作为找回密码的凭证。</span>
        <el-form-item type="text" label="邮箱" prop="email" required>
          <el-input v-model="ruleForm.email" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">作为核对代理信息，修改找回安全密码等操作的凭证，请正确填写。</span>
        <el-form-item label="手机" prop="cell" required>
          <el-input v-model="ruleForm.cell" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">作为核对代理信息，修改找回安全密码等操作的凭证，请正确填写。</span>
        <el-form-item label="QQ" prop="qq" required>
          <el-input v-model="ruleForm.qq" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">作为核对代理信息，修改找回安全密码等操作的凭证，请正确填写。</span>
        <el-form-item class="submitBtn">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <!--已完善安全密码-->
    <div v-else>
      <el-tabs value="first">
        <el-tab-pane label="修改安全密码" name="first">  <reset_fCode></reset_fCode>
        </el-tab-pane>
        <!--<el-tab-pane label="修改二级安全密码" name="second">-->
          <!--<reset_sCode></reset_sCode>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="修改安全验证信息" name="third">
          <reset_information></reset_information>
        </el-tab-pane>
        <el-tab-pane label="修改登陆密码" name="four">
         <el-card>
           <reset_pass></reset_pass>
         </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import api from '../request/api';
  import reset_fCode from "./reset_fCode";
  import reset_pass from "./reset_pass";
//  import reset_sCode from "./reset_sCode";
  import reset_information from "./reset_information";
  import ElCard from "../../node_modules/element-ui/packages/card/src/main";
  export default {
    name: "secure_code",
    components: {
      ElCard,
      reset_fCode,
//      reset_sCode,
      reset_information,
      reset_pass
    },
    computed: {
      isPerfect: function () {
        return this.$store.state.login.loginData.loginPerfect;
      }
    },
    data: function () {
      var checkPwd1 = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9]+$/;
        if (reg.test(value) == false) {
          callback(new Error('安全密码只能包含字母或数字'));
        } else {
          if (this.ruleForm.confirmpwd1 !== '') {
            this.$refs.ruleForm.validateField('confirmpwd1');
          }
          callback();
        }
      };
      var checkConPwd1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pwd1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
//      var checkPwd2 = (rule, value, callback) => {
//        var reg = /[\u4e00-\u9fa5]/;
//        if (reg.test(value) == false) {
//          callback(new Error('二级密码必须为中文汉字'));
//        } else {
//          if (this.ruleForm.confirmpwd2 !== '') {
//            this.$refs.ruleForm.validateField('confirmpwd2');
//          }
//          callback();
//        }
//      };
//      var checkConPwd2 = (rule, value, callback) => {
//        if (value === '') {
//          callback(new Error('请再次输入密码'));
//        } else if (value !== this.ruleForm.pwd2) {
//          callback(new Error('两次输入密码不一致!'));
//        } else {
//          callback();
//        }
//      };

      var checkName = (rule, value, callback) => {
        var reg = /[\u4e00-\u9fa5]/;
        if (reg.test(value) == false) {
          callback(new Error('姓名必须为中文汉字'));
        } else {
          callback();
        }
      };


      var checkCell = (rule, value, callback) => {
        var reg = /0?(13|14|15|18)[0-9]{9}/;
        if (reg.test(value) == false) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      var checkQQ = (rule, value, callback) => {
        var reg = /^[0-9]+$/;
        if (reg.test(value) == false) {
          callback(new Error('请输入正确的QQ号码'));
        } else {

          callback();
        }
      };
      return {
        ruleForm: {
          pwd1: '',
          confirmpwd1: '',
          name: '',
          cell: '',
          email: '',
          qq: ''
        },
        rules: {
          pwd1: [
            {validator: checkPwd1, trigger: 'blur'},
            {required: true, message: '安全密码不能为空', trigger: 'blur'},
            {min: 6, max: 12, message: '安全密码长度必须在6到12位之间', trigger: 'blur'}
          ],
          confirmpwd1: [
            {validator: checkConPwd1, trigger: 'blur'},
          ],
          name: [
            {validator: checkName, trigger: 'blur'},
            {required: true, message: '姓名不能为空', trigger: 'blur'},
            {min: 2, max: 16, message: '姓名长度必须在2到16位之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ],
          qq: [
            {required: true, message: 'QQ不能为空', trigger: 'blur'},
            {min: 4, max: 13, message: 'QQ长度必须在4到13位之间', trigger: 'blur'},
            {validator: checkQQ, trigger: 'blur'}

          ],
          cell: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'},
            {validator: checkCell, trigger: 'blur'}
          ]
        }
      }
    },
    mounted: function () {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sentInfo();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getInfo: function () {
        //获取最新用户数据
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
      sentInfo: function () {
        var _this = this;
        this.$ajax({
          url: api.addPwd,
          method: 'post',
          data: _this.ruleForm
        }).then(function (response) {
          _this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          _this.resetForm('ruleForm')
          _this.getInfo();
        }).catch(function (error) {
          console.log(error);
        })
      }
    },
    destroyed: function () {

    }
  }
</script>
<style type="text/css" scoped>
  div.container.reset {
    padding-top: 6.5%;
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: radial-gradient(ellipse at center, #5A93AF 0%, #004E74 100%);
    overflow-y: auto;
  }

  .el-form {
    font-size: 0;
  }

  .el-tips {
    margin-left: 2%;
    vertical-align: middle;
    display: inline-block;
    width: 47%;
    font-size: 14px;
  }

  em {
    padding-left: 34px;
    font-style: normal;
    color: #999;
    margin: 10px 0;
    display: block;
  }


  .tips {
    margin-bottom: 0;
    padding-top: 7px;
  }

  .secure .el-form-item {
    display: inline-block;
    width: 50%;
  }

  @media (min-width: 768px) {
    .reset-label {
      text-align: right;
      margin-bottom: 0;
      padding: 7px 0 0 0;
    }
  }
</style>
