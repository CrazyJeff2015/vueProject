<template>
  <div>
    <el-collapse value="1" @change="handleChange" accordion>
      <el-collapse-item title="财务记录详情" name="1">
        <table class="table  table-bordered">
          <tbody>
          <tr>
            <td class="text-left">
              <span>总金币：</span>
              <span v-text="data1.total_score"></span>
              <span class="margin-30">金币：</span>
              <span v-text="data1.score"></span>
              <span class="margin-30">银行：</span>
              <span v-text="data1.bank_score"></span>
            </td>
          </tr>
          <tr>
            <td class="text-left">
              <span>总充值：</span>
              <span v-text="data1.total_deposit"></span>
            </td>
          </tr>
          <tr>
            <td class="text-left">
              <span>总营销金币：</span>
              <span v-text="data1.total_ccy"></span>
              <span class="margin-30">当前锁定流水：</span>
              <span v-text="data1.locked_flow"></span>
            </td>
          </tr>
          <tr>
            <td class="text-left">
              <span>用户总输赢：</span>
              <span v-text="data1.consume"></span>
            </td>
          </tr>
          </tbody>
        </table>
      </el-collapse-item>
      <el-collapse-item title="银行操作记录" name="2">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="timeValue2"
              type="datetimerange"
              :picker-options="pickerOptions2"
              placeholder=""
              align="center"
              @change="dateHandle2()">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData2()">搜 索</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="Data2.data" border style="width: 100%;">
          <el-table-column prop="time" label="操作时间">
          </el-table-column>
          <el-table-column prop="type" label="操作类型">
          </el-table-column>
          <el-table-column prop="client" label="客户端">
          </el-table-column>
          <el-table-column prop="operating_amount" label="操作金额">
          </el-table-column>
          <el-table-column prop="pre_operation_amount" label="操作前现金">
          </el-table-column>
          <el-table-column prop="post_operation_amount" label="操作后现金">
          </el-table-column>
          <el-table-column prop="pre_operation_bank" label="操作前银行">
          </el-table-column>
          <el-table-column prop="post_operation_bank" label="操作后银行">
          </el-table-column>
          <el-table-column prop="ip" label="操作地址">
          </el-table-column>
          <el-table-column prop="location" label="区域">
          </el-table-column>

        </el-table>
        <el-pagination
          @size-change="getSize2"
          @current-change="getData2"
          :current-page="Data2.pageCurrent"
          :page-sizes="[10]"
          :page-size="Data2.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Data2.totalCount">
        </el-pagination>
      </el-collapse-item>
      <el-collapse-item title="充值操作记录" name="3">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="timeValue3"
              type="datetimerange"
              :picker-options="pickerOptions2"
              placeholder=""
              align="center"
              @change="dateHandle3()">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData3()">搜 索</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" v-if="permissions.opration_queryorder">
          <el-form-item label="订单号">
            <el-input v-model="order_id" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label="状态">
          <span v-text="order_status"></span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="queryOrder()">查 询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="Data3.data" border style="width: 100%;">
          <el-table-column prop="time" label="操作时间">
          </el-table-column>
          <el-table-column prop="type" label="状态">
          </el-table-column>
          <el-table-column prop="way" label="渠道">
          </el-table-column>
          <!--<el-table-column prop="gaccount" label="直冲账号">-->
          <!--</el-table-column>-->
          <el-table-column prop="uid" label="ID">
          </el-table-column>
          <el-table-column prop="order_num" label="订单号">
          </el-table-column>
          <el-table-column prop="order_amount" label="金额">
          </el-table-column>
          <el-table-column prop="pre_operation_amount" label="充值前金币">
          </el-table-column>
          <el-table-column prop="post_operation_amount" label="充值后金币">
          </el-table-column>
          <el-table-column prop="ip" label="操作地址">
          </el-table-column>
          <el-table-column prop="location" label="区域">
          </el-table-column>

        </el-table>
        <el-pagination
          @size-change="getSize3"
          @current-change="getData3"
          :current-page="Data3.pageCurrent"
          :page-sizes="[10]"
          :page-size="Data3.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Data3.totalCount">
        </el-pagination>
      </el-collapse-item>
      <el-collapse-item title="代理充值记录" name="6">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="timeValue6"
              type="datetimerange"
              :picker-options="pickerOptions2"
              placeholder=""
              align="center"
              @change="dateHandle6()">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData6()">搜 索</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="Data6.data" border style="width: 100%;">
          <el-table-column prop="operator" label="操作者">
          </el-table-column>
          <el-table-column prop="score_change" label="金额">
          </el-table-column>
          <el-table-column prop="created_at" label="时间">
          </el-table-column>
          <el-table-column prop="ip" label="IP">
          </el-table-column>
        </el-table>
        <div style="margin: 20px">当前条件下充值金额总计:  <span style="color:red;" v-text="count6"></span></div>
        <el-pagination
          @size-change="getSize6"
          @current-change="getData6"
          :current-page="Data6.pageCurrent"
          :page-sizes="[10]"
          :page-size="Data6.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Data6.totalCount">
        </el-pagination>
      </el-collapse-item>
      <el-collapse-item title="金币兑换记录" name="4">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="timeValue4"
              type="datetimerange"
              :picker-options="pickerOptions2"
              placeholder=""
              align="center"
              @change="dateHandle4()">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData4()">搜 索</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="Data4.data" border style="width: 100%;">
          <el-table-column prop="time" label="操作时间">
          </el-table-column>
          <el-table-column prop="type" label="状态">
          </el-table-column>
          <el-table-column prop="app_time" label="申请时间">
          </el-table-column>
          <el-table-column prop="uid" label="ID">
          </el-table-column>
          <el-table-column prop="user" label="账号">
          </el-table-column>
          <el-table-column prop="name_match" label="姓名匹配">
          </el-table-column>
          <el-table-column prop="account_name" label="户头">
          </el-table-column>
          <el-table-column prop="bank_name" label="银行名称">
          </el-table-column>
          <el-table-column prop="branch_name" label="支行名称">
          </el-table-column>
          <el-table-column prop="bank_account" label="银行账号">
          </el-table-column>
          <el-table-column prop="exchange_score" label="兑换金额">
          </el-table-column>
          <el-table-column prop="fee" label="手续费">
          </el-table-column>
          <el-table-column prop="ip" label="操作地址">
          </el-table-column>
          <el-table-column prop="location" label="区域">
          </el-table-column>

        </el-table>
        <el-pagination
          @size-change="getSize4"
          @current-change="getData4"
          :current-page="Data4.pageCurrent"
          :page-sizes="[10]"
          :page-size="Data4.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Data4.totalCount">
        </el-pagination>
      </el-collapse-item>
      <el-collapse-item title="营销货币记录" name="5">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="timeValue5"
              type="datetimerange"
              :picker-options="pickerOptions2"
              placeholder=""
              align="center"
              @change="dateHandle5()">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData5()">搜 索</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="Data5.data" border style="width: 100%;">
          <el-table-column prop="time" label="操作时间">
          </el-table-column>
          <el-table-column prop="type" label="类别">
          </el-table-column>
          <el-table-column prop="withdrawal_amount" label="领取金额">
          </el-table-column>
          <el-table-column prop="operator" label="操作者">
          </el-table-column>
          <el-table-column prop="ip" label="ip">
          </el-table-column>
          <el-table-column prop="location" label="区域">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="getSize5"
          @current-change="getData5"
          :current-page="Data5.pageCurrent"
          :page-sizes="[10]"
          :page-size="Data5.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Data5.totalCount">
        </el-pagination>
      </el-collapse-item>
    </el-collapse>

  </div>


