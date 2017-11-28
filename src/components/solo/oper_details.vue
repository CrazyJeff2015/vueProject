<template>
  <el-tabs :active-name="nowIndex">
    <el-tab-pane label="占成报表" name="first" v-if="index1">
      <soleWorkDate></soleWorkDate>
    </el-tab-pane>
    <el-tab-pane label="占成结算" name="second" v-if="index2">
      <judgeSole></judgeSole>
    </el-tab-pane>
  </el-tabs>

</template>
<script>
  import api from '../../request/api';
  import judgeSole from './operJudeSole.vue';
  import soleWorkDate from './soleWorkData'
  export default {
    components: {
      judgeSole,soleWorkDate
    },

    mounted: function () {

    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      index1:function () {
        if(this.permissions.view_sole_data){
          return true;
        }else {
          return false;
        }
      },
      index2:function () {
        if(this.permissions.view_operprofit_list){
          return true;
        }else {
          return false;
        }
      },
      nowIndex:function () {
        if(this.index1){
          return 'first';
        }else {
          return 'second'
        }
      }
    },
    methods: {

    },
    destroyed: function () {

    }
  }

</script>



