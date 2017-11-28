<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item  label="代理号">
        <el-input v-model="searchInfo.aname" placeholder="请输入代理号"></el-input>
      </el-form-item>
      <el-form-item label="查询时间">
        <el-date-picker
          v-model="timeValue"
          type="datetimerange"
          :picker-options="pickerOptions2"
          placeholder="选择时间"
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
        prop="id"
        label="索引">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="aname"
        label="代理号">
      </el-table-column>
      <el-table-column
        prop="score_change"
        label="操作金额">
      </el-table-column>
      <el-table-column
        prop="after_change"
        label="操作后金额">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作者">
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
  import api from '../../request/api';
  export default {
    name: "log",
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
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        timeValue: '',
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo: {
          begin_at: '',
          end_at: '',
          aname: '',
          type: ''
        },
        productInfo: [],
      }
    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {
      "use strict";
      this.getData();

    },
    methods: {
      getData(val) {
        this.Data.pageApi = api.soleLog + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.soleLog + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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
          this.searchInfo.begin_at = this.dataFormat(this.timeValue[0],"yyyy-MM-dd hh:mm:ss");
          this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss");
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

      //获得类型
      getType:function () {
        var _this = this;
        this.$ajax.get(api.logType).then(function (response) {
          _this.productInfo = response.data.m8a_log_types;
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    destroyed: function () {

    }
  }
</script>

