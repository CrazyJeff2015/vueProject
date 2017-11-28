<template>
  <el-card class="box-card">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="small">
      <el-form-item label="二级密码" prop="pwd2" required>
        <el-input type="text" v-model="ruleForm.pwd2" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips">必须为中文汉字，最少4位，最多20位，如需修改二级安全密码必须以姓名作为凭证。</span>
      <el-form-item type="text" label="确认二级密码" prop="confirmpwd2" required>
        <el-input v-model="ruleForm.confirmpwd2" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips">必须与二级安全密码输入一致。</span>
      <el-form-item type="text" label="姓名" prop="name" required>
        <el-input v-model="ruleForm.name" placeholder=""></el-input>
      </el-form-item>
      <span class="el-tips"> </span>
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
    name: "reset_sCode",
    data: function () {
      var checkPwd2 = (rule, value, callback) => {
        var reg = /[\u4e00-\u9fa5]/;
        if (reg.test(value) == false) {
          callback(new Error('二级密码必须为中文汉字'));
        } else {
          if (this.ruleForm.confirmpwd2 !== '') {
            this.$refs.ruleForm.validateField('confirmpwd2');
          }
          callback();
        }
      };
      var checkConPwd2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pwd2) {
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
          pwd2: '',
          confirmpwd2: '',
          name: ''
        },
        rules: {
          pwd2: [
            {validator: checkPwd2, trigger: 'blur'},
            {required: true, message: '二级密码不能为空', trigger: 'blur'},
            {min: 4, max: 20, message: '二级密码长度必须在4到20位之间', trigger: 'blur'}
          ],
          confirmpwd2: [
            {validator: checkConPwd2, trigger: 'blur'},
          ],
          name: [
            {validator: checkName, trigger: 'blur'},
            {required: true, message: '姓名不能为空', trigger: 'blur'},
            {min: 2, max: 16, message: '姓名长度必须在2到16位之间', trigger: 'blur'}
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
            this.resetPwd2();
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
