<template>
  <div>
    <div class="mes">
      <p>
        代理账号：<span style="color: #ff3e0a">{{ loginAgentName }}</span>
      </p>
      <p>
        佣金比例：<span style="color: red">{{ loginScale}}</span>
      </p>
      <p>
        占成比例：<span style="color: red">{{ soloScale}}</span>
      </p>
      <p>
        代理资产：<span style="color: red">{{ loginScore }}</span>
      </p>
      <p>
        更新时间：<span style="color: red">{{ updateTime }}</span>
      </p>
      <p>
        <el-button type="primary" size="mini" :loading="ifLoad" @click="refresh()">更新数据</el-button>
      </p>
    </div>
    <el-menu mode="vertical" :default-active="active" class="el-menu-vertical-demo" :unique-opened="true" theme="dark"
             router @select="handleOpen">
      <el-submenu index="1">
        <template slot="title">信息管理</template>
        <el-menu-item v-show="permissions.syetem_notice_manage" index="/user/notice">系统公告</el-menu-item>
        <el-menu-item v-show="permissions.system_message_manage" index="/user/mesManage">系统消息</el-menu-item>
        <el-menu-item v-show="permissions.view_agent_agentstadus" index="/user/agent_detail">个人信息</el-menu-item>
        <el-menu-item v-show="permissions.agent_safe" index="/user/secure_code">修改资料</el-menu-item>
      </el-submenu>
      <el-submenu index="2" v-show="permissions.view_user_list">
        <template slot="title">用户管理</template>
        <el-menu-item v-show="permissions.view_customer_list" index="/user/customers">直属玩家管理</el-menu-item>
        <el-menu-item v-show="permissions.view_agent_next" index="/user/index_agent">下级代理管理</el-menu-item>
        <el-menu-item index="/user/setAgent">新增下级代理</el-menu-item>
      </el-submenu>
      <el-submenu index="3" v-show="permissions.view_user_list">
        <template slot="title">财务管理</template>
        <el-menu-item v-show="permissions.view_commission_record" index="/user/commissions">分成记录</el-menu-item>
        <el-menu-item v-show="permissions.view_agent_count" index="/user/admin_statistics">佣金统计</el-menu-item>
        <el-menu-item v-show="permissions.view_sole_count" index="/user/solo_day_report">占成日报</el-menu-item>
        <el-menu-item v-show="permissions.view_money" index="/user/commission_change">财务变动</el-menu-item>
        <el-menu-item index="/user/sole_balance">占成结算</el-menu-item>
        <el-menu-item index="/user/withdrawals">代理提款</el-menu-item>
      </el-submenu>

    </el-menu>
  </div>
</template>
<script>
  import api from '../../request/api';
  export default {
    mounted: function () {

    },
    data: function () {
      return {
          ifLoad:false
      }
    },
    computed: {
      active: function () {
        return this.$router.history.current.fullPath;
      },
      loginScore: function () {
        return this.$store.state.login.loginData.loginScore;
      },
      soloScale: function () {
        return this.$store.state.login.loginData.sole_scale + '%';
      },
      loginAgentName: function () {
        return this.$store.state.login.loginData.loginAgentName;
      },

      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale + '%';
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
      updateTime:function () {
        return this.$store.state.login.loginData.updateTime;
      }
    },

    methods: {
      refresh: function () {
          this.ifLoad = true;
        if (this.getCookie() == undefined) {
          this.ifLoad = false;
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
            _this.ifLoad = false;
          }).catch(function (error) {
        })
      },
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
<style scoped>
  .mes {
    color: #fff;
    padding: 20px 0 20px 15px;
  }
</style>




