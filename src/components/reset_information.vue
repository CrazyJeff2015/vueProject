<template>
  <el-card class="box-card">
    <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="150px" size="small">
      <el-form-item label='验证安全密码' prop="pwd1" required>
        <el-input type="password" v-model="ruleForm1.pwd1" auto-complete="off" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips">输入原设置的安全安全密码，修改账户信息。</span>
      <el-form-item type="text" label="邮箱" prop="email">
        <el-input v-model="ruleForm1.email" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips">如需对原邮箱地址修改，则输入新的邮箱地址，不做修改则不必填写。</span>
      <el-form-item label="手机" prop="cell" >
        <el-input v-model="ruleForm1.cell" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips">如需对原手机号码修改，则输入新的手机号码，不做修改则不必填写。</span>
      <el-form-item label="QQ" prop="qq" >
        <el-input v-model="ruleForm1.qq" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips">如需对原QQ号码修改，则输入新的QQ号码，不做修改则不必填写。</span>
      <el-form-item class="submitBtn">
        <el-button type="primary" @click="submitForm('ruleForm1')">提交</el-button>
        <el-button @click="resetForm('ruleForm1')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import api from '../request/api';
  export default {
    name: "reset_information",
    data: function () {
      var checkPwd1 = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9]+$/;
        if (reg.test(value) == false) {
          callback(new Error('安全密码只能包含字母或数字'));
        } else {

          callback();
        }
      };


      var checkCell = (rule, value, callback) => {
        var reg = /0?(13|14|15|18)[0-9]{9}/;
        if(value == ''){
            callback();
        }
        else if(reg.test(value) == false) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      var checkQQ = (rule, value, callback) => {
        var reg = /^[0-9]+$/;
        if(value == ''){
          callback();
        }else if (reg.test(value) == false) {
          callback(new Error('请输入正确的QQ号码'));
        } else {

          callback();
        }
      };
      return {
        ruleForm1: {
          pwd1: '',
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
          email: [
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ],
          qq: [
            {min: 4, max: 13, message: 'QQ长度必须在4到13位之间', trigger: 'blur'},
            {validator: checkQQ, trigger: 'blur'}

          ],
          cell: [
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
            this.resetInfo();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      resetInfo: function () {
        var _this = this;
        this.$ajax({
          url: api.editSafeMsg,
          method: 'post',
          data: _this.ruleForm1
        }).then(function (response) {
          _this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          _this.resetForm('ruleForm1')
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

