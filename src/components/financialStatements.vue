<template>

    <el-tabs :active-name="nowIndex" @tab-click="tabClick">
      <el-tab-pane label="基本报表" name="first" v-if="index1">
        <financeIndex></financeIndex>
      </el-tab-pane>
      <el-tab-pane label="财务订单" name="second" v-if="index2">
        <financialOrders></financialOrders>
      </el-tab-pane>
      <el-tab-pane label="会计订单" name="third" v-if="index3">
        <accountingOrders></accountingOrders>
      </el-tab-pane>
      <el-tab-pane label="充值订单" name="five" v-if="permissions.view_operation_payorder&&isOper&&loginId!=1&&pId!=1">
        <payOrder1></payOrder1>
      </el-tab-pane>
      <el-tab-pane label="充值订单" name="four" v-if="permissions.view_payorder">
        <payOrder></payOrder>
      </el-tab-pane>
    </el-tabs>


</template>
<script>
  import api from '../request/api';
  import financialOrders from './financialOrders';
  import financeIndex from './financeIndex';
  import accountingOrders from './AccountingOrders';
  import payOrder from './payOrder';
  import payOrder1 from './payOrder1';
  export default {
    name: "financialStatements",
    data: function () {
      return {
        showFOrder: false,
        showAOrder: false,
        showOOrder: false,
      }
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },

      isOper: function () {
        if(this.$store.state.login.loginData.isOperate==1||this.$store.state.login.loginData.isOperate==4){
            return true
        }else {
            return false;
        }
      },
      index1: function () {
        if (this.permissions.viewblack_black) {
            return true;
        } else {
          return false;
        }
      },
      index2: function () {
        if (this.permissions.blackgold_black) {
          return true;
        } else{
            return false
        }
      },
      index3: function () {
        if (this.permissions.view_accountingblack ) {
          return true;
        } else {
          return false;
        }
//        return false;
      },
      index4: function () {
        if (this.permissions.view_payorder ) {
          return true;
        } else {
          return false;
        }
      },
      nowIndex:function () {
        if(this.index1){
            return 'first'
        }else if(this.index2){
            return 'second'
        }else if(this.index3){
            return 'third'
        }else  if(this.index4){
            return 'four'
        }else {
            return 'five'
        }
      },
      pId: function () {
        return this.$store.state.login.loginData.pId;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },

    },
    components: {
      financialOrders,accountingOrders, payOrder,financeIndex,payOrder1
    },
    mounted: function () {
    },
    methods: {
      tabClick(tab){
//          console.log(tab.name)
      }

    },
    destroyed: function () {

    },

  }
</script>


