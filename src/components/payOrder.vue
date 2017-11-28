<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="选择时间范围"
            align="left"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchInfo.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in productInfo"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item>
            <el-input v-model="searchTxt" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchType" placeholder="查询类型">
              <el-option
                v-for="item in typeInfo"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px" >
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="create_date" label="订单时间">
        </el-table-column>
        <el-table-column prop="uid" label="用户UID">
        </el-table-column>
        <el-table-column prop="type" label="订单类型">
        </el-table-column>
        <el-table-column prop="order_id" label="订单ID">
        </el-table-column>
        <el-table-column prop="score" label="订单金额">
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
        </el-table-column>
        <el-table-column prop="ip" label="IP">
        </el-table-column>
        <el-table-column prop="location" label="区域">
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
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "",

    data: function () {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > Date.now() || time.getTime() <  (Date.now()-3600 * 1000 * 24*31);
            return timeFlag;
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
              text: '最近30天',
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
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        switchValue:true,
        searchTxt:'',
        searchType:'order_id',
        currentTotal:{},
        searchInfo: {
          begin_at: '',
          end_at: '',
          type: '',
          uid:'',
          order_id:'',
        },
        typeInfo:[{
          name:'订单号'
          ,id:'order_id'
        },
          {
            id:'uid',
            name:'uid'
          }
        ],
        productInfo: [
          {
            name:'zdb',
            id:'zdb'
          },
          {
            name:'ag',
            id:'ag'
          }
        ],
        rejectInfo: {
          arr: [],
          txt: ''
        },
        rejectId: "",
        noAllowInfo:'',
        noAllowId:'',
        uid:'',
        ip:'',
        isOn:'',
        loginNum:'',
        noLogin:'',
        location:'',
        showInfo:false,
        showReject:false,
        showNoAllow:false
      }
    },
    mounted: function () {
      this.getData()
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      isOper: function () {
        return this.$store.state.login.loginData.isOperate;
      },
//      show:function () {
//        if(this.isOper!=1&&this.isOper!=4){
//            this.getData()
//        }
//      }
    },
    methods: {


      typeChange(value){

      },
      getData(val) {
        this.searchInfo.order_id = '';
        this.searchInfo.uid = '';
        for(var k in this.searchInfo){
          if(k==this.searchType){
            this.searchInfo[k] = this.searchTxt;
          }
        }

          this.Data.pageApi = api.payOrder + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);


        this.dataHandle();
      },
      getSize(val) {

          this.Data.pageApi = api.payOrder + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);

        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.currentTotal = response.data.total;
            _this.Data.totalCount = Number(response.data.meta.total);
            _this.Data.pageCurrent = Number(response.data.meta.current_page);
            _this.Data.pagesize = Number(response.data.meta.per_page);
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

    },

  }
</script>
<style type="text/css" scoped>
  .num {
    color: #ff6894;
    margin: 8px;
  }

  .form-inline {
    display: inline-block;
  }

  .col-6 {
    display: inline-block;
    width: 49%;
    vertical-align: middle;
  }

  .table-striped > tbody > tr:nth-of-type(odd).detail {
    background: #ffd4e2;
  }

  .col-4 {
    display: inline-block;
    width: 32.33%;
    vertical-align: middle;
  }
  .class-a{
    color: #4CAF50!important;
    font-weight: bold;
  }
  .class-a.class-b{
    color: red!important;
  }

  .col-8 {
    display: inline-block;
    width: 66.66%;
    vertical-align: middle;
  }
</style>


