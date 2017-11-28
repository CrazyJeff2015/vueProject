<template>
  <div>
    <el-form :label-position="position" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" >
      <el-form-item label="旧密码" prop="pwd" required>
        <el-input type="password" v-model="ruleForm2.pwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpwd" required>
        <el-input type="password" v-model="ruleForm2.newpwd" auto-complete="on"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmpwd" required>
        <el-input type="password" v-model="ruleForm2.confirmpwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from '../request/api';
export default {
    name: "reset_password",
    data:function(){
      var validateOldPass = (rule, value, callback) => {
          var reg = /^[\w]{6,12}$/;
        if (!value) {
          return callback(new Error('旧密码不能为空'));
        }else if(reg.test(value)==false){
          return callback(new Error('必须是数字或字母，密码长度为6-12位，字母不区分大小写'));
        }else {
            callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        var reg = /^[\w]{6,12}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if(reg.test(value)==false){
            return callback(new Error('必须是数字或字母，密码长度为6-12位，字母不区分大小写'))
          }
          if (this.ruleForm2.confirmpwd !== '') {
            this.$refs.ruleForm2.validateField('confirmpwd');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.newpwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return{
          ruleForm2: {
            pwd:'',
            newpwd:'',
            confirmpwd:''
          },
          position:'left',
          rules2: {
            newpwd: [
              { validator: validatePass, trigger: 'change' }
            ],
            confirmpwd: [
              { validator: validatePass2, trigger: 'change' }
            ],
            pwd: [
              { validator: validateOldPass, trigger: 'change' }
            ]
          },
        }

    },
  computed: {
    focusPsw: function () {
      return this.$store.state.resetPsw.focusPsw;
    }
  },
    mounted: function() {

    },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setNewPwd();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
      setNewPwd:function () {
        var _this = this;
        this.$ajax({
          url:api.editPwd,
          method:'post',
          data:_this.ruleForm2
        }).then(function (response) {
          _this.resetForm('ruleForm2')
          if(response.data.code == 200){
            _this.subSuccess();
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
    logout: function () {
      this.removeCookie();
      this.$router.push('/login');
      this.$ajax.post(api.logout)
        .then(function (response) {
        })
        .catch(function (error) {
          this.$router.push('/login');
        });
    },
    subSuccess: function () {
      this.$confirm('请退出系统重新登录！', '密码修改成功', {
        confirmButtonText: '确定退出',
        type: 'success',
        showCancelButton:false,
        closeOnPressEscape:false,
        closeOnClickModal:false
      }).then(() => {
          this.logout();
      }).catch(() => {
        this.logout();
      });
    },
    },
    destroyed: function() {

    }
}
</script>
<style type="text/css" scoped>

  .el-form.demo-ruleForm {
    width: 80%;
    margin: 20px auto;
  }

</style>
