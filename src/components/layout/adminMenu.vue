<template>
  <el-menu mode="vertical" :default-active="active" class="el-menu-vertical-demo" :unique-opened="true" theme="dark"
           router @select="handleOpen">
    <el-submenu index="1" v-if="permissions.view_admin_info_list">
      <template slot="title" >信息管理</template>
      <el-menu-item v-show="permissions.system_notice_list" index="/user/sysMessage">公告消息管理</el-menu-item>
      <el-menu-item v-show="permissions.view_notice_manager" index="/user/noticeManager">说明文字管理</el-menu-item>
      <el-menu-item v-show="permissions.view_notice" index="/user/noticeManagement">网站公告管理</el-menu-item>
      <el-menu-item v-show="permissions.view_all_service_list" index="/user/adminService">网站客服管理</el-menu-item>
      <el-menu-item v-show="permissions.view_download" index="/user/download">下载链接管理</el-menu-item>
      <el-menu-item v-show="permissions.agent_safe" index="/user/secure_code">修改资料</el-menu-item>
    </el-submenu>
    <el-submenu index="2" v-if="permissions.view_admin_manager">
      <template slot="title" >管理员管理</template>
      <el-menu-item v-show="permissions.view_userbacklist" index="/user/usersList">管理员列表</el-menu-item>
      <el-menu-item v-show="permissions.view_chaild_manager" index="/user/account">子账号列表</el-menu-item>
      <el-menu-item v-show="permissions.view_role_list" index="/user/roleManagement">角色管理</el-menu-item>
    </el-submenu>
    <el-submenu index="3" v-if="permissions.view_opr_list">
      <template slot="title" >运营者管理</template>
      <el-menu-item v-show="permissions.view_cname_list" index="/user/name_charge">域名管理</el-menu-item>
      <el-menu-item v-show="permissions.set_agent" index="/user/setAgent">开设账号</el-menu-item>
      <el-menu-item v-show="permissions.view_admin_next_agent" index="/user/admin_index_agent">代理列表</el-menu-item>
      <el-menu-item v-show="permissions.view_operation_list" index="/user/operationList">代运营列表</el-menu-item>
      <el-menu-item v-show="permissions.view_admin_agent_pay" index="/user/aPayList">代充账号列表</el-menu-item>
    </el-submenu>
    <el-submenu index="4" v-if="permissions.view_user_list">
      <template slot="title" >用户管理</template>
      <el-menu-item v-show="permissions.view_onlineuser" index="/user/onlineUsersList">在线用户</el-menu-item>
      <el-menu-item v-show="permissions.retrieve_reguser" index="/user/registeredUsersList">注册用户</el-menu-item>
      <el-menu-item v-show="permissions.view_admin_customer_list" index="/user/admin_customers">代理关联用户</el-menu-item>
    </el-submenu>
    <el-submenu index="5"  v-if="permissions.gameManagement">
      <template slot="title">游戏管理</template>
      <el-menu-item v-show="permissions.view_game_count" index="/user/gameStatistics">游戏统计</el-menu-item>
      <el-menu-item v-show="permissions.fishManagement" index="/user/fishManagement">捕鱼管理</el-menu-item>
      <el-menu-item v-show="permissions.pokerManagement" index="/user/pokerManagement">棋牌管理</el-menu-item>
    </el-submenu>
    <el-submenu index="6"  v-if="permissions.view_goldmanager">
      <template slot="title">财务管理</template>
      <el-menu-item v-show="permissions.give_score" index="/user/sys_sent">上分</el-menu-item>
      <el-menu-item v-show="permissions.post_reduce_score" index="/user/sys_get">下分</el-menu-item>
      <el-menu-item v-show="permissions.view_goldblack" index="/user/financialStatements">财务报表</el-menu-item>
      <el-menu-item v-show="permissions.view_sole_data||permissions.view_admin_profit_list" index="/user/adminS_detail">占成报表</el-menu-item>
      <el-menu-item v-show="permissions.view_bank_list" index="/user/bankScore">运营金币管理</el-menu-item>
    </el-submenu>
    <el-submenu index="7" v-if="permissions.view_total_manager_list">
      <template slot="title" >统计报表</template>
      <el-menu-item v-show="permissions.view_allstatistical" index="/user/statistics">代理综合统计</el-menu-item>
      <el-menu-item v-show="permissions.view_agent_count" index="/user/super_statistics">代理分成统计</el-menu-item>
      <el-menu-item v-show="permissions.view_admin_sole_count" index="/user/adminS_day_report">占成日报</el-menu-item>
    </el-submenu>
    <el-submenu index="8"  v-if="permissions.view_market_log||permissions.view_game_log||permissions.view_system_log||permissions.view_push_log">
      <template slot="title">日志管理</template>
      <el-menu-item v-show="permissions.view_score_log" index="/user/scoreList">运营金币日志</el-menu-item>
      <el-menu-item v-show="permissions.view_market_log" index="/user/allMarketLog">营销日志</el-menu-item>
      <el-menu-item v-show="permissions.view_game_log" index="/user/allGameLog">游戏日志</el-menu-item>
      <el-menu-item v-show="permissions.view_push_log" index="/user/cashLog">推水日志</el-menu-item>
      <el-menu-item v-show="permissions.view_sole_log" index="/user/soleLog">占成日志</el-menu-item>
      <el-menu-item v-show="permissions.view_admin_pay_log" index="/user/aPayLog">代充日志</el-menu-item>
      <el-menu-item v-show="permissions.view_system_log" index="/user/log">操作日志</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
  export default {
    mounted: function () {

    },
    computed: {
      active: function () {
        return this.$router.history.current.fullPath;
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
    },

    methods: {
      handleOpen(key) {
        if (key == this.$router.history.current.fullPath) {
          this.destroy();
        }
      },
      destroy(){
        this.$store.dispatch('getRefreshData', false)
        let _this = this;
        setTimeout(function () {
          _this.$store.dispatch('getRefreshData', true)
        }, 0)
      }
    }

  }
</script>

