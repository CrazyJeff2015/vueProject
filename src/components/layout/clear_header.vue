<template>
  <div class="header-menu">
    <header class="header">
      <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
        <el-menu-item index="1"><h3 @click="goIndex">管理后台</h3></el-menu-item>
        <a href="javascript:void(0)" class="navbar-btn sidebar-toggle" :class="{'active':isSmall}" data-toggle="offcanvas"
           role="button" @click="toggle_left">
          <i class="el-icon-menu"></i>
        </a>
        <div class="rMenu">
          <el-menu-item index="2">
            <el-badge :value="unread" class="item" v-if="is_child!=1">
              <el-button size="small" @click="message()"><i class="el-icon-message"></i></el-button>
            </el-badge>
          </el-menu-item>
          <el-menu-item index="3">
            <el-popover ref="popover5" placement="top" width="240" v-model="visible2" popper-class="text-center" @show="updateInfo()">
              <h3 style="margin-bottom: 20px">{{loginAgentName}}</h3>
              <div v-if="is_child==0">
                <h4>佣金比例:{{loginScale}}%</h4>
                <h4>占成比例:{{soloScale}}%</h4>
                <h4>可用资产:<span v-text="loginScore"></span></h4>
                <h4 v-if="isOper==1||isOper==4">代运营余额:{{loginBankScore}}</h4>
              </div>
              <div style="text-align: center; margin: 0">
                <el-button @click="showPwd=true;visible2=false" type="primary" size="mini"><i
                  class="icon-shield icons"></i> 修改密码
                </el-button>
                <el-button type="warning" size="mini" @click="logoutMessage()"><i class="icon-logout icons"></i>安全退出
                </el-button>
              </div>
            </el-popover>
            <el-button v-popover:popover5>{{loginAgentName}} <i class="el-icon-arrow-down"></i></el-button>
          </el-menu-item>
        </div>
      </el-menu>
    </header>
    <el-dialog title="修改密码" :visible.sync="showPwd" :show-close="false">
      <reset_pass></reset_pass>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPwd = false;">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../request/api';
  import reset_pass from "../reset_pass";
  export default {
    name: "header",
    components: {
      reset_pass
    },
    data() {
      return {
        activeIndex:'1',
        userData: [],
        isSmall: false,
        visible2: false,
        showPwd: false,
      }
    },
    mounted: function () {
      var _this = this;
      this.$store.dispatch('getToken', _this.getCookie());
      this.getInfo();
      this.resize();
      this.getUnread()

    },
    computed: {
      unread: function () {
        return this.$store.state.unread.unread;
      },
      soloScale: function () {
        return this.$store.state.login.loginData.sole_scale;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      loginAgentName: function () {
        return this.$store.state.login.loginData.loginAgentName;
      },
      loginName: function () {
        return this.$store.state.login.loginData.loginName;
      },
      loginScore: function () {
        return Number(this.$store.state.login.loginData.loginScore);
      },
      loginBankScore: function () {
        return Number(this.$store.state.login.loginData.loginBankScore);
      },
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      loginIsOn: function () {
        return this.$store.state.login.loginData.loginIsOn;
      },
      loginPerfect: function () {
        return this.$store.state.login.loginData.loginPerfect;
      },
      isOper: function () {
        return this.$store.state.login.loginData.isOperate;
      },
      is_child: function () {
        return this.$store.state.login.loginData.isChild;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      isSole: function () {
        return this.$store.state.login.loginData.isSole;
      },
      soleScore: function () {
        return this.$store.state.login.loginData.soleScore;
      },
      pId: function () {
        return this.$store.state.login.loginData.pId;
      },

    },
    methods: {
      checkScore(value){
          if(this.isSole==1){
              value = Number(value)*(-1)
          }
          return value;
      },
      message(){
        if (this.loginId==1||this.pId==1) {
          this.$router.push('/user/sysMessage');
        } else if (this.isOper==1||this.isOper==4) {
          this.$router.push('/user/operMessage');
        } else {
          this.$router.push('/user/mesManage');
        }
      },
      goIndex(){
        if(this.is_child ==1){
          this.$router.push('/')
        }else if(this.loginId==1){
          this.$router.push('/dIndex')
        }else if(this.isOper==1||this.isOper==4){
          this.$router.push('/oIndex')
        }else {
          this.$router.push('/aIndex')
        }
      },
      updateInfo: function () {
        //获取最新用户数据
        var _this = this;
        this.$ajax.get(api.updateUserInfo)
          .then(function (response) {
            _this.userData = response.data.data;
            if (_this.userData.is_on == 0) {
              _this.logout();
            }
            if (_this.userData.is_operate == 2) {
              _this.checkOper(_this.userData.id)
            }
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
          console.log(error);
          if (error.message == "Unauthenticated.") {
            _this.logout500();
          }
        })
      },


      //获取最新用户数据
      getInfo: function () {
        //获取最新用户数据
        var _this = this;
        this.$ajax.get(api.updateUserInfo)
          .then(function (response) {
            _this.userData = response.data.data;
            if (_this.userData.is_on == 0) {
              _this.logout();
            }
            if (_this.userData.is_operate == 2) {
              _this.checkOper(_this.userData.id)
            }
            if (_this.userData.perfect == 0&&_this.userData.is_child ==0) {
              _this.$message({
                message: '尚未完善资料，请点击左侧信息管理->修改资料进行完善。',
                type: 'warning'
              });
            }
            _this.permissionsData = response.data.data.permission;
            _this.diapatchPermissions(_this.permissionsData)
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
          console.log(error);
          if (error.message == "Unauthenticated.") {
            _this.logout500();
          }
        })
      },
      checkOper(id){
        this.$ajax({
          url: api.checkOperStatus,
          method: "post",
          data: {
            id: id
          }
        }).then(function (response) {

        }).catch(function (error) {

        })
      },
      getUnread(){
        var _this = this;
        this.$ajax.get(api.unreadNum).then(function (response) {
          _this.$store.dispatch('getNum', response.data.data.num);
        })
      },

      logoutMessage: function () {
        var _this = this;
        this.$confirm('退出系统后，您将回到登录界面。', '确定退出系统？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.logout();
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消安全退出',
            offset: 50,
            duration: 800
          });
        });

      },
      logout: function () {
        this.removeCookie();
        this.$router.push('/login');
        var _this = this;
        this.$ajax.post(api.logout)
          .then(function (response) {
          })
          .catch(function (error) {
            _this.$router.push('/login');
          });
      },
      logout500: function () {
        this.removeCookie();
        this.$router.push('/login');
      },
      diapatchPermissions: function (permission) {
        var obj = {};
        for (var k in permission) {
          var b = permission[k];
          obj[b] = true;
        }
        this.$store.dispatch('getPermissionsData', obj);

      },
      focuspsw: function () {
        this.$router.push('/user/agent_detail');
      },
      resize: function () {
        if ($(window).width() <= 992) {
          this.isSmall = true;
        }
        var _this = this;
        $(window).resize(function () {
          if ($(window).width() <= 992) {
            _this.isSmall = true;
          } else {
            _this.isSmall = false;
          }
        });
      },
      //Enable sidebar toggle
      toggle_left() {
        this.isSmall = !this.isSmall;
        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {

          $('.row-offcanvas').toggleClass('active').toggleClass("relative");
          $('.left-side').removeClass("collapse-left");
          $(".right-side").removeClass("strech");
        } else {
          //Else, enable content streching
          $('.left-side').toggleClass("collapse-left");
          $(".right-side").toggleClass("strech");
        }
      },
      adjust_boxright() {
        if ($('body').hasClass('boxed') && $("body").hasClass("sidebar-right-opened")) {
          var window_w = $(window).width();
          var body_w = $('body').width();
          var margin_right = (window_w - body_w) / 2;
          $('#right').css('right', margin_right);
        }
      }
    }
  }
