<template>
    <el-card class="box-card">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="small">
        <el-form-item label='新安全密码' prop="pwd1" required>
          <el-input type="password" v-model="ruleForm.pwd1" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">必须是数字或字母，密码长度为6-12位。</span>
        <el-form-item label="确认安全密码" prop="confirmpwd1" required>
          <el-input type="password" v-model="ruleForm.confirmpwd1" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">必须与新安全密码输入一致。</span>
        <el-form-item type="text" label="验证姓名" prop="name" required>
          <el-input v-model="ruleForm.name" placeholder=""></el-input>
        </el-form-item>
        <span class="el-tips">修改验证必须填写。</span>
        <el-form-item class="submitBtn">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script>
  import api from '../request/api';
  export default {
    name: "reset_fCode",
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
      var checkName = (rule, value, callback) => {
        var reg = /[\u4e00-\u9fa5]/;
        if (reg.test(value) == false) {
          callback(new Error('姓名必须为中文汉字'));
        } else {
          callback();
        }
      };


      return {
        ruleForm: {
          pwd1: '',
          confirmpwd1: '',
          name:''
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
            {required: true, message: '姓名不能为空', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
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
            this.resetPwd1();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      resetPwd1: function () {
        var _this = this;
        this.$ajax({
          url: api.editPwd1,
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
      }
    },
    destroyed: function () {

    }
  }
</script>
<style scoped>
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
