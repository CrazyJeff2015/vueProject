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
    <el-card class="box-card">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="small">
        <el-form-item label="上级代理号">
          <el-input type="text" :value="loginName" placeholder="" disabled></el-input>
        </el-form-item>
        <span class="el-tips"> 自身佣金比例:<span v-text="loginScale"></span>%</span>
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
        <el-form-item type="text" label="代理佣金比例(%)" prop="scale" required>
          <el-input v-model="ruleForm.scale" placeholder=""></el-input>
        </el-form-item>
        <el-form-item v-if="pId==1||loginId==1" label="类型" required>
          <el-radio-group v-model="ruleForm.type">
            <el-radio-button label="0">普通</el-radio-button>
            <el-radio-button label="1">独家</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="submitBtn">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="成功开通代理" size="large" :visible.sync="showInfo" :show-close="false">
      <div id="copyText">
        <h4> 您好，您已成功开通代理，以下代理管理员账号和网址请妥善保管。</h4>
        <p>代理推广网址：{{newAgentInfo.anameWeb}}</p>
        <p>管理后台网址：{{myUrl}}</p>
        <p>后台登陆账号：{{newAgentInfo.agentName}}</p>
        <p>后台登陆密码：{{savePwd}}</p>
        <p>代理分成比例：{{newAgentInfo.scale}}%</p>
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
        var reg =  /[a-zA-Z][a-zA-Z0-9]{2,10}/;
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
        if (value<=0||value>(parseInt(this.loginScale)-1)) {
          callback(new Error('请填写正确的佣金比例'));
        } else {
          callback();
        }
      };
      var checkAgentScale = (rule, value, callback) => {
        if (value<=0||value>(parseInt(this.loginScale)-2)) {
          callback(new Error('请填写正确的佣金比例'));
        } else {
          callback();
        }
      };
      return {
        randomPwd: '0',
        showInfo: false,
        showAdd:false,
        showEdit:false,
        myUrl: '',
        newAgentInfo: [],
        warmData: '',
        warmId: '',
        warmMsg: '',
        savePwd:'',
        addMsg:'',
        newWarm:'',
        editorOption: {

        },
        ruleForm: {
          aname: '',
          agent_name: '',
          pwd: '',
          scale: '',
          type:0
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
          scale:[
            {required: true, message: '佣金比例不能为空', trigger: 'blur'},
            {validator: checkAdminScale, trigger: 'change'},
          ]
        },
        rules2: {
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
          scale:[
            {required: true, message: '佣金比例不能为空', trigger: 'blur'},
            {validator: checkAgentScale, trigger: 'change'},
          ]
        }
      }
    },
    computed: {
      loginName: function () {
        return this.$store.state.login.loginData.loginName;
      },
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      pId: function () {
        return this.$store.state.login.loginData.pid;
      },

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.makeNew();
          } else {
            return false;
          }
        });
      },
      submitForm2(formName) {
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

      resetPwd2: function () {
        var _this = this;
        this.$ajax({
          url: api.editPwd2,
          method: 'post',
          data:_this.ruleForm
        }).then(function (response) {
          if(response.data.code==200){
            _this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            });
            _this.resetForm('ruleForm')

          }
        }).catch(function (error) {
          console.log(error);
        })
      },
      //复制
      copyFn:function () {
        var _this= this;
        $(document).ready(function () {
          jQuery.fn.outerHTML = function() {
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
      onEditorChange({editor, html, text}) {
        this.warmMsg = html;
      },
      onEditorChange1({editor, html, text}) {
        this.addMsg = html;
      },
      addWarm:function () {
        var _this = this;
        this.$ajax({
          url: api.addWarm,
          method: 'post',
          data: {
            aid: 0,
            content: _this.addMsg
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showAdd= false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getWarm();
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      sentWarm: function () {
        var _this = this;
        this.$ajax({
          url: api.editWarm,
          method: 'put',
          data: {
            id: _this.warmId,
            content: _this.warmMsg
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showEdit= false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getWarm();
          }
        }).catch(function (error) {
          console.log(error)
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
      //富文本编辑器

      editWarm: function (id, value) {
        this.warmId=id;
        this.warmMsg = value;
        this.showEdit = true;
      },
      makeNew: function () {
        var _this = this;
        this.$ajax({
          url: api.setAgent,
          method: 'post',
          data:_this.ruleForm
        }).then(function (response) {
          _this.savePwd =JSON.parse(JSON.stringify(_this.ruleForm.pwd))
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
      }
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
</style>


