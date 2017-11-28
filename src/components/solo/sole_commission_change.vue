<template>
  <el-card class="box-card">
    <el-date-picker
      v-model="timeValue"
      type="datetimerange"
      :picker-options="pickerOptions2"
      placeholder="选择时间范围"
      align="left"
      @change="dateHandle()">
    </el-date-picker>
    <el-select v-model="searchInfo.type" placeholder="财务类型" clearable>
      <el-option
        v-for="item in productInfo"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
    <el-table
      :data="Data.data"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="score_change"
        label="变动金额">
      </el-table-column>
      <el-table-column
        prop="creat_time"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="operator_name"
        label="操作账号">
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注">
      </el-table-column>
    </el-table>
    <div style="margin: 20px 10px;">当前查询条件下分成总收入：<span style="color: red;" v-text="Data.count"></span></div>
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
    name: "commission_change",
    data:function(){
      return{
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > Date.now() || time.getTime() < (Date.now()  - 3600 * 1000 * 24 * 7);
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
            },{
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
            }]
        },
        timeValue:'',
        Data: {
          data:[],
          count:'',
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi:''
        },
        searchInfo:{
          begin_at:'',
          end_at:'',
          type:''
        },
        changesTable:[],
        pagingInfo: [],
        productInfo:[],
      }
    },
    mounted: function() {

      this.getData();
      this.getCount()
      var _this = this;
//      获得产品类型
      this.$ajax.get(api.moneyType).then(function (response) {
        _this.productInfo = response.data.m8a_record_types;
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {
      getData(val) {
        this.Data.pageApi = api.myChange + '?page=' + (val?val:this.Data.pageCurrent) + '&limit=' + this.Data.pagesize+"&"+this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.myChange + '?page=' + this.Data.pageCurrent + '&limit=' + (val?val:this.Data.pagesize)+"&"+this.parseParam(this.searchInfo);
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
      getCount(){
        let _this  = this;
        this.$ajax.get(api.commissionCount)
          .then(function (response) {
            _this.Data.count = response.data.data.count
          })
      },
      dateHandle(){
        this.timeValue[0]  == null ? (this.searchInfo.begin_at = '', this.searchInfo.end_at = '')
          :( this.searchInfo.begin_at = this.dataFormat(this.timeValue[0], "yyyy-MM-dd hh:mm:ss"),  this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss"))

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



    },
    destroyed: function() {

    }
  }
</script>


