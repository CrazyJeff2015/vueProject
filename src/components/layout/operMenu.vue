<template>
  <el-menu mode="vertical" :default-active="active" class="el-menu-vertical-demo" :unique-opened="true" theme="dark"
           router @select="handleOpen">
    <el-submenu index="1" v-if="permissions.system_notice_list">
      <template slot="title" >信息管理</template>
      <el-menu-item v-show="permissions.syetem_notice_manage" index="/user/notice">系统公告</el-menu-item>
      <el-menu-item v-show="permissions.system_message_manage" index="/user/operMessage">消息管理</el-menu-item>
      <el-menu-item v-show="permissions.view_notice" index="/user/noticeManagement">网站公告管理</el-menu-item>
      <el-menu-item v-show="permissions.view_service_list" index="/user/service">网站客服管理</el-menu-item>
      <el-menu-item v-show="permissions.view_agent_agentstadus" index="/user/agent_detail">个人信息</el-menu-item>
      <el-menu-item v-show="permissions.agent_safe" index="/user/secure_code">修改资料</el-menu-item>
    </el-submenu>
    <el-submenu index="2" v-if="permissions.view_admin_manager">
      <template slot="title" >管理员管理</template>
      <el-menu-item v-show="permissions.view_operation_childaccount" index="/user/operUserList">子账号管理</el-menu-item>
    </el-submenu>
    <el-submenu index="3" v-if="permissions.view_opr_list">
      <template slot="title" >运营者管理</template>
      <el-menu-item v-show="permissions.view_cname_list" index="/user/name_charge">域名管理</el-menu-item>
      <el-menu-item v-show="permissions.set_agent" index="/user/setAgent">开设账号</el-menu-item>
      <el-menu-item v-show="permissions.view_next_agent" index="/user/oper_index_agent">下级代理管理</el-menu-item>
      <el-menu-item v-show="permissions.view_oper_agent_pay" index="/user/oPayList">代充账号列表</el-menu-item>
    </el-submenu>
    <el-submenu index="4" v-if="permissions.view_user_list">
      <template slot="title" >用户管理</template>
      <el-menu-item v-show="permissions.view_onlineuser" index="/user/onlineUsersList">在线用户</el-menu-item>
      <el-menu-item v-show="permissions.retrieve_reguser" index="/user/registeredUsersList">注册用户</el-menu-item>
      <el-menu-item v-show="permissions.view_operation_customer_list" index="/user/oper_customers">代理关联用户</el-menu-item>
    </el-submenu>
    <el-submenu index="5" v-if="permissions.gameManagement">
      <template slot="title" >游戏管理</template>
      <el-menu-item v-show="permissions.operation_game_count" index="/user/gameStatistics">游戏统计</el-menu-item>
      <el-menu-item v-show="permissions.fishManagement" index="/user/fishManagement">捕鱼管理</el-menu-item>
      <el-menu-item v-show="permissions.pokerManagement" index="/user/pokerManagement">棋牌管理</el-menu-item>
    </el-submenu>
    <el-submenu index="6" v-if="permissions.view_goldmanager">
      <template slot="title" >财务管理</template>
      <el-menu-item v-show="permissions.give_score" index="/user/sys_sent">上分</el-menu-item>
      <el-menu-item v-show="permissions.post_reduce_score" index="/user/sys_get">下分</el-menu-item>
      <el-menu-item v-show="permissions.view_goldblack" index="/user/financialStatements">财务报表</el-menu-item>
      <el-menu-item v-show="permissions.view_bank_list" index="/user/bankScore">运营金币管理</el-menu-item>
      <el-menu-item v-show="permissions.view_money" index="/user/commission_change">财务变动</el-menu-item>
      <el-menu-item v-show="permissions.view_sole_data||permissions.view_operprofit_list" index="/user/oper_details">占成报表</el-menu-item>
      <el-menu-item v-show="permissions.donation_amount" index="/user/withdrawals">代理提款</el-menu-item>
    </el-submenu>
    <el-submenu index="7" v-if="permissions.view_total_manager_list">
      <template slot="title" >统计报表</template>
      <el-menu-item v-show="permissions.view_commission_record" index="/user/commissions">分成记录</el-menu-item>
      <el-menu-item v-show="permissions.view_agent_count" index="/user/admin_statistics">分成统计</el-menu-item>
      <el-menu-item v-show="permissions.view_admin_sole_count" index="/user/adminS_day_report">占成日报</el-menu-item>
    </el-submenu>
    <el-submenu index="8" v-if="permissions.view_market_log||permissions.view_game_log||permissions.view_system_log||permissions.view_push_log">
      <template slot="title" >日志管理</template>
      <el-menu-item v-show="permissions.view_score_log" index="/user/scoreList">运营金币日志</el-menu-item>
      <el-menu-item v-show="permissions.view_game_log" index="/user/allGameLog">游戏日志</el-menu-item>
      <el-menu-item v-show="permissions.view_sole_log" index="/user/soleLog">占成日志</el-menu-item>

      <el-menu-item v-show="permissions.view_oper_pay_log" index="/user/oPayLog">代充日志</el-menu-item>

      <el-menu-item v-show="permissions.view_system_log" index="/user/log">操作日志</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
  export default {
    components: {},
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

