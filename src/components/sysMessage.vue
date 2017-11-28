<template>
  <el-tabs value="first">
    <el-tab-pane v-if="permissions.syetem_notice_manage" label="公告管理" name="first">
      <adminNot></adminNot>
    </el-tab-pane>
    <el-tab-pane v-if="permissions.system_message_manage" label="消息管理" name="second">
      <adminMes></adminMes>
    </el-tab-pane>
    <el-tab-pane v-if="permissions.system_answer_manage" name="third">
      <el-badge :value="unread" class="item mes" slot="label">
        <span>问答管理</span>
      </el-badge>
      <aAndQ></aAndQ>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import api from '../request/api';
  import adminNot from './smallCom/adminNotice.vue';
  import adminMes from './smallCom/adminMessage.vue';
  import aAndQ from './smallCom/aAndQ.vue';
  export default {
    name: "",
    data: function () {
      return {}
    },
    computed: {
      unread: function () {
        return this.$store.state.unread.unread;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    components: {
      adminNot,adminMes,aAndQ
    },
    mounted: function () {


    },
    methods: {

    },
    destroyed: function () {

    },

  }
</script>
<style type="text/css">
  .el-badge.item.mes sup {
    top: 8px;
  }
</style>



