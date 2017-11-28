<template>
  <div>
     <div class="panel" v-if="permissions.view_goldediter">
       <div class="panel-heading">
         <h3 class="panel-title">
           充值管理
          </h3>
       </div>
       <div class="panel-body"></div>
     </div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          商城日换管理
         </h3>
      </div>
      <div class="panel-body">
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <tbody>
            <tr>
              <td>兑换最小额设置 <input type="text" v-model="exData.min_exchange_score"></td>
              <td>手续费比例 <input type="text" v-model="exData.fee_scale">%</td>
              <td>兑换比例设置 <input type="text" v-model="exData.exchange_scale">&nbsp;:&nbsp;1</td>
            </tr>
            <tr>
              <td>兑换最大额设置 <input type="text" v-model="exData.max_exchange_score"></td>
              <td>最低手续费 <input type="text" v-model="exData.min_fee"></td>
              <td>是否禁用兑换
              <select v-model="exData.status">
                <option value="0">是</option>
                <option value="1">否</option>
              </select>
              </td>
            </tr>
            <tr>
              <td>每日兑换次数&nbsp;&nbsp;&nbsp;&nbsp;<input type="number" v-model="exData.day_exchange_limit"></td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
          <button  type="submit" class="btn btn-primary pull-right" @click="setEx()"><i class="fa fa-fw fa-check"></i> 提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../request/api';
  import trumbowyg from "../vendors/trumbowyg/dist/trumbowyg.min.js"
  export default {
    name: "financeManagement",
    data: function () {
      return {
        exData:{}
      }
    },
    mounted: function () {
     this.getEx();
    },
    computed:{
      permissions:function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    methods: {
        getEx:function () {
          var _this = this;
          this.$ajax.get(api.getExInfo)
            .then(function (response) {
              _this.exData = response.data.data;

            })
            .catch(function (error) {
              console.log(error)
            })
        },
        setEx:function () {
          console.log(this.exData)
        },
         subSuccess: function () {
        this.showTex = false;
        swal({
          title: "操作成功",
          text: "",
          type: "success",
          confirmButtonColor: "#66cc99",
          confirmButtonText: "关闭"
        });
      },
    },
    destroyed: function () {

    },

  }
</script>
<style type="text/css" scoped>

</style>


