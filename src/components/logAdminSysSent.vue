<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="用户UID">
        <el-input v-model="searchInfo.uid" placeholder="请输入用户UID"></el-input>
      </el-form-item>
      <el-form-item label="时间">
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
        label="操作账号" prop="operate">
      </el-table-column>
      <el-table-column
        label="用户UID">
        <template scope="scope">
          <a href="#" v-text="scope.row.uid" @click.prevent="showDetailFn(scope.row.aid,scope.row.uid,scope.row.user_score)"></a>
        </template>
      </el-table-column>
      <el-table-column
        label="用户账号" prop="gaccount">
      </el-table-column>
      <el-table-column
        prop="score"
        label="转出金额">
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="转出时间">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;text-align: right">
      昨日上分充值: <span style="color: rgb(3, 169, 244);" v-text="totalScore.yesterday"></span>,
      今日上分充值: <span style="color: rgb(3, 169, 244);" v-text="totalScore.today"></span>,
      上月上分充值: <span style="color: rgb(3, 169, 244);" v-text="totalScore.lastMonth"></span>,
      当月上分充值: <span style="color: rgb(3, 169, 244);" v-text="totalScore.thisMount"></span>
    </div>
    <el-pagination
      @size-change="getSize"
      @current-change="getData"
      :current-page="Data.pageCurrent"
      :page-sizes="[10, 20]"
      :page-size="Data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Data.totalCount">
    </el-pagination>
    <el-dialog title="用户上分记录" size="large" :visible.sync="showDetail" :show-close="false">
      <el-table
        :data="Data1.data"
        border
        @sort-change="sortHandle"
        style="width: 100%; margin-top: 20px">
        <el-table-column
          label="用户UID" prop="uid">
        </el-table-column>
        <el-table-column
          label="用户账号" prop="gaccount">
        </el-table-column>
        <el-table-column
          prop="score"
          label="转出金额"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="order_id"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="转出时间">
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;text-align: right"> 当月上分充值: <span style="color: rgb(3, 169, 244);"
                                                                     v-text="userTotalScore"></span></div>
      <el-pagination
        @size-change="getSize1"
        @current-change="getData1"
        :current-page="Data1.pageCurrent"
        :page-sizes="[10, 20]"
        :page-size="Data1.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Data1.totalCount">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false;">关 闭</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
  import api from '../request/api';
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
          uid: '',
          score: ''
        },
        Data1: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        totalScore: {},
        userTotalScore: '',
        detail: {
          aid: '',
          uid: '',
        },
        user_score:'',
        showDetail:false
      }
    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
    },
    mounted: function () {
      "use strict";
      this.getData();
      this.coutHandle();
    },
    methods: {
      showDetailFn(aid, uid ){
        this.detail.aid = aid;
        this.detail.uid = uid;
        this.getData1();
        this.showDetail = true;
        this.getCount(aid,uid);
      },
      getCount(aid,uid){
        let _this =this;
        this.$ajax.get(api.operUserMonthCount+'?aid='+aid+'&uid='+uid).then(function (response) {
          _this.userTotalScore = response.data.data.count;
        })
      },
      sortHandle(value){
        value.order == 'descending' ? this.searchInfo.score = 'desc' : this.searchInfo.score = 'asc';
        this.getData();
      },
      getData(val) {
        this.Data.pageApi = api.adminGiveLog + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.adminGiveLog + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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
      getData1(val) {
        this.Data1.pageApi = api.userMoneyLog + '?page=' + (val ? val : this.Data1.pageCurrent) + '&limit=' + this.Data1.pagesize + this.parseParam(this.detail);
        this.dataHandle1();
      },
      getSize1(val) {

        this.Data1.pageApi = api.userMoneyLog + '?page=' + this.Data1.pageCurrent + '&limit=' + (val ? val : this.Data1.pagesize) + this.parseParam(this.detail);
        //搜索结束
        this.dataHandle1();
      },
      dataHandle1(){
        var _this = this;
        this.$ajax.get(this.Data1.pageApi)
          .then(function (response) {
            _this.Data1.data = response.data.data;
            _this.Data1.totalCount = Number(response.data.meta.pagination.total);
            _this.Data1.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.Data1.pagesize = Number(response.data.meta.pagination.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      coutHandle(){
        var _this = this;
        this.$ajax.get(api.adminMouthCount)
          .then(function (response) {

            _this.totalScore = response.data.data;
            console.log(response.data)
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle(){
        if (this.timeValue[0] == null) {
          this.searchInfo.begin_at = '';
          this.searchInfo.end_at = '';
        } else {
          this.searchInfo.begin_at = this.dataFormat(this.timeValue[0], "yyyy-MM-dd hh:mm:ss");
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


    },
    destroyed: function () {

    }
  }
</script>

