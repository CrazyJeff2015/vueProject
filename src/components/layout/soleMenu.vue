<template>
  <ul class="navigation">
    <li class="menu-dropdown">
      <a href="javascript:void(0)">
        <span>信息管理</span>
        <span class="fa arrow"></span>
      </a>
      <ul class="sub-menu collapse" aria-expanded="false">
        <router-link  to="/user/solo_notice" tag="li" exact>
          <a class="logo"><span class="mm-text">系统公告</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link  to="/user/mesManage" tag="li" exact>
          <a class="logo"><span class="mm-text">系统消息</span>
          </a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link v-show="permissions.view_cname_list"  to="/user/solo_url" tag="li" exact>
          <a class="logo"><span class="mm-text">域名管理</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link v-show="permissions.view_profit_list"  to="/user/solo_detail" tag="li" exact>
          <a class="logo"><span class="mm-text">个人信息</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link v-show="permissions.agent_safe" to="/user/secure_code" tag="li" exact>
          <a class="logo"><span class="mm-text">修改资料</span> <i class="reFresh" @click="refreshFn"></i>
          </a>
        </router-link>
      </ul>
    </li>
    <li class="menu-dropdown" v-show="permissions.view_user_list">
      <a href="javascript:void(0)">
        <span>用户管理</span>
        <span class="fa arrow"></span>
      </a>
      <ul class="sub-menu collapse" aria-expanded="false">
        <router-link v-show="permissions.view_customer_list"  to="/user/solo_customers" tag="li" exact>
          <a class="logo"><span class="mm-text">玩家管理</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link v-show="permissions.view_sole_next_agent"  to="/user/solo_index_agent" tag="li" exact>
          <a class="logo"><span class="mm-text">代理管理</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link to="/user/solo_set_agent" tag="li" exact>
          <a class="logo"><span class="mm-text">新增代理</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
      </ul>
    </li>
    <li class="menu-dropdown">
      <a href="javascript:void(0)">
        <span>财务管理</span>
        <span class="fa arrow"></span>
      </a>
      <ul class="sub-menu collapse" aria-expanded="false">
        <router-link v-show="permissions.view_sole_commission_record"  to="/user/solo_commissions" tag="li" exact>
          <a class="logo"><span class="mm-text">分成记录</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link v-show="permissions.view_sole_count"  to="/user/solo_day_report" tag="li" exact>
          <a class="logo"><span class="mm-text">财务日报</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link   to="/user/sole_balance" tag="li" exact>
          <a class="logo"><span class="mm-text">独家结算</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
        <router-link v-show="permissions.sole_send_score" to="/user/solo_withdrawals" tag="li" exact>
          <a class="logo"><span class="mm-text">独家提款</span></a>
          <i class="reFresh" @click="refreshFn"></i>
        </router-link>
      </ul>
    </li>
  </ul>
</template>
<script>
  export default {
    mounted: function(){

    },
    computed:{
      loginId:function(){
        return this.$store.state.login.loginData.loginId;
      },
      loginScale:function(){
        return this.$store.state.login.loginData.loginScale;
      },
      pId:function(){
        return this.$store.state.login.loginData.pid;
      },
      isOper:function(){
        return this.$store.state.login.loginData.isOperate;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      soloScale: function () {
        return this.$store.state.login.loginData.sole_scale + '%';
      },
    },

    methods:{
      refreshFn:function () {
        document.location.reload()
      }
    }

  }
</script>
<style scoped>
  .reFresh {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: none;
    cursor: pointer;
  }

  .active>i.reFresh{
    display: block;
  }
  .navigation li{
    position: relative;
  }

</style>