</template>
<script>
  import api from '../request/api';
  export default {
    name: "userFinanceList",
    data: function () {
      return {
        data1:[],
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > (Date.now()+3600 * 1000 * 24);            return timeFlag;
          },
          shortcuts: [{
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
          },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                const date = new Date();
                const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
                const dateStr = [year, month, day].join('-');
                const a = new Date(dateStr);
                start.setTime(a.getTime() - 3600 * 1000 * 32);
                end.setTime(a.getTime() - 3600 * 1000 * 8);
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
        timeValue2: '',
        Data2: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo2: {
          begin_at: '',
          end_at: '',
        },
        timeValue3: '',
        Data3: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo3: {
          begin_at: '',
          end_at: '',
        },
        order_id:'',
        order_status:'',
        timeValue4: '',
        Data4: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo4: {
          begin_at: '',
          end_at: '',
        },
        timeValue5: '',
        Data5: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        Data6: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo5: {
          begin_at: '',
          end_at: '',
        },
        timeValue6: '',
        count6:'',
        searchInfo6: {
          begin_at: '',
          end_at: '',
        },



      }
    },
    props: ['uid'],
    mounted: function () {
      this.getFinanceInfo();
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },

    methods: {
      handleChange(row){
          switch (row){
            case '1':
              this.getFinanceInfo();
              break;
            case '2':
                this.getData2();
                break;
            case '3':
              this.getData3();
              break;
            case '4':
              this.getData4();
              break;
            case '5':
              this.getData5();
              break;
            case '6':
              this.getData6();
              break;
          }
      },

      //获取财务信息
      getFinanceInfo: function () {
        var requestUrl = api.getUserBinfo+this.uid;
        var _this = this;
        this.$ajax.get(requestUrl)
          .then(function (response) {
            _this.data1 = response.data.data;

          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getData2(val) {
        this.Data2.pageApi = api.getBankList + this.uid + '?page=' + (val ? val : this.Data2.pageCurrent) + '&limit=' + this.Data2.pagesize  + this.parseParam(this.searchInfo2);
        this.dataHandle2();
      },
      getSize2(val) {

        this.Data2.pageApi = api.getBankList + this.uid + '?page=' + this.Data2.pageCurrent + '&limit=' + (val ? val : this.Data2.pagesize)  + this.parseParam(this.searchInfo2);
        //搜索结束
        this.dataHandle2();
      },
      dataHandle2(){
        var _this = this;
        this.$ajax.get(this.Data2.pageApi)
          .then(function (response) {
            _this.Data2.data = response.data.data;
            _this.Data2.totalCount = Number(response.data.meta.total);
            _this.Data2.pageCurrent = Number(response.data.meta.current_page);
            _this.Data2.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle2(){
        if (this.timeValue2[0] == null) {
          this.searchInfo2.begin_at = '';
          this.searchInfo2.end_at = '';
        }
//        else {
//          let timeS = this.timeValue2[1].getTime() - this.timeValue2[0].getTime();
//          if (timeS > 3600 * 1000 * 24 * 3) {
//            this.$notify.error({
//              title: '错误',
//              message: '查询时间间隔应小于3天',
//              offset: 100
//            });
//            this.searchInfo2.begin_at = '';
//            this.searchInfo2.end_at = '';
//            this.timeValue2 = '';
//          }
          else {
            this.searchInfo2.begin_at = this.dataFormat(this.timeValue2[0], "yyyy-MM-dd hh:mm:ss");
            this.searchInfo2.end_at = this.dataFormat(this.timeValue2[1], "yyyy-MM-dd hh:mm:ss");
          }
//        }

      },
      getData3(val) {
        this.Data3.pageApi = api.getDespositList + this.uid + '?page=' + (val ? val : this.Data3.pageCurrent) + '&limit=' + this.Data3.pagesize  + this.parseParam(this.searchInfo3);
        this.dataHandle3();
      },
      getSize3(val) {

        this.Data3.pageApi = api.getDespositList + this.uid + '?page=' + this.Data3.pageCurrent + '&limit=' + (val ? val : this.Data3.pagesize)  + this.parseParam(this.searchInfo3);
        //搜索结束
        this.dataHandle3();
      },
      dataHandle3(){
        var _this = this;
        this.$ajax.get(this.Data3.pageApi)
          .then(function (response) {
            _this.Data3.data = response.data.data;
            _this.Data3.totalCount = Number(response.data.meta.total);
            _this.Data3.pageCurrent = Number(response.data.meta.current_page);
            _this.Data3.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle3(){
        if (this.timeValue3[0] == null) {
          this.searchInfo3.begin_at = '';
          this.searchInfo3.end_at = '';
        }
//        else {
//          let timeS = this.timeValue3[1].getTime() - this.timeValue3[0].getTime();
//          if (timeS > 3600 * 1000 * 24 * 3) {
//            this.$notify.error({
//              title: '错误',
//              message: '查询时间间隔应小于3天',
//              offset: 100
//            });
//            this.searchInfo3.begin_at = '';
//            this.searchInfo3.end_at = '';
//            this.timeValue3 = '';
//          }
          else {
            this.searchInfo3.begin_at = this.dataFormat(this.timeValue3[0], "yyyy-MM-dd hh:mm:ss");
            this.searchInfo3.end_at = this.dataFormat(this.timeValue3[1], "yyyy-MM-dd hh:mm:ss");
          }
//        }
      },
      queryOrder:function () {
        var _this = this;
        _this.order_status ='';
        this.$ajax({
          url:api.queryOrder,
          method:"post",
          data:{
            order_id:_this.order_id
          }
        }).then(function (response) {
          _this.order_status = response.data.data.status?response.data.data.status:response.data.data.message;
        }).catch(function (error) {
          console.log(error)
        })
      },
      getData4(val) {
        this.Data4.pageApi = api.getExchangeList + this.uid + '?page=' + (val ? val : this.Data4.pageCurrent) + '&limit=' + this.Data4.pagesize  + this.parseParam(this.searchInfo4);
        this.dataHandle4();
      },
      getSize4(val) {

        this.Data4.pageApi = api.getExchangeList + this.uid + '?page=' + this.Data4.pageCurrent + '&limit=' + (val ? val : this.Data4.pagesize)  + this.parseParam(this.searchInfo4);
        //搜索结束
        this.dataHandle4();
      },
      dataHandle4(){
        var _this = this;
        this.$ajax.get(this.Data4.pageApi)
          .then(function (response) {
            _this.Data4.data = response.data.data;
            _this.Data4.totalCount = Number(response.data.meta.total);
            _this.Data4.pageCurrent = Number(response.data.meta.current_page);
            _this.Data4.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle4(){
        if (this.timeValue4[0] == null) {
          this.searchInfo4.begin_at = '';
          this.searchInfo4.end_at = '';
        }
//        else {
//          let timeS = this.timeValue4[1].getTime() - this.timeValue4[0].getTime();
//          if (timeS > 3600 * 1000 * 24 * 3) {
//            this.$notify.error({
//              title: '错误',
//              message: '查询时间间隔应小于3天',
//              offset: 100
//            });
//            this.searchInfo4.begin_at = '';
//            this.searchInfo4.end_at = '';
//            this.timeValue4 = '';
//          }
          else {
            this.searchInfo4.begin_at = this.dataFormat(this.timeValue4[0], "yyyy-MM-dd hh:mm:ss");
            this.searchInfo4.end_at = this.dataFormat(this.timeValue4[1], "yyyy-MM-dd hh:mm:ss");
          }
//        }
      },
      getData5(val) {
        this.Data5.pageApi = api.getMarketList + this.uid + '?page=' + (val ? val : this.Data5.pageCurrent) + '&limit=' + this.Data5.pagesize  + this.parseParam(this.searchInfo5);
        this.dataHandle5();
      },
      getSize5(val) {

        this.Data5.pageApi = api.getMarketList + this.uid + '?page=' + this.Data5.pageCurrent + '&limit=' + (val ? val : this.Data5.pagesize)  + this.parseParam(this.searchInfo5);
        //搜索结束
        this.dataHandle5();
      },
      dataHandle5(){
        var _this = this;
        this.$ajax.get(this.Data5.pageApi)
          .then(function (response) {
            _this.Data5.data = response.data.data;
            _this.Data5.totalCount = Number(response.data.meta.total);
            _this.Data5.pageCurrent = Number(response.data.meta.current_page);
            _this.Data5.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getData6(val) {
        this.Data6.pageApi = api.aSentLog + this.uid + '?page=' + (val ? val : this.Data6.pageCurrent) + '&limit=' + this.Data6.pagesize+ this.parseParam(this.searchInfo6) ;
        this.dataHandle6();
      },
      getSize6(val) {

        this.Data6.pageApi = api.aSentLog + this.uid + '?page=' + this.Data6.pageCurrent + '&limit=' + (val ? val : this.Data6.pagesize)+ this.parseParam(this.searchInfo6);
        //搜索结束
        this.dataHandle6();
      },
      dataHandle6(){
        var _this = this;
        _this.get6Count();
        this.$ajax.get(this.Data6.pageApi)
          .then(function (response) {
            _this.Data6.data = response.data.data;
            _this.Data6.totalCount = Number(response.data.meta.pagination.total);
            _this.Data6.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.Data6.pagesize = Number(response.data.meta.pagination.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      get6Count(){
          var _this = this;
        this.$ajax.get(api.aLogCount+_this.uid+_this.parseParam(this.searchInfo6))
          .then(function (response) {
           _this.count6 = response.data.scoreCount;
        })
      },
      dateHandle5(){
        if (this.timeValue5[0] == null) {
          this.searchInfo5.begin_at = '';
          this.searchInfo5.end_at = '';
        }
//        else {
//          let timeS = this.timeValue5[1].getTime() - this.timeValue5[0].getTime();
//          if (timeS > 3600 * 1000 * 24 * 3) {
//            this.$notify.error({
//              title: '错误',
//              message: '查询时间间隔应小于3天',
//              offset: 100
//            });
//            this.searchInfo5.begin_at = '';
//            this.searchInfo5.end_at = '';
//            this.timeValue5 = '';
//          }
          else {
            this.searchInfo5.begin_at = this.dataFormat(this.timeValue5[0], "yyyy-MM-dd hh:mm:ss");
            this.searchInfo5.end_at = this.dataFormat(this.timeValue5[1], "yyyy-MM-dd hh:mm:ss");
          }
//        }
      },
      dateHandle6(){
        if (this.timeValue6[0] == null) {
          this.searchInfo6.begin_at = '';
          this.searchInfo6.end_at = '';
        }
        else {
          this.searchInfo6.begin_at = this.dataFormat(this.timeValue6[0], "yyyy-MM-dd hh:mm:ss");
          this.searchInfo6.end_at = this.dataFormat(this.timeValue6[1], "yyyy-MM-dd hh:mm:ss");
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
  }
</script>
<style type="text/css" scoped>

</style>


