<template>
  <el-card>
      <div class="input-group select2-bootstrap-append">
        <el-select v-model="year" placeholder="请选择年份" clearable>
          <el-option
            v-for="item in yearList"
            :key="item"
            :label="item + '年'"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="mouth" placeholder="请选择月份" clearable>
          <el-option
            v-for="item in mouthList"
            :key="item"
            :label="item + '月'"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" :plain="true" icon="search" @click="showPage(1)">搜 索</el-button>
      </div>
      <div style="margin: 10px 0">
        <span v-text="data1_table[0]||''"></span>：<span v-text="data1.info1" class="colorRed"></span>
        <span v-text="data1_table[1]||''" class="margin-30"></span>：<span v-text="data1.info2" class="colorRed"></span>
        <span  v-text="data1_table[2]||''" class="margin-30"></span>：<span v-text="data1.info3" class="colorRed"></span>
      </div>
    <el-table
      :data="finData" border style="width: 100%; margin-top: 20px" >
      <el-table-column type="index" width="80">
      </el-table-column>
      <el-table-column prop="date" :label="table[0]">
      </el-table-column>
      <el-table-column prop="way1" :label="table[1]">
      </el-table-column>
      <el-table-column prop="way2" :label="table[2]">
      </el-table-column>
      <el-table-column prop="way3" :label="table[3]">
      </el-table-column>
      <el-table-column prop="all" :label="table[4]">
      </el-table-column>
      <el-table-column prop="ex" :label="table[5]">
      </el-table-column>
      <el-table-column prop="tax" :label="table[6]">
      </el-table-column>
      <el-table-column prop="free" :label="table[7]">
      </el-table-column>
    </el-table>
    <el-table
      :data="finTotal" border style="width: 100%; margin-top: 20px" :show-header="false">
      <el-table-column  width="80">
      </el-table-column>
      <el-table-column>
        <template scope="scope">
          <span>总计</span>
        </template>
      </el-table-column>
      <el-table-column prop="way1">
      </el-table-column>
      <el-table-column prop="way2">
      </el-table-column>
      <el-table-column prop="way3">
      </el-table-column>
      <el-table-column prop="all">
      </el-table-column>
      <el-table-column prop="ex">
      </el-table-column>
      <el-table-column prop="tax">
      </el-table-column>
      <el-table-column prop="free">
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
  import api from '../request/api';
  const moment = require("moment");
  export default {
    name: "financeIndex", data: function () {
      return {
        yearList: [2017, 2018, 2019, 2020],
        mouthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        finData: [],
        table: [],
        data1: [],
        data1_table: [],
        totalTable: [],
        finTotal: [],
        parms: '',
        date: {
          begin_at: '',
          end_at: ''
        },
        year:'',
        mouth:'',
        searchContent:''

      }
    },
    mounted: function () {
      this.showPage()
      this.year  = moment().year();
      this.mouth = moment().month() + 1
      "use strict";

    },
    computed: {
//     show:function () {
//       if(this.permissions.viewblack_black){
//           this.showPage()
//       }
//     }
    },
    methods: {
      getValue: function (obj) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
          arr.push(obj[i].name)
        }
        return arr;
      },
      parseParam: function (param) {
        var paramStr = "";
        for (var k in param) {
          if (param[k] != "" || typeof(param[k]) == "number") {
            paramStr += '&' + k + '=' + param[k]
          }
        }
        return paramStr.substr(1);

      },
      showPage: function (time) {
        if (time) {
          var day = new Date(this.year, this.mouth, 0);
          //获取天数：
          var daycount = day.getDate();
          var a = (parseFloat(this.mouth)>9?this.mouth:'0'+this.mouth)

          this.date.begin_at = this.year + '-' + a + '-01';
          this.date.end_at = this.year + '-' + a + '-' + daycount;
          this.searchContent = this.parseParam(this.date)
        }

        var requestUrl = '';
        this.searchContent == '' ? requestUrl = api.getFinList : requestUrl = api.getFinList +'?'+ this.searchContent;


        //搜索结束
        var _this = this;
        this.$ajax.get(requestUrl)
          .then(function (response) {
            _this.finData = response.data.data.list;
            _this.finTotal=[];
            _this.finTotal.push(response.data.data.list_total);
            _this.table = _this.getValue(response.data.data.table)
            _this.data1 = response.data.data.total;
            _this.data1_table = _this.getValue(response.data.data.total_table);

          })
          .catch(function (error) {
            console.log(error);
          });

      },
    },
    destroyed: function () {

    },

  }
</script>
<style scoped>
  .select2-bootstrap-append .form-control {
    display: inline-block;
    width: 100px;
    margin-right: 20px;
  }

  .margin-30 {
    margin-left: 30px;
  }

  .colorRed {
    color: red;
  }
</style>



