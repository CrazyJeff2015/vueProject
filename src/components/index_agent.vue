<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchTxt" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchType" placeholder="查询类型">
            <el-option
              v-for="item in typeInfo"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="switchValue"
            on-text="精确"
            off-text="模糊"
            @change="switchChange">
          </el-switch>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="选择时间范围"
            align="right"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px"  @sort-change="sortHandle">
        <el-table-column prop="id" width="80" label="代理ID">
        </el-table-column>
        <el-table-column prop="aname" label="代理号">
        </el-table-column>
        <el-table-column sortable="custom"  prop="scale" label="佣金比例">
        </el-table-column>
        <el-table-column sortable="custom"  prop="sole_scale" label="占成比例">
        </el-table-column>
        <el-table-column  prop="agent_num" label="推广代理数">
        </el-table-column>
        <el-table-column  prop="user_num" label="推广玩家数">
          <template scope="scope">
            <a href="#" @click.prevent="getCustomers(scope.row.id,scope.row.agent_name)" v-text="scope.row.user_num" v-if="scope.row.user_num>0"></a>
            <span v-else v-text="scope.row.user_num"></span>
          </template>
        </el-table-column>
        <el-table-column  prop="score" label="财产">
        </el-table-column>
        <el-table-column  prop="nowCashCount" label="本周玩家金币变化">
        </el-table-column>

        <el-table-column prop="created_at" label="注册时间">
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
    <div v-if="showCustom">
      <el-dialog title="查看会员" :visible.sync="showCustom" :show-close="false" size="large" top="5%">
        <customer_msg :id="cusInfo.id" :agentName="cusInfo.agentName"></customer_msg>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="showCustom = false;">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import api from '../request/api';
  import customer_msg from "./customer_msg";

  export default {
    name: "admin_index_agent",
    components: {
      customer_msg
    },
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
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo: {
          begin_at: '',
          end_at: '',
          aname: '',
          aid:'',
          preg:1,
          sortScale:'',
          sortSoleScale:''
        },
        switchValue:true,
        searchTxt:'',
        searchType:'aname',
        typeInfo:[
          {
            id:'aname',
            name:'代理号'
          },
          {
            id:'aid',
            name:'代理ID'
          },
        ],
        showCustom: false,
        Data1:{
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        cusInfo:{
            id:'',
          agentName:""
        }
      }
    },

    computed: {

      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      permissions:function () {
        return this.$store.state.permissions.permissionsData;
      },

    },
    mounted: function () {
      "use strict";
      this.getData();

    },

    methods: {
      getCustomers(id,agentName){
        this.cusInfo.id = id;
        this.cusInfo.agentName =agentName;
        this.showCustom = true;
      },
      switchChange(){
        this.switchValue==true?this.searchInfo.preg=1:this.searchInfo.preg=0;
      },

      sortHandle(value){
        if(value.prop=='scale'){
            this.searchInfo.sortSoleScale = '';
          value.order == 'descending'? this.searchInfo.sortScale = 'desc':this.searchInfo.sortScale = 'asc';
        }else if(value.prop=='sole_scale'){
          this.searchInfo.sortScale = '';
          value.order == 'descending'? this.searchInfo.sortSoleScale = 'desc':this.searchInfo.sortSoleScale = 'asc';
        }
        this.getData();
      },

      getData(val) {
        this.searchInfo.aid = '';
        this.searchInfo.aname = '';
        for(var k in this.searchInfo){
          if(k==this.searchType){
            this.searchInfo[k] = this.searchTxt;
          }
        }
        if(this.searchTxt!=''){
          this.searchInfo.sortSoleScale='';
          this.searchInfo.sortScale='';
        }
        this.Data.pageApi = api.indexAgent + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + "&" + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.indexAgent + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + "&" + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.adminAgent = response.data.data;
            _this.Data.totalCount = Number(response.data.meta.pagination.total);
            _this.Data.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.Data.pagesize = Number(response.data.meta.pagination.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },


      getInfo: function () {
        //获取最新用户数据
        var _this = this;
        this.$ajax.get(api.updateUserInfo)
          .then(function (response) {
            _this.userData = response.data.data;
            if (_this.userData.is_on == 0) {
              _this.logout();
            }
            _this.$store.dispatch('getLoginData', {
              'loginId': _this.userData.id,
              'loginAgentName': _this.userData.agent_name,
              'loginName': _this.userData.aname,
              'loginScore': _this.userData.score,
              'loginScale': _this.userData.scale,
              'loginIsOn': _this.userData.is_on,
              'loginPerfect': _this.userData.perfect,
              'loginBankScore': _this.userData.bank_score,
              'isChild': _this.userData.is_child,
              'isOperate': _this.userData.is_operate,
              'pid': _this.userData.pid,
              'isSole': _this.userData.is_sole,
              'soleScore':_this.userData.sole_score,
              'createdAt':_this.userData.created_at,
              'lastLoginTime':_this.userData.last_login_time,
              'is_agent':_this.userData.is_agent,
              'qq':_this.userData.qq,
              'cell':_this.userData.cell,
              'email':_this.userData.email,
              'sole_scale':_this.userData.sole_scale,
              'default_sole_scale':_this.userData.default_sole_scale,
              'default_scale':_this.userData.default_scale,
              'updateTime': _this.dataFormat(new Date(),"yyyy-MM-dd hh:mm:ss")
            });
          }).catch(function (error) {
          console.log(error);
          if (error.message == "Unauthenticated.") {
            _this.logout500();
            alert("登陆超时，请重新登陆。")
          }
        })
      },
//      获取财务类型
      getType: function () {
        var _this = this;
        this.$ajax.get(api.moneyType).then(function (response) {
          _this.productInfo = response.data.m8a_record_types;
        })
          .catch(function (error) {
            console.log(error);
          });
      },

//      %过滤器
      myfilter: function (value) {
        return value + "%"
      },
      //状态过滤器
      agentStatus: function (value) {
        if (value == 1) {
          return '冻结';
        } else {
          return '激活';
        }
      },



      destroyed: function () {

      }
    }
  }
</script>


