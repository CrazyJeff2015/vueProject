<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>温馨提示</span>
      </div>
      <div v-for="item in warmData">
        <div v-html="item.content"></div>
      </div>

    </el-card>
    <el-card class="box-card" v-if="showS">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="small">
        <el-form-item label="上级代理号">
          <el-input type="text" :value="loginName" placeholder="" disabled></el-input>
        </el-form-item>
        <span class="el-tips">上级佣金比例:<span v-text="loginScale"></span>% 上级占成比例:<span v-text="soloScale"></span>%</span>
        <el-form-item label="新开代理号" prop="aname" required>
          <el-input type="text" v-model="ruleForm.aname" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">3-10位字母或数字的组合，必须以字母开头，字母不区分大小写，作为该新开代理的唯一标识</span>
        <el-form-item type="text" label="登陆账号" prop="agent_name" required>
          <el-input v-model="ruleForm.agent_name" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">3-10位字母或数字的组合，必须以字母开头，字母不区分大小写，作为该代理的登陆账号，可与代理号相同</span>
        <el-form-item type="text" label="登陆密码" prop="pwd" required>
          <el-input v-model="ruleForm.pwd" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">请输入6-16位字母或数字的组合</span>
        <el-form-item type="text" label="佣金比例(%)" prop="scale" required>
          <!--<el-input v-model="ruleForm.scale" placeholder=""></el-input>-->
          <el-slider
            v-model="ruleForm.scale"
            :max="maxAgentScale"
            :min="0"
            :disabled="parseInt(loginScale)<=default_scale"
            show-input>
          </el-slider>
        </el-form-item>
        <span class="el-tips el-s">您可开设的最大比例为 {{maxAgentScale}}%</span>
        <el-form-item type="text" label="占成比例(%)" prop="sole_scale" required>
          <el-slider
            v-model="ruleForm.sole_scale"
            :max="maxSoleScale"
            :min="0"
            :disabled="parseInt(soloScale)<=default_sole_scale"
            show-input>
          </el-slider>
        </el-form-item>
        <span class="el-tips el-s">您可开设的最大比例为 {{maxSoleScale}}%</span>

        <el-form-item class="submitBtn">
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ifSet">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="成功开通代理" size="large" :visible.sync="showInfo" :show-close="false">
      <div id="copyText">
        <p v-if="newAgentInfo.scale==0&&newAgentInfo.sole_scale==0">您好，您已成功开通代理，该账号为特殊账号，无法登陆此系统，如有疑问请与客服联系。</p>
        <div v-else>
          <h4> 您好，您已成功开通代理，以下代理管理员账号和网址请妥善保管。</h4>
          <p>代理推广网址：{{newAgentInfo.anameWeb}}</p>
          <p>管理后台网址：{{myUrl}}</p>
          <p>后台登陆账号：{{newAgentInfo.agentName}}</p>
          <p>后台登陆密码：{{savePwd}}</p>
          <p>代理佣金比例：{{newAgentInfo.scale}}%</p>
          <p>代理占成比例：{{newAgentInfo.sole_scale}}%</p>
        </div>

      </div>
      <h4>谢谢您支持，建议将本页复制保存文件！</h4>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showInfo=false">关 闭</el-button>
        <el-button type="primary" @click="copyFn()">复 制</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "set_agent",
    mounted: function () {
      this.getWarm();
      this.updataMsg();
      this.myUrl = document.domain;
    },
    data: function () {
      var checkAname = (rule, value, callback) => {
        var reg = /[a-zA-Z][a-zA-Z0-9]{2,10}/;
        if (reg.test(value) == false) {
          callback(new Error('必须以字母开头，3-10位字母或数字的组合'));
        } else {

          callback();
        }
      };
      var checkAgentName = (rule, value, callback) => {
        var reg = /[a-zA-Z][a-zA-Z0-9]{2,10}/;
        if (reg.test(value) == false) {
          callback(new Error('必须以字母开头，3-10位字母或数字的组合'));
        } else {

          callback();
        }
      };

      var checkPwd = (rule, value, callback) => {
        var reg = /[a-zA-Z0-9]{6,16}/;
        if (reg.test(value) == false) {
          callback(new Error('请输入6-16位字母或数字的组合'));
        } else {
          callback();
        }
      };
      var checkAdminScale = (rule, value, callback) => {
        if (this.maxScale == 0) {
          callback()
        }
        else if (value < 0 || value > (parseInt(this.loginScale) - 1)) {
          callback(new Error('佣金比例不可小于0或高于自身佣金比例'));
        } else {
          callback()
        }
      };
      var checkSoleScale = (rule, value, callback) => {
        if (this.maxSoleScale == 0) {
          callback()
        } else if (value < 0 || value > (parseInt(this.soloScale) - 1)) {
          callback(new Error('占成比例不可小于0或高于自身占成比例'));
        } else {
          callback()
        }
      };
      return {
        showInfo: false,
        showAdd: false,
        showEdit: false,
        myUrl: '',
        newAgentInfo: [],
        warmData: '',
        warmId: '',
        warmMsg: '',
        savePwd: '',
        addMsg: '',
        newWarm: '',
        editorOption: {},
        ruleForm: {
          aname: '',
          agent_name: '',
          pwd: '',
          scale: 0,
          sole_scale: 0
        },
        showOption: {
          theme: 'bubble',
          modules: {
            toolbar: []
          }
        },
        rules: {
          aname: [
            {required: true, message: '代理号不能为空', trigger: 'blur'},
            {validator: checkAname, trigger: 'blur'}
          ],
          agent_name: [
            {required: true, message: '登陆账号不能为空', trigger: 'blur'},
            {validator: checkAgentName, trigger: 'blur'},
          ],
          pwd: [
            {required: true, message: '登陆密码不能为空', trigger: 'blur'},
            {validator: checkPwd, trigger: 'blur'},
          ],
          scale: [
//            {required: true, message: '佣金比例不能为空', trigger: 'change,blur'},
            {validator: checkAdminScale, trigger: 'change,blur'},
          ],
          sole_scale: [
//            {required: true, message: '占成比例不能为空', trigger: 'change,blur'},
            {validator: checkSoleScale, trigger: 'change,blur'},
          ]
        },
        showS: false,
        userData: []
      }
    },
    computed: {
      loginName: function () {
        return this.$store.state.login.loginData.loginName;
      },
      loginScale: function () {

        return this.$store.state.login.loginData.loginScale;
      },
      maxAgentScale: function () {
        var num = parseInt(this.loginScale) - 1;
        num < 0 ? (num = 0) : num = num;
        return num;

      },
      ifSet: function () {
        if (this.loginScale <= this.default_scale && this.soloScale <= this.default_sole_scale) {
          return true;
        } else {
          return false;
        }
      },
      maxSoleScale: function () {
        var num = parseInt(this.soloScale) - 1;
        num < 0 ? (num = 0) : num = num;
        return num;
      },
      maxScale: function () {
        var num = parseInt(this.loginScale) - 1;
        num < 0 ? (num = 0) : num = num;
        return num;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      pId: function () {
        return this.$store.state.login.loginData.pid;
      },
      soloScale: function () {
        return this.$store.state.login.loginData.sole_scale;
      },
      default_scale: function () {
        return this.$store.state.login.loginData.default_scale;
      },
      default_sole_scale: function () {
        return this.$store.state.login.loginData.default_sole_scale;
      }

    },
    methods: {
      updataMsg(){
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
            _this.showS = true;
          }).catch(function (error) {
          console.log(error);
          if (error.message == "Unauthenticated.") {
            _this.logout500();
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.makeNew();
          } else {
            return false;
          }
        });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      makeNew: function () {
        var _this = this;
        this.$ajax({
          url: api.setAgent,
          method: 'post',
          data: _this.ruleForm
        }).then(function (response) {
          _this.savePwd = JSON.parse(JSON.stringify(_this.ruleForm.pwd))
          _this.newAgentInfo = response.data.data;
          _this.showInfo = true;
          _this.resetForm('ruleForm')
          _this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });

        }).catch(function (erro) {

        })
      },

      //复制
      copyFn: function () {
        var _this = this;
        $(document).ready(function () {
          jQuery.fn.outerHTML = function () {
            return jQuery('<div />').append(this.eq(0).clone()).text();
          };

          var x = $("#copyText").outerHTML();
          copyTextToClipboard(x);

          function copyTextToClipboard(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea).select();
            var successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            _this.$message({
              type: 'success',
              message: '复制成功!'
            });
          }
        })
      },


      getWarm: function () {
        var _this = this;
        this.$ajax.get(api.warmNot)
          .then(function (response) {
            _this.warmData = response.data.data;
          })
          .catch(function (error) {
            console.log(error)
          })
      },


    },
    destroyed: function () {

    }
  }

</script>
<style type="text/css" scoped>
  .el-tips {
    margin-left: 2%;
    vertical-align: middle;
    display: inline-block;
    width: 47%;
    font-size: 14px;
  }

  .el-form-item {
    display: inline-block;
    width: 50%;
  }

  .el-tips.el-s {
    margin-top: -80px;
  }


</style>


