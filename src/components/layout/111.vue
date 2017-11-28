<template>
  <!-- Left side column. contains the logo and sidebar -->
  <aside class="left-side sidebar-offcanvas">
    <!-- sidebar: style can be found in sidebar-->
    <section class="sidebar">
      <div id="menu" role="navigation">
        <adminMenu v-show="showAdmin"></adminMenu>
        <operMenu v-show="showOper"></operMenu>
        <agentMenu v-show="showAgent"></agentMenu>
        <soleMenu v-show="showSole"></soleMenu>
      </div>
    </section>
  </aside>

</template>
<script>
  import adminMenu from "./adminMenu.vue";
  import operMenu from "./operMenu.vue";
  import agentMenu from "./agentMenu.vue";
  import soleMenu from "./soleMenu.vue";
  export default {
    name: "left-side",
    components: {
      adminMenu,operMenu,agentMenu,soleMenu
    },
    mounted: function(){

    },

    computed:{
      loginScale:function(){
        return this.$store.state.login.loginData.loginScale;
      },
      loginId:function(){
        return this.$store.state.login.loginData.loginId;
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
      isSole: function () {
        return this.$store.state.login.loginData.isSole;
      },
      showAdmin:function () {
        if(this.pId==1||this.loginId==1){
          return true;
        }else {
          return false;
        }
      },
      showOper:function () {
        if(this.isOper==1||this.isOper==4){
          return true;
        }else {
          return false;
        }
      },
      showSole:function () {
        if(this.isSole==1){
          return true;
        }else {
          return false;
        }
      },
      showAgent:function () {
        if(!this.showAdmin&&!this.showOper&&!this.showSole){
          return true;
        }else {
          return false;
        }
      }
    },

    methods:{

    }

  }
</script>

