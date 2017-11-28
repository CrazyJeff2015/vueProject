<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>用户信息管理</span>
      </div>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户ID:" prop="uid">
              <el-input type="text" v-model="ruleForm.uid" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户账号:" prop="gaccount">
              <el-input type="text" v-model="ruleForm.gaccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="id_name">
              <el-input type="text" v-model="ruleForm.id_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证:" prop="id_card">
              <el-input type="text" v-model="ruleForm.id_card" disabled></el-input>
            </el-form-item>
            <el-form-item label="QQ:" prop="qq">
              <el-input type="text" v-model="ruleForm.qq"></el-input>
            </el-form-item>
            <el-form-item label="tel:" prop="tel">
              <el-input type="text" v-model="ruleForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="ruleForm.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="submitBtn">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推荐用户:" prop="recommended_user">
              <el-input type="text" v-model="ruleForm.recommended_user" disabled></el-input>
            </el-form-item>
            <el-form-item label="注册时间:" prop="create_time">
              <el-input type="text" v-model="ruleForm.create_time" disabled></el-input>
            </el-form-item>
            <el-form-item label="注册IP:">
              <el-input type="text" v-model="ip" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属代理:" prop="top_agent">
              <el-input type="text" v-model="ruleForm.top_agent" disabled></el-input>
            </el-form-item>
            <el-form-item label="email:" prop="email">
              <el-input type="text" v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="note">
              <el-input type="text" v-model="ruleForm.note"></el-input>
            </el-form-item>
            <el-form-item label="头像:">
              <img :src="userAvatar" alt="" class="avatar">
              <el-select placeholder="请选择" v-model="avatarIndex" @change="avatarHandle">
                <el-option
                  v-for="item in avatars"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                  <span style="float: left">头像{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">  <img :src="item.value" alt=""
                                                                                     class="avatarList"></span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>系数信息</span>
      </div>
      <div class="text-left">
        <span>系数金币：</span>
        <span v-text="ruleForm.ai_value"></span>
        <span class="margin-30">系数速率：</span>
        <span v-text="ruleForm.ai_speed"></span>
        <el-button v-if="permissions.coefficient_onlineuser" icon="edit" @click="showEdit=true" size="small"></el-button>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>密码管理</span>
      </div>
      <el-form label-width="150px">
        <el-form-item label="登陆密码:" style="width: 50%">
          <el-input v-model="setPwd.pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行密码:" style="width: 50%">
          <el-input v-model="setPwd.bank_pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="submitBtn">
          <el-button type="primary" @click="setUserPwd()">提交</el-button>
          <el-button @click="resetCon()">复位密保问题</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="系数修改" :visible.sync="showEdit" :show-close="false">
      <el-form label-width="150px" ref="ruleForm" :model="ruleForm">
        <el-form-item label="金币系数:" prop="ai_value">
          <el-input v-model="ruleForm.ai_value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="系数速率:" prop="ai_speed">
          <el-input v-model="ruleForm.ai_speed" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="aiChange()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "userInfoEdit",
    data: function () {
      var checkCell = (rule, value, callback) => {
        var reg = /0?(13|14|15|18)[0-9]{9}/;
        if (!value) {
          callback()
        } else if (reg.test(value) == false) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      var checkQQ = (rule, value, callback) => {
        var reg = /^[0-9]+$/;
        if (!value) {
          callback()
        } else if (reg.test(value) == false) {
          callback(new Error('请输入正确的QQ号码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {},
        data: {},
        rules: {
          email: [
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ],
          qq: [
            {validator: checkQQ, trigger: 'blur'}

          ],
          tel: [
            {validator: checkCell, trigger: 'blur'}
          ]
        },
        userAvatar: '',
        avatars: [
          {
            value: '/static/img/authors/1.jpg',
            label: '1'
          },
          {
            value: '/static/img/authors/2.jpg',
            label: '2'
          }
          ,
          {
            value: '/static/img/authors/3.jpg',
            label: '3'
          }
          ,
          {
            value: '/static/img/authors/4.jpg',
            label: '4'
          }
          ,
          {
            value: '/static/img/authors/5.jpg',
            label: '5'
          }
          ,
          {
            value: '/static/img/authors/6.jpg',
            label: '6'
          }
          ,
          {
            value: '/static/img/authors/7.jpg',
            label: '7'
          }
          ,
          {
            value: '/static/img/authors/8.jpg',
            label: '8'
          }
          ,
          {
            value: '/static/img/authors/9.jpg',
            label: '9'
          },
          {
            value: '/static/img/authors/10.jpg',
            label: '10'
          }
          ,
          {
            value: '/static/img/authors/11.jpg',
            label: '11'
          }
          ,
          {
            value: '/static/img/authors/12.jpg',
            label: '12'
          }
          ,
          {
            value: '/static/img/authors/13.jpg',
            label: '13'
          }
          ,
          {
            value: '/static/img/authors/14.jpg',
            label: '14'
          }
          ,
          {
            value: '/static/img/authors/15.jpg',
            label: '15'
          },
          {
            value: '/static/img/authors/16.jpg',
            label: '16'
          }
          ,
          {
            value: '/static/img/authors/17.jpg',
            label: '17'
          }
          ,
          {
            value: '/static/img/authors/18.jpg',
            label: '18'
          }
          ,
          {
            value: '/static/img/authors/19.jpg',
            label: '19'
          }
          ,
          {
            value: '/static/img/authors/20.jpg',
            label: '20'
          }
        ],
        avatarIndex: '',
        showEdit: false,
        setPwd: {
          pwd: "",
          bank_pwd: ""
        },
      }
    },
    props: ['uid', 'ip'],
    mounted: function () {
      this.getUserBInfo()
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      }
    },
    watch: {
      //监听头像的改变
      avatarIndex: function () {
        this.userAvatar = '/static/img/authors/' + this.avatarIndex + '.jpg';
      }
    },
    methods: {
      resetCon(){
        this.$confirm('该操作将复位用户密保问题，是否继续？', '复位密码问题', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.resetUserPwd();
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },
      resetUserPwd() {
        var _this = this;
        this.$ajax({
          url: api.resetPwdQ + _this.uid,
          method: "put",
          data: {
            "resetSafeQues": 1
          }
        })
          .then(function (response) {
            if (response.status == 200) {
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
            }
          })
      },
      setUserPwd: function () {
        var _this = this;
        this.$ajax({
          url: api.resetPwd + _this.uid,
          method: "post",
          data: _this.setPwd
        })
          .then(function (response) {
            if (response.status == 200) {
              _this.setPwd.pwd='';
              _this.setPwd.bank_pwd='';
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
            }
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      aiChange: function () {
        var _this = this;
        this.$ajax({
          url: api.numChange,
          data: {
            uid: _this.uid,
            ai_value: _this.ruleForm.ai_value,
            ai_speed: _this.ruleForm.ai_speed
          },
          method: "post"
        }).then(function (response) {
          console.log(response.data.code)
          if (response.data.code == 200) {
            _this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            });
            _this.showEdit = false;
            _this.showUserInfo();
          }
        }).catch(function () {
          _this.getUserBInfo();
        })
      },
      getUserBInfo: function () {

        var requestUrl = api.getUserBinfo + this.uid;
        var _this = this;
        this.$ajax.get(requestUrl)
          .then(function (response) {
            _this.ruleForm = response.data.data;
            _this.userAvatar = '/static/img/authors/' + _this.ruleForm.user_avatar + '.jpg';
          })
          .catch(function (error) {
            console.log(error);
          });

      },
      avatarHandle(value){
        this.ruleForm.user_avatar = value;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.userInfoEditFn();
          } else {
            return false;
          }
        });
      },
      userInfoEditFn: function () {
        var _this = this;
        this.$ajax({
          url: api.saveUserInfo + _this.uid,
          method: "post",
          data: _this.ruleForm
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getUserBInfo();
            _this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })

      },

    },
    destroyed: function () {

    }

  }
</script>
<style type="text/css" scoped>
  .avatar {
    width: 50px;
  }

  .avatarList {
    width: 36px;
  }
</style>


