<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="会员账号">
        <el-input v-model="searchInfo.gaccount" placeholder="请输入会员账号"></el-input>
      </el-form-item>
      <el-form-item label="游戏类型">
        <el-select v-model="searchInfo.product" placeholder="请选择" clearable>
          <el-option
            v-for="item in productInfo"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="查询时间">
        <el-date-picker
          v-model="timeValue"
          type="datetimerange"
          :picker-options="pickerOptions2"
          placeholder="时间间隔应小于7天"
          align="left"
          @change="dateHandle()">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="Data.data"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="relationship"
        label="会员关系">
      </el-table-column>
      <el-table-column
        prop="uid"
        label="会员ID">
      </el-table-column>
      <el-table-column
        prop="gaccount"
        label="会员账号">
      </el-table-column>
      <el-table-column
        prop="gameName"
        label="所属游戏">
      </el-table-column>
      <el-table-column
        prop="cash"
        label="金币变化">
      </el-table-column>
      <el-table-column
        prop="success_cash"
        label="佣金">
      </el-table-column>
      <el-table-column
        prop="scale"
        label="我的实际佣金比例">
      </el-table-column>
      <el-table-column
        prop="realCommision"
        label="我的实际佣金">
      </el-table-column>
      <el-table-column
        prop="sole_scale"
        label="我的实际占成比例">
      </el-table-column>
      <el-table-column
        prop="realSoleCommision"
        label="占成收益">
        <template scope="scope">
          <span v-text="Number(scope.row.realSoleCommision)*-1"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="生成时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="getSize"
      @current-change="getData"
      :current-page="Data.pageCurrent"
      :page-sizes="[10, 20]"
      :page-size="Data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Data.totalCount">
    </el-pagination>
  </el-card>

</template>
<script>
  import api from '../request/api';
  export default {
    name: "commissions",
    data: function () {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > (Date.now()+3600 * 1000 * 24);            return timeFlag;
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                const date = new Date();
                const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
                const dateStr = [year, month, day].join('-');
                const a = new Date(dateStr);
                start.setTime( a.getTime()-(8*3600000));
                end.setTime( a.getTime()+3600000 * 16)
                picker.$emit('pick', [start, end]);
              }
            },{
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeValue: '',
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo: {
          begin_at: '',
          end_at: '',
          gaccount: '',
          product: ''
        },
        changesTable: [],
        pagingInfo: [],
        productInfo: [],
        parms: '',
        nickName: '',
        arrayData: [],
        total: {
          my: 0,
          next: 0
        }
      }
    },
    mounted: function () {
      "use strict";
      this.getData();
      this.getProduct();


    },
    methods: {
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
        this.Data.pageApi = api.commissions + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.commissions + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.Data.totalCount = Number(response.data.meta.pagination.total);
            _this.Data.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.Data.pagesize = Number(response.data.meta.pagination.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle(){
       if(this.timeValue[0] == null){
         this.searchInfo.begin_at = '';
         this.searchInfo.end_at = '';
       }else {
         let timeS = this.timeValue[1].getTime()-this.timeValue[0].getTime();
         if(timeS>3600 * 1000 * 24 * 7){
           this.$notify.error({
             title: '错误',
             message: '查询时间间隔应小于7天',
             offset: 100
           });
           this.searchInfo.begin_at = '';
           this.searchInfo.end_at = '';
           this.timeValue = '';
         }else {
           this.searchInfo.begin_at = this.dataFormat(this.timeValue[0],"yyyy-MM-dd hh:mm:ss");
           this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss");
         }
       }
      },
      parseParam: function (param) {
        var paramStr = "";
        for (var k in param) {
          if (param[k] != "" || typeof(param[k]) == "number") {
            paramStr += '&' + k + '=' + param[k]
          }
        }
        return paramStr;

      },

    },
    destroyed: function () {

    }
  }
</script>


