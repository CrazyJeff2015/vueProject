<template>
  <div class="box-card">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="所属代理">
        <el-input v-model="agentName" disabled></el-input>
      </el-form-item>
      <el-form-item label="会员账号">
        <el-input v-model="searchInfo.gaccount" placeholder="请输入会员账号"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="timeValue"
          type="datetimerange"
          :picker-options="pickerOptions2"
          placeholder="选择时间范围"
          align="left"
          @change="dateHandle()">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="Data.data" border style="width: 100%; margin-top: 20px">
      <el-table-column type="index" width="80">
      </el-table-column>
      <el-table-column prop="customerId" label="会员ID">
      </el-table-column>
      <el-table-column prop="gaccount" label="会员账号">
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间">
      </el-table-column>
      <el-table-column prop="success_cash" label="累计佣金">
      </el-table-column>
      <el-table-column prop="is_on" label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="small" v-if="permissions.view_consume" @click="showCash(scope.row.customerId)">游戏记录</el-button>
        </template>
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
    <div v-if="showDialog" class="cashDialog">
      <h4 style="margin-left: 20px">游戏记录</h4>
      <el-table
        :data="Data1.data" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="agent" label="所属代理">
        </el-table-column>
        <el-table-column prop="uid" label="会员ID">
        </el-table-column>
        <el-table-column prop="cash" label="金币变化">
        </el-table-column>
        <el-table-column prop="success_cash" label="佣金">
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="getSize1"
        @current-change="getData1"
        :current-page="Data1.pageCurrent"
        :page-sizes="[10, 20]"
        :page-size="Data1.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Data1.totalCount">
      </el-pagination>
      <div style="text-align: right;background: #fff;padding: 20px">
        <el-button @click="showDialog = false">关 闭</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import api from '../request/api';
  export default {
    name: "",
    props: ['id', 'agentName'],
    mounted: function () {
      this.getData()
    },
    computed: {

      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },

    },
    methods: {
      getData(val) {
        this.Data.pageApi = api.agentCustomersList + this.id + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + "&" + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.agentCustomersList + this.id + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + "&" + this.parseParam(this.searchInfo);
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
        this.Data1.pageApi = api.agentCusConsume + this.cusId + '?page=' + (val ? val : this.Data1.pageCurrent) + '&limit=' + this.Data1.pagesize;
        this.data1Handle();
      },
      getSize1(val) {

        this.Data1.pageApi = api.agentCusConsume + this.cusId + '?page=' + this.Data1.pageCurrent + '&limit=' + (val ? val : this.Data1.pagesize);
        //搜索结束
        this.data1Handle();
      },
      data1Handle(){
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
      showCash(id){
        this.cusId = id;
        this.showDialog = true;
        this.getData1();
      },
      dateHandle(){
        this.timeValue[0] == null ? (this.searchInfo.begin_at = '', this.searchInfo.end_at = '')
          : ( this.searchInfo.begin_at = this.dataFormat(this.timeValue[0], "yyyy-MM-dd hh:mm:ss"), this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss"))
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    destroyed: function () {

    },
    data: function () {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > (Date.now() + 3600 * 1000 * 24);
            return timeFlag;
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
            }, {
              text: '最近三天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
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
        Data1: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        cusId: '',
        searchInfo: {
          begin_at: '',
          end_at: '',
          gaccount: '',
        },
        showDialog: false
      }
    }
  }
</script>
<style type="text/css" scoped>
  .cashDialog {
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    background: #fff;
    z-index: 99;
    height: 100%;
  }
  .cashDialog .el-pagination {
    background: #fff;
    margin-top: 0;
    padding-top: 20px;
  }
</style>


