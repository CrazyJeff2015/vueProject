<template>
  <aside class="left-side sidebar-offcanvas">
    <section class="sidebar">
      <div id="menu" role="navigation">
        <adminMenu v-if="showAdmin"></adminMenu>
        <operMenu v-if="showOper"></operMenu>
        <agentMenu v-if="showAgent"></agentMenu>
      </div>
    </section>
  </aside>
</template>
<script>
  import adminMenu from "./adminMenu.vue";
  import operMenu from "./operMenu.vue";
  import agentMenu from "./agentMenu.vue";
  import api from '../../request/api';

  export default {
    name: "left-side",
    components: {
      adminMenu, operMenu, agentMenu
    },
    mounted: function () {
//      this.fresh()
    },

    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      pId: function () {
        return this.$store.state.login.loginData.pid;
      },
      isOper: function () {
        return this.$store.state.login.loginData.isOperate;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      isSole: function () {
        return this.$store.state.login.loginData.isSole;
      },
      showAdmin: function () {
        if (this.pId == 1 || this.loginId == 1) {
          return true;
        } else {
          return false;
        }
      },
      showOper: function () {
        if (this.isOper == 1 || this.isOper == 4) {
          return true;
        } else {
          return false;
        }
      },
      showAgent: function () {
        if (!this.showAdmin && !this.showOper && (this.isOper == 0||this.isOper == 2)) {
          return true;
        } else {
          return false;
        }
      }
    },

    methods: {
      fresh(){
        var _this = this;
        setInterval(function () {
          _this.refresh()
        }, 180000)
      },
      refresh: function () {
        if (this.getCookie() == undefined) {
          return false;
        }
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

    }

  }
</script>

