<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="会员账号">
          <el-input v-model="searchInfo.gaccount" placeholder="请输入完整会员账号"></el-input>
        </el-form-item>
        <!--<el-form-item label="注册时间">-->
          <!--<el-date-picker-->
            <!--v-model="timeValue"-->
            <!--type="datetimerange"-->
            <!--:picker-options="pickerOptions2"-->
            <!--placeholder="选择时间范围"-->
            <!--align="left"-->
            <!--@change="dateHandle()">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
          <el-button @click="showAdd=true">新增玩家</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px" >
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="customerId" label="会员ID">
        </el-table-column>
        <el-table-column prop="gaccount" label="会员账号">
        </el-table-column>
        <el-table-column  prop="created_at" label="注册时间">
        </el-table-column>
        <el-table-column prop="cash_score" label="总输赢">
        </el-table-column>
        <el-table-column prop="tax_score" label="总佣金">
        </el-table-column>
        <el-table-column prop="is_on" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" v-if="permissions.donation_amount"  @click="showSentFn(scope.row.gaccount)">赠送佣金</el-button>
            <el-button size="mini" v-if="permissions.view_customer_consume"  @click="showCashFn(scope.row.customerId)">游戏记录</el-button>
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
    </el-card>
     <el-dialog title="赠送佣金" :visible.sync="showSent" :show-close="false">
       <withdrawals1 :gaccount="sentNickName" ></withdrawals1>
       <div slot="footer" class="dialog-footer">
         <el-button @click="showSent = false;">关 闭</el-button>
       </div>
     </el-dialog>
    <el-dialog title="近三天游戏记录" size="large" :visible.sync="showCash" :show-close="false">
      <el-table
        :data="Data1.data" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="game" label="游戏名">
        </el-table-column>
        <el-table-column prop="cash" label="金币变化">
        </el-table-column>
        <el-table-column prop="success_cash" label="结算金币">
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间">
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
      <div style="text-align: right">
        <el-button @click="showCash = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增玩家" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addData" ref="addData" :rules="rules" label-width="150px">
        <el-form-item label="账号:" prop="gaccount" required>
          <el-input v-model="addData.gaccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="pwd" required>
          <el-input v-model="addData.pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" prop="realName" required>
          <el-input v-model="addData.realName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false;resetForm('addData')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  import api from '../request/api';
  import withdrawals1 from "./withdrawals1";
  export default {
    name: "customers",
    components:{
      withdrawals1,
    },
    data: function () {
      let checkGaccount = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9]\w{5,15}$/;
        if (reg.test(value) == false) {
          callback(new Error('字母、数字组合，6-16位，区分大小写'));
        } else {
          callback()
        }
      };
      let checkPwd = (rule, value, callback) => {
        let reg = /^\w{6,16}$/;
        if (reg.test(value) == false) {
          callback(new Error('字母、数字、下划线组合，6-16位'));
        } else {
          callback()
        }
      };
      let checkName = (rule, value, callback) => {
        let reg = /[\u4e00-\u9fa5]{2,10}/;
        if (reg.test(value) == false) {
          callback(new Error('2位以上的中文'));
        } else {
          callback()
        }
      };
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
          gaccount: '',
          belongAgent:''
        },
        sentNickName:'',
        showCash:false,
        showSent:false,
        showAdd:false,
        addData: {
          gaccount: '',
          pwd: '',
          realName: ''
        },
        rules: {
          gaccount: [
            {validator: checkGaccount, trigger: 'change'},
            {required: true, message: '账号不能为空', trigger: 'change'},
          ],
          pwd: [
            {validator: checkPwd, trigger: 'change'},
            {required: true, message: '密码不能为空', trigger: 'change'},
          ],
          realName: [
            {validator: checkName, trigger: 'change'},
            {required: true, message: '密码不能为空', trigger: 'change'},
          ]
        },
        Data1:{
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        cusId:'',
      }
    },
    computed: {
      loginScale:function(){
        return this.$store.state.login.loginData.loginScale;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      loginName:function(){
        return this.$store.state.login.loginData.loginName;
      },
    },
    mounted: function () {
      "use strict";
       this.getData()
    },
    methods: {
      showSentFn(gaccount){
          this.sentNickName=gaccount;
          this.showSent= true;
      },
      submitAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addFn()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getData(val) {
        this.Data.pageApi = api.customersList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + "&" + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.customersList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + "&" + this.parseParam(this.searchInfo);
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
      getData1(val) {
        this.Data1.pageApi = api.consume+ this.cusId + '?page=' + (val ? val : this.Data1.pageCurrent) + '&limit=' + this.Data1.pagesize ;
        this.data1Handle();
      },
      getSize1(val) {

        this.Data1.pageApi = api.consume  + this.cusId+'?page=' + this.Data1.pageCurrent + '&limit=' + (val ? val : this.Data1.pagesize) ;
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
      addFn(){
        let _this = this;
        this.$ajax({
          url: api.addGaccount,
          method: 'post',
          data: _this.addData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
            _this.showAdd = false;
//            if (_this.isTest == true) {
//              var uid = [];
//              uid.push(response.data.data.uid);
//              _this.changeTest(uid)
//            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      showCashFn(id){
          this.cusId = id;
          this.showCash = true;
          this.getData1()
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

    }
  }
</script>

