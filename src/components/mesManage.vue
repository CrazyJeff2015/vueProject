<template>
  <div>
    <agentMes></agentMes>
    <chat></chat>
  </div>
</template>
<script>
  import api from '../request/api';
  import agentMes from './smallCom/agentMes.vue';
  import chat from './chat.vue';
  export default {
    name: "",
    data: function () {
      return {}
    },
    components: {
      agentMes,chat
    },
    mounted: function () {


    },
    methods: {

    },
    destroyed: function () {

    },

  }
</script>



