<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="所属代理">
          <el-input v-model="searchInfo.belongAgent" placeholder="请输入代理号"></el-input>
        </el-form-item>
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
        <el-table-column prop="agent_aname" label="所属代理">
        </el-table-column>
        <el-table-column prop="customerId" label="会员ID">
          <template scope="scope">
            <a href="#" @click.prevent="jumpRegister(scope.row.gaccount)" v-text="scope.row.customerId" v-if="permissions.retrieve_reguser" ></a>
            <span v-else v-text="scope.row.customerId"></span>
          </template>
        </el-table-column>
        <el-table-column prop="gaccount" label="会员账号">
          <template scope="scope">
            <a href="#" @click.prevent="jumpRegister(scope.row.gaccount)" v-text="scope.row.gaccount" v-if="permissions.retrieve_reguser" ></a>
            <span v-else v-text="scope.row.gaccount"></span>
          </template>
        </el-table-column>
        <el-table-column  prop="created_at" label="注册时间">
        </el-table-column>
        <el-table-column prop="tax_score" label="抽佣金额">
        </el-table-column>
        <el-table-column prop="is_on" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" v-if="permissions.donation_amount" @click="showSentFn(scope.row.gaccount)">赠送佣金</el-button>
            <el-button size="mini" v-if="permissions.view_customer_consume" @click="showCashFn(scope.row.customerId)">游戏记录</el-button>
            <el-button size="mini" v-if="permissions.view_payorder" @click="getWith(scope.row.customerId)">充值记录</el-button>
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
    <el-dialog title="代理提款" :visible.sync="showSent" :show-close="false">
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
        <el-table-column prop="agent" label="所属代理">
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

    <el-dialog title="充值记录" size="large" :visible.sync="showWith" :show-close="false">
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
        <el-table-column prop="order_num" label="订单号">
        </el-table-column>
        <el-table-column prop="order_amount" label="金额">
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
      <div style="text-align: right">
        <el-button @click="showWith = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增玩家" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addData" ref="addData" :rules="rules" label-width="150px">
        <el-form-item label="指定代理号:" prop="aname">
          <el-input v-model="addData.aname" auto-complete="off"></el-input>
        </el-form-item>
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
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        timeValue3:'',
        searchInfo: {
          begin_at: '',
          end_at: '',
          gaccount: '',
          belongAgent:''
        },
        sentNickName:'',
        showCash:false,
        showSent:false,
        showWith:false,
        uid:'',
        Data1:{
          data: [],
          totalCount: 20,
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
        Data3:{
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
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
        cusId:'',
        showAdd:false,
        addData: {
          gaccount: '',
          pwd: '',
          realName: '',
          aname:''
        },
      }
    },
    computed: {
      loginScale:function(){
        return this.$store.state.login.loginData.loginScale;
      },
      loginName:function(){
        return this.$store.state.login.loginData.loginName;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {
      "use strict";
      this.getData()
    },
    methods: {
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
            _this.resetForm('addData')

          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      submitAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addFn()
          } else {
            console.log('error submit!!');
            return false;
          }
          data=[
            {one:'一级菜单名称',two:'二级菜单名称',three:'三级菜单名称'},
            {one:'一级菜单名称',two:'二级菜单名称',three:'三级菜单名称'},
            {one:'一级菜单名称',two:'二级菜单名称',three:'三级菜单名称'},
            {one:'一级菜单名称',two:'二级菜单名称',three:'三级菜单名称'}
          ]
        });
      },
      jumpRegister(id){
        var newUrl = '/user/registeredUsersList?'+id;
        this.$router.push(newUrl);
      },
      getWith(id){
          this.uid = id;
          this.showWith = true;
          this.getData3();
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
        } else {
          let timeS = this.timeValue3[1].getTime() - this.timeValue3[0].getTime();
//          if (timeS > 3600 * 1000 * 24 * 3) {
//            this.$notify.error({
//              title: '错误',
//              message: '查询时间间隔应小于7天',
//              offset: 100
//            });
//            this.searchInfo3.begin_at = '';
//            this.searchInfo3.end_at = '';
//            this.timeValue3 = '';
//          } else {
            this.searchInfo3.begin_at = this.dataFormat(this.timeValue3[0], "yyyy-MM-dd hh:mm:ss");
            this.searchInfo3.end_at = this.dataFormat(this.timeValue3[1], "yyyy-MM-dd hh:mm:ss");

        }
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
      showSentFn(gaccount){
        this.sentNickName=gaccount;
        this.showSent= true;
      },
      getData(val) {
        this.Data.pageApi = api.sAdminCusList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + "&" + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.sAdminCusList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + "&" + this.parseParam(this.searchInfo);
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

