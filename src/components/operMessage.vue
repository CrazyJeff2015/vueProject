<template>
  <div>
    <agentMes></agentMes>
      <operMes v-if="is_child!==1"></operMes>
    <chat></chat>
  </div>
</template>
<script>
  import api from '../request/api';
  import operMes from './smallCom/operMessage.vue';
  import chat from './chat.vue';
  import agentMes from './smallCom/agentMes.vue';
  export default {
    name: "",
    data: function () {
      return {}
    },
    computed:{
      is_child: function () {
        return this.$store.state.login.loginData.isChild;
      },
    },
    components: {
        operMes,chat,agentMes
    },
    mounted: function () {


    },
    methods: {

    },
    destroyed: function () {

    },

  }
</script>



