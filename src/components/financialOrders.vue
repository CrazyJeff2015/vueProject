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
          <el-select v-model="searchInfo.status" placeholder="请选择" clearable>
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
            <el-switch
              v-model="switchValue"
              on-text="精确"
              off-text="模糊"
              @change="switchChange">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px" >
        <el-table-column prop="id" label="订单ID">
        </el-table-column>
        <el-table-column prop="apply_time" label="申请时间">
        </el-table-column>
        <el-table-column prop="uid" label="用户ID">
          <template scope="scope">
            <a href="#"  v-text="scope.row.uid" @click.prevent="showUserInfo(scope.row.uid,scope.row.ip,false,false,false,scope.row.location)"></a>
          </template>
        </el-table-column>
        <el-table-column prop="gaccount" label="用户账号">
        </el-table-column>
        <el-table-column prop="real_name" label="真实姓名">
        </el-table-column>
        <el-table-column prop="post_name" label="提交姓名">
        </el-table-column>
        <el-table-column prop="product_name" label="产品名称">
        </el-table-column>
        <el-table-column prop="address" label="详细收货地址">
      </el-table-column>
        <el-table-column prop="product_order" label="产品货号">
      </el-table-column>
        <el-table-column prop="product_order" label="产品货值">
          <template scope="scope">
            <span v-text="scope.row.product_value" :class="{'class-a':parseFloat(scope.row.product_value)>=1000, 'class-b':parseFloat(scope.row.product_value)>=5000}"></span>
          </template>
      </el-table-column>
        <el-table-column prop="fee" label="手续费">
        </el-table-column>
        <el-table-column prop="operate_time" label="操作时间">
        </el-table-column>
        <el-table-column prop="customerId" label="操作/状态">
          <template scope="scope">
               <span v-if="scope.row.status=='成功'">
                  成功<br>
                     <el-button v-if="permissions.backblack_goldblack" @click="noAllowId = scope.row.id,showNoAllow=true">撤销</el-button>
                </span>
            <span v-else v-text="scope.row.status">
                </span>
            <span v-if="scope.row.status=='待审批' && permissions.opration_goldblack">
                  <br>
               <el-button  @click="allow(scope.row.id)">批准</el-button>
               <el-button  @click="rejectId=scope.row.id,showReject=true">驳回</el-button>
                </span>
          </template>
        </el-table-column>
        <el-table-column prop="operate_ip" label="操作地址">
        </el-table-column>
        <el-table-column prop="location" label="区域">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>

      </el-table>
      <div>当前查询条件下，订单总计 <span style="color: red" v-text="currentTotal.order_count"></span> 条；货值总计 <span style="color: red" v-text="currentTotal.fee_count"></span> </div>
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
    <el-dialog title="用户信息" :visible.sync="showInfo" :show-close="false" size="large">
      <div v-if="showInfo">
        <userInfoList :uid="uid" :ip="ip" :isOn="isOn" :loginNum="loginNum" :noLogin="noLogin" :location="location"></userInfoList>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showInfo = false;">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单驳回" :visible.sync="showReject" :show-close="false" size="large">
        <div class="form-group">
          <label>
            快速操作
          </label>
          <div>
            <label>
              <input type="checkbox" value="姓名不符" v-model="rejectInfo.arr"> 姓名不符
            </label>
            <label>
              <input type="checkbox" value="恶性注册" v-model="rejectInfo.arr"> 恶性注册
            </label>
            <label>
              <input type="checkbox" value="非法用户" v-model="rejectInfo.arr"> 非法用户
            </label>
            <label>
              <input type="checkbox" value="重复提交" v-model="rejectInfo.arr"> 重复提交
            </label>
            <label>
              <input type="checkbox" value="账号异常" v-model="rejectInfo.arr"> 账号异常
            </label>
            <label>
              <input type="checkbox" value="黑名单" v-model="rejectInfo.arr"> 黑名单
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>
            驳回原因
          </label>
          <div>
                  <textarea rows="4" class="form-control resize_vertical" placeholder="勾选或填写本表单"
                            v-model="rejectInfo.txt"></textarea>
          </div>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showReject = false;">关 闭</el-button>
        <el-button type="primary" @click="reject()">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单撤销" :visible.sync="showNoAllow" :show-close="false" size="large">
      <div class="form-group">
        <label>
          撤销原因
        </label>
        <div>
                  <textarea rows="4" class="form-control resize_vertical" placeholder="填写本表单"
                            v-model="noAllowInfo"></textarea>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showNoAllow = false;">关 闭</el-button>
        <el-button type="primary" @click="noAllowFn()">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  import userInfoList from "./userInfoList";
  export default {
    name: "",
    components: {
      userInfoList
    },
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
        searchType:'gaccount',
        finTotal: {},
        currentTotal:{},
        searchInfo: {
          begin_at: '',
          end_at: '',
          status: '',
          preg:1,
          uid:'',
          gaccount:'',
          post_name:'',
          real_name:''
        },
        typeInfo:[{
          name:'提交姓名'
          ,id:'post_name'
        },
          {
            id:'real_name',
            name:'真实姓名'
          },
          {
            id:'gaccount',
            name:'用户账号'
          },
        ],
        productInfo: [{
          name:'待审批',
          id:'0'
        },
          {
            name:'待出货',
            id:'1'
          },
          {
            name:'已拒绝',
            id:'2'
          },
          {
            name:'成功',
            id:'3'
          },
          {
            name:'失败',
            id:'4'
          },
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
//      show:function () {
//        if(this.permissions.blackgold_black){
//          this.getData()
//        }
//      }
    },
    methods: {
      //用户详情
      showUserInfo: function (uid, ip, isOn, loginNum, noLogin, location) {
        //val 用户 uid
        this.uid = uid;
        this.ip = ip;
        this.isOn = isOn;
        this.loginNum = loginNum;
        this.noLogin = noLogin;
        this.location = location;
        this.showInfo = true;
      },
      //驳回原因
      reject: function () {
        var txt = '';
        for (var i = 0; i < this.rejectInfo.arr.length; i++) {
          txt += this.rejectInfo.arr[i] + ' ';
        }
        txt += this.rejectInfo.txt;
        var _this = this;
        this.$ajax({
          url: api.updateFinanceOrder1,
          method: "post",
          data: {
            id: _this.rejectId,
            status: 4,
            msg: txt
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.showReject = false;
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      noAllowFn:function () {
        var _this = this;
        this.$ajax({
          url:api.updateFinanceOrder,
          method:"post",
          data:{
            id:_this.noAllowId,
            status:2,
            msg:_this.noAllowInfo
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.showNoAllow = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //批准
      allow: function (value) {
        var _this = this;
        this.$ajax({
          url: api.updateFinanceOrder,
          method: "post",
          data: {
            id: value,
            status: 1
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      switchChange(){
        this.switchValue==true?this.searchInfo.preg=1:this.searchInfo.preg=0;
      },
      typeChange(value){
        this.searchInfo.post_name = '';
        this.searchInfo.real_name = '';
        this.searchInfo.gaccount = '';
        for(var k in this.searchInfo){
          if(k==value){
            this.searchInfo[k] = this.searchTxt;
          }
        }
      },
      getData(val) {
        this.searchInfo.post_name = '';
        this.searchInfo.real_name = '';
        this.searchInfo.gaccount = '';
        for(var k in this.searchInfo){
          if(k == this.searchTxt){
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.getFinOrders + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getFinOrders + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.finTotal = response.data.Statistics;
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