</script>

<style scoped>

  .header-tips {
    color: #2ea8e5;
    font-size: 12px;
    display: inline-block;
    padding: 0 25px;
    margin-top: 16px;
    text-align: right;
  }

  .iconUser {
    font-size: 18px;
    font-weight: bold;
    color: #666;
  }

  .nav_profile .profile-left h3 {
    color: #888;
  }

  .header-info {
    margin: 0;
    padding: 0 20px;
    display: inline-block;
  }

  .navbar-btn.sidebar-toggle {
    position: absolute;
    left: 260px;
    top: 50%;
    z-index: 9999;
    font-size: 25px;
    margin-top: -18px;
    color: #2196F3;
  }

  .header-info li {
    list-style: none;
    margin: 0;
    padding: 14px 5px 10px;
    display: inline-block;
    font-size: 14px;
  }

  .datatxt {
    color: #20a0ff;
    cursor: pointer;
    font-size: 16px;
    margin-left: 5px;
    font-weight: bold;
  }

  .ok_message:focus {
    outline: none;
  }

  ul.errors {
    color: #f00;
  }

  @media (max-width: 1180px) {
    .header-info, .header-tips {
      display: inline-block;
    }

    .header-info li {
      padding: 5px;
    }

    .header-tips {
      margin-top: 0;
      margin-bottom: 5px;
      text-align: left;
    }
  }
</style>
