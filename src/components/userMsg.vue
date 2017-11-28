<template>
  <el-tabs value="1" @tab-click="handleClick">
    <el-tab-pane label="用户详情" name="1" v-if="permissions.viewmsg_user">
      <userInfoList :uid="uid" :ip="ip" :isOn="is_on" :loginNum="login_num" :noLogin="no_login_days"
                    :location="location"></userInfoList>
    </el-tab-pane>
    <el-tab-pane class="noMobile" label="信息管理" name="2" v-if="permissions.modify_user">
      <userInfoEdit :uid="uid" :ip="ip" v-if="showUserEdit"></userInfoEdit>
    </el-tab-pane>
    <el-tab-pane class="noMobile" label="登陆记录" name="3" v-if="permissions.viewlogin_user">
      <loginInfoList :uid="uid" :ip="ip" :loginNum="login_num" :noLogin="no_login_days" :location="location" v-if="showLoginList"></loginInfoList>
    </el-tab-pane>
    <el-tab-pane label="游戏记录" name="4" v-if="permissions.viewgmlog_user">
      <userGameList :uid="uid" v-if="showGameList"></userGameList>
    </el-tab-pane>
    <el-tab-pane label="财务记录" name="5" v-if="permissions.viewgoldlog_user">
      <userFinanceList :uid="uid" v-if="showFinList"></userFinanceList>
    </el-tab-pane>
    <el-tab-pane label="用户日志" name="6" v-if="permissions.userlog_user">
      <userLogList :uid="uid" v-if="showLogList"></userLogList>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import userInfoList from "./userInfoList";
  import userInfoEdit from "./userInfoEdit";
  import loginInfoList from "./loginInfoList";
  import userLogList from "./userLogList";
  import userGameList from "./userGameList";
  import userFinanceList from "./userFinanceList";
  export default {
    name: "",
    components: {
      userInfoList, userInfoEdit, loginInfoList, userLogList, userGameList, userFinanceList
    },
    computed: {
      uid: function () {
        return this.$store.state.userMsg.userMsg.uid;
      },
      gaccount: function () {
        return this.$store.state.userMsg.userMsg.gaccount;
      },
      ip: function () {
        return this.$store.state.userMsg.userMsg.ip;
      },
      is_on: function () {
        return this.$store.state.userMsg.userMsg.is_on;
      },
      login_num: function () {
        return this.$store.state.userMsg.userMsg.login_num;
      },
      no_login_days: function () {
        return this.$store.state.userMsg.userMsg.no_login_days;
      },
      location: function () {
        return this.$store.state.userMsg.userMsg.location;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    data: function () {
      return {
        showUserEdit: false,
        showLoginList: false,
        showGameList: false,
        showFinList: false,
        showLogList: false,
        noShow:true
      }
    },
    mounted: function () {

    },
    methods: {
      handleClick(tab) {
        switch (tab.name) {
          case '2':
            this.showUserEdit=true;
            break;
          case '3':
            this.showLoginList=true;
            break;
          case '4':
            this.showGameList=true;
            break;
          case '5':
            this.showFinList=true;
            break;
          case '6':
            this.showLogList=true;
            break;
        }
      }
    },
    destroyed: function () {

    }

  }
</script>
<style type="text/css" scoped>

</style>


