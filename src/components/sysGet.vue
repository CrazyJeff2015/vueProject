<template>
      <el-card class="box-card">
        <div class="row">
          <div class="col-xs-12">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small">
                    <el-form-item label='账号' prop="gaccount" required>
                      <el-input type="text" v-model="ruleForm.gaccount" auto-complete="off"  placeholder="请输入会员账号" :disabled="disableFlag"></el-input>
                    </el-form-item>
                    <el-form-item  label="金额" prop="score" required>
                        <el-input  type="text" v-model="ruleForm.score" auto-complete="off" placeholder="请输入金额" :disabled="disableFlag" @focus="getMsg()"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <template scope="scope">
                      <div v-html="content"></div>
                      </template>
                    </el-form-item>

                    <el-form-item class="submitBtn">
                      <el-popover
                        ref="popover5"
                        placement="bottom"
                        width="250"
                        v-model="visible2"
                        @show="checkHandle()">
                        <p>请确认账号和金额？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="visible2 = false;disableFlag=false">取消</el-button>
                          <el-button type="primary" size="mini" @click="submitForm('ruleForm')">确定</el-button>
                        </div>
                      </el-popover>
                      <el-button type="primary" v-popover:popover5 @click="disableFlag=true">提交</el-button>
                      <el-button @click="resetForm('ruleForm');disableFlag=false;visible2=false">重置</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

      </el-card>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "sysSent",
    data: function () {
      var checkName = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9]+$/;
        if (value === '') {
          callback(new Error('会员账号不能为空'));
        } else if( reg.test(value) == false) {
          callback(new Error('请输入正确的会员账号'));
        } else {
            callback()
        }
      };
      var checkCount = (rule, value, callback) => {
        var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (value === '') {
          callback(new Error('转入金额不能为空'));
        } else if( reg.test(value) == false) {
          callback(new Error('请输入正确的金额'));
        } else if(this.limitScore<100||value<100) {
          callback(new Error('下分金额低于额度'));
        }else if(value>this.limitScore){
          callback(new Error('下分金额不可高于用户可下分金币'));
        }else {
            callback();
        }
      };

      return {
        userData: [],
        ruleForm: {
          gaccount: '',
          score:'',
        },
        limitScore:0,
        visible2:false,
        disableFlag:false,
        content:'',
        rules:{
          gaccount: [
            { validator: checkName, trigger: 'blur' }
          ],
          score:[
            { validator: checkCount, trigger: 'change' }]

        }
      }
    },
    computed: {
      loginScore: function () {
        return Number(this.$store.state.login.loginData.loginScore);
      },
      loginBankScore: function () {
        return Number(this.$store.state.login.loginData.loginBankScore);
      }
    },
    mounted: function () {
    },
    methods: {
      getMsg(){
          let _this = this;
          if(_this.ruleForm.gaccount!==''){
            this.$ajax({
              url:api.gUserInfo,
              method:'post',
              data:{
                  gaccount:_this.ruleForm.gaccount
              }
            })
              .then(function (response) {

                if(response.data.data.list==''){
                  _this.content = '请输入正确的会员账号！'
                }else{
                  _this.userData = response.data.data.list[0];
                  _this.limitScore = response.data.data.score_out_valid;
                  _this.content = '真实姓名: '+_this.userData.bank_ac_name+'<br>会员ID: '+_this.userData.uid+'<br>可下分金币: '+_this.limitScore+'<br>状态: '+(_this.userData.is_on==1?'正常':'禁用')+'<br>';
                }
              })
          }else{
              this.content='会员账号不能为空。'
          }
      },
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

      sentMoney: function () {
        var _this = this;
        this.$ajax({
          url: api.sysGet,
          method: 'post',
          data: {
             uid:_this.userData.uid,
            num:_this.ruleForm.score
          }
        })
          .then(function (response) {
            if (response.data.code == 200) {
              _this.userData = [];
              _this.disableFlag =false;
              _this.resetForm('ruleForm')
              _this.visible2= false;
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
      checkHandle(){
//        this.disableFlag=true;
      },

      allGive: function () {
        this.ruleForm.score = this.$store.state.login.loginData.loginBankScore;
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




