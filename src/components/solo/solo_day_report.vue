<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择时间"
          @change="checkYear">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchInfo.product" placeholder="所有类型" clearable>
          <el-option
            v-for="item in productInfo"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="Data.data" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="time" label="时间">
      </el-table-column>
      <el-table-column prop="soleAllCashCount" label="所有玩家金币变化">
      </el-table-column>
      <el-table-column prop="soleCashCount" label="直接玩家金币变化">
      </el-table-column>
      <el-table-column prop="soleNextCashCount" label="间接玩家金币变化">
      </el-table-column>
      <el-table-column prop="soleMyCommission" label="直接会员收益">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.soleMyCommission)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="soleNextCommission" label="间接会员总收益">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.soleNextCommission)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="soleCommissionCount" label="总收益">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.soleCommissionCount)"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="countData.data" border  :show-header="false">
      <el-table-column prop="created_at" label="时间">
        <template scope="scope">
          <span>总计:</span>
        </template>
      </el-table-column>
      <el-table-column prop="soleAllCashCount" label="所有玩家金币变化">
      </el-table-column>
      <el-table-column prop="soleCashCount" label="直接玩家金币变化">
      </el-table-column>
      <el-table-column prop="soleNextCashCount" label="间接玩家金币变化">
      </el-table-column>
      <el-table-column prop="soleMyCommission" label="直接会员收益">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.soleMyCommission)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="soleNextCommission" label="间接会员总收益">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.soleNextCommission)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="soleCommissionCount" label="总收益">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.soleCommissionCount)"></span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
  import api from '../../request/api';

  export default {
    name: "",
    data: function () {
      return {
        searchInfo: {
          begin_at: '',
          end_at: '',
          product: ''
        },
        productInfo: [],
        month: '',
        timeValue: '',
        time:'',
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        countData:{
          data:[],
          pageApi:''
        },
      }
    },
    mounted: function () {
      let now = new Date();
      let year = now.getFullYear().toString();
      let monthV = now.getMonth() + 1;
      monthV.toString()
      let time = year + '-' + monthV;
      this.month = time;
      this.time = time;
      this.getProduct();
      this.getData();
    },
    computed: {

    },
    methods: {
      checkYear(year){
        this.time = year;
      },
      getProduct(){
        var _this = this;
        this.$ajax.get(api.productType).then(function (response) {
          _this.productInfo = response.data.m8a_product_types;
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      getData(val) {
          this.searchInfo.begin_at  = this.time + '-01 00:00:00';
        this.searchInfo.end_at  = this.time + '-31 23:59:59';
        this.countData.pageApi = api.getSoleDayCount  +'?' + this.parseParam(this.searchInfo);
        this.Data.pageApi = api.getSoleDay + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {
        this.Data.pageApi = api.getSoleDay  + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        this.dataCountHandle();
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            var obj = [];
            for(var k in response.data){
              var  part = response.data[k];
              part.time  = k;
              obj.push(part)
            }
            _this.Data.data = obj;

          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dataCountHandle(){
        var _this = this;
        _this.countData.data = [];
        this.$ajax.get(this.countData.pageApi)
          .then(function (response) {
            _this.countData.data.push(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      parseParam: function (param) {
        let paramStr = "";
        for (var k in param) {
          if (param[k] != "" || typeof(param[k]) == "number") {
            paramStr += '&' + k + '=' + param[k]
          }
        }
        return paramStr;

      },
    },
    destroyed: function () {

    },

  }
</script>
<style type="text/css" scoped>

</style>


