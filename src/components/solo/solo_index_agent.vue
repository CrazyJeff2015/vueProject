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
            align="left"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px" @sort-change="sortHandle" :row-class-name="rowClass">
        <el-table-column prop="id" width="80">
        </el-table-column>
        <el-table-column prop="aname" label="代理号">
          <template scope="scope">
            <el-tooltip :content="'上级代理:'+scope.row.highAgent" placement="top" effect="light">
              <span>{{scope.row.aname}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable="custom"  label="分成比例" prop="scale">
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间">
        </el-table-column>
        <el-table-column  prop="agent_num" label="推广代理数">
        </el-table-column>
        <el-table-column  prop="gaccount_num" label="推广玩家数">
          <template scope="scope">
            <a href="#" @click.prevent="getCustomers(scope.row.id,scope.row.agent_name)" v-text="scope.row.gaccount_num"></a>
          </template>
        </el-table-column>
        <el-table-column prop="beforeCashCount" label="上周用户金币变化">
        </el-table-column>
        <el-table-column prop="nowCashCount" label="本周用户金币变化">
        </el-table-column>
        <el-table-column prop="beforeCommission" label="上周独家收益变化">
        </el-table-column>
        <el-table-column prop="nowCommission" label="本周独家收益变化">
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
    <!-- 编辑窗口 -->
    <el-dialog title="修改佣金比例" :visible.sync="showEdit" :show-close="false">
      <el-form :model="editData" ref="editData" :rules="scaleRule" label-width="150px">
        <el-form-item label="上级代理号:">
          <span v-text="editData.highAgent"></span>
        </el-form-item>
        <el-form-item label="上级佣金比例:">
          <span v-text="editData.highScale"></span>%
        </el-form-item>
        <el-form-item label="代理号:">
          <span v-text="editData.aname"></span>
        </el-form-item>
        <el-form-item label="登陆账号:">
          <span v-text="editData.agent_name"></span>
        </el-form-item>
        <el-form-item label="佣金比例:" prop="scale" required>
          <el-input v-model="editData.scale" auto-complete="off" style="width: 50%"></el-input>
          %
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情窗口 -->
    <el-dialog title="查看代理信息" :visible.sync="showAgentMsg" :show-close="false">
      <el-form :model="editData" ref="editData" label-width="150px">
        <el-form-item label="上级代理:">
          <span v-text="editData.highAgent"></span>
        </el-form-item>
        <el-form-item label="QQ号码:">
          <span v-text="editData.qq"></span>
        </el-form-item>
        <el-form-item label="手机号码:">
          <span v-text="editData.cell"></span>
        </el-form-item>
        <el-form-item label="邮箱:">
          <span v-text="editData.email"></span>
        </el-form-item>
        <el-form-item label="姓名:">
          <span v-text="editData.name"></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showAgentMsg=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码窗口 -->
    <el-dialog title="设置代理密码" :visible.sync="showSetPwd" :show-close="false">
      <el-form :model="setPwd" ref="setPwd" :rules="setPwdRule" label-width="150px">
        <el-form-item label="代理号:">
          <span v-text="editData.aname"></span>
        </el-form-item>
        <el-form-item label="登陆账号:">
          <span v-text="editData.agent_name"></span>
        </el-form-item>
        <el-form-item label="登陆密码:" prop="pwd">
          <el-input v-model="setPwd.pwd" auto-complete="off" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="安全密码:" prop="pwd1">
          <el-input v-model="setPwd.pwd1" auto-complete="off" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSetPwd = false;resetForm('setPwd')">取 消</el-button>
        <el-button type="primary" @click="submitSetPwd('setPwd')">确 定</el-button>
      </div>
    </el-dialog>
    <!--重置密码-->
    <el-dialog title="重置代理密码" :visible.sync="showResetPwd" :show-close="false">
      <el-form label-width="150px">
        <el-form-item label="代理号:">
          <span v-text="editData.aname"></span>
        </el-form-item>
        <el-form-item label="登陆账号:">
          <span v-text="editData.agent_name"></span>
        </el-form-item>
        <el-form-item label="重置登陆密码:">
          <span>123456</span>
        </el-form-item>
        <el-form-item label="重置安全密码:" v-show="editData.perfect==1">
          <span>123456</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showResetPwd = false;">取 消</el-button>
        <el-button type="primary" @click="resetPsw()">确 定</el-button>
      </div>
    </el-dialog>
    <!--佣金操作-->
    <el-dialog title="代理佣金操作" :visible.sync="showMoneyCor" :show-close="false">
      <el-form :model="sentMoney" ref="sentMoney" :rules="moneyRule" label-width="150px">
        <el-form-item label="代理号:">
          <span v-text="editData.aname"></span>
        </el-form-item>
        <el-form-item label="登陆账号:">
          <span v-text="editData.agent_name"></span>
        </el-form-item>
        <el-form-item label="财务类型:">
          <el-select v-model="sentMoney.typeId" placeholder="财务类型">
            <el-option
              v-for="item in productInfo"
              :key="item.name"
              :label="item.name"
              :value="item.id" v-if="item.id>2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额:" prop="score" required>
          <el-input v-model="sentMoney.score" auto-complete="off" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMoneyCor = false;resetForm('sentMoney')">取 消</el-button>
        <el-button type="primary" @click="submitSentMoney('sentMoney')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="转代运营" :visible.sync="showOper" :show-close="false">
      <el-form :model="changeData" ref="changeData" :rules="changeRule" label-width="150px">
        <el-form-item label="代理ID:" required>
          <span v-text="changeData.id"></span>
        </el-form-item>
        <el-form-item label="备注:" prop="note"  required>
          <el-input  type="textarea" autosize v-model="changeData.note"  style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showOper = false;resetForm('changeData')">取 消</el-button>
        <el-button type="primary" @click="submitChange('changeData')">确 定</el-button>
      </div>
    </el-dialog>
    <div v-if="showCustom">
      <el-dialog title="查看会员" :visible.sync="showCustom" :show-close="false" size="large">
        <customer_msg :id="cusInfo.id" :agentName="cusInfo.agentName"></customer_msg>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="showCustom = false;">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import api from '../../request/api';
  import customer_msg from "../customer_msg";

  export default {
    name: "admin_index_agent",
    components: {
      customer_msg
    },
    data: function () {
      var checkScale = (rule, value, callback) => {
        var reg = /^[0-9]+$/;
        if (value === '') {
          callback(new Error('佣金比例不能为空'));
        } else if (reg.test(value) == false) {
          callback(new Error('请输入正确的佣金比例'));
        } else if (value < 0 || value > (this.$store.state.login.loginData.loginScale - 1)) {
          callback(new Error('请输入正确的佣金比例'));
        } else {
          callback()
        }
      };
      var checkPwd1 = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9]+$/;
        if (value == '') {
          callback();
        } else if (reg.test(value) == false) {
          callback(new Error('安全密码只能包含字母或数字'));
        } else {
          callback()
        }
      };
      var checkScore = (rule, value, callback) => {
        var reg = /^[-+]?([1-9]\d*|0)(\.\d{1,2})?$/;
        if (reg.test(value) == false) {
          callback(new Error('请输入数字，精确到小数点后2位'));
        } else {
          callback()
        }
      };
      return {
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
          {
            id:'scale',
            name:'佣金比例'
          }
        ],
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
        changeData:{
          id:'',
          note:''
        },
        changeRule:{
          id:[
            {required: true, message: 'id不能为空', trigger: 'change'},
          ],
          note:[
            {required: true, message: '备注不能为空', trigger: 'change'},
          ]
        },
        searchInfo: {
          begin_at: '',
          end_at: '',
          aname: '',
          scale: '',
          aid:'',
          sortScale: ''
        },
        productInfo: [],
        editData: [],
        showEdit: false,
        showSetPwd: false,
        showResetPwd: false,
        showAgentMsg: false,
        showMoneyCor: false,
        showCustom: false,
        showOper:false,
        scaleRule: {
          scale: [
            {validator: checkScale, trigger: 'change'}
          ]

        },
        setPwdRule: {
          pwd1: [
            {validator: checkPwd1, trigger: 'blur'},
            {min: 6, max: 12, message: '安全密码长度必须在6到12位之间', trigger: 'change'}
          ],
          pwd: [
            {min: 6, max: 16, message: '安全密码长度必须在6到16位之间', trigger: 'change'}
          ]
        },
        moneyRule: {
          score: [
            {validator: checkScore, trigger: 'change'},
            {required: true, message: '金额不能为空', trigger: 'change'},
          ]
        },
        setPwd: {
          pwd: '',
          pwd1: '',
        },
        sentMoney: {
          score: '',
          typeId: 3
        },
        cusInfo: {
          id: '',
          agentName: ''
        }
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
      this.getType();

    },

    methods: {
        getCustomers(id,agentName){
          this.cusInfo.id = id;
          this.cusInfo.agentName =agentName;
          this.showCustom = true;
        },
      rowClass(row){
        if(row.is_on==0){
          return 'unFree';
        }
      },
      switchChange(){
        this.switchValue==true?this.searchInfo.preg=1:this.searchInfo.preg=0;
      },
      sortHandle(value){
        value.order == 'descending' ? this.searchInfo.sortScale = 'desc' : this.searchInfo.sortScale = 'asc';
        this.getData();
      },
      handleCommand(command) {
        let arr = command.split("#");
        switch (arr[0]) {
          case '0':
            this.activeControl(arr[1], arr[2]);
            break;
          case '1':
            this.getAgentdata(arr[1]);
            this.showAgentMsg = true;
            break;
          case '2':
            this.getAgentdata(arr[1]);
            this.showEdit = true;
            break;
          case '3':
            this.getAgentdata(arr[1]);
            this.showSetPwd = true;
            break;
          case '4':
            this.getAgentdata(arr[1]);
            this.showResetPwd = true;
            break;
          case '5':
            this.getAgentdata(arr[1]);
            this.showMoneyCor = true;
            break;
          case '6':
            this.cusInfo.id = arr[1];
            this.cusInfo.agentName = arr[2];
            this.showCustom = true;
            break;
          case '7':
            this.$confirm('是否将该代理号转为代运营？', '转代运营', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log("111")
            }).catch(() => {
              this.$notify.info({
                title: '提示',
                message: '操作已取消',
                offset: 50,
                duration: 800
              });
            });
            break;
        }
      },
      changeOper(id){
        this.$confirm('是否将该代理号转为代运营？', '转代运营', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showOper = true;
          this.changeData.id = id;
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },
      getData(val) {
        this.searchInfo.aid = '';
        this.searchInfo.aname = '';
        this.searchInfo.scale = '';
        for(var k in this.searchInfo){
          if(k==this.searchType){
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.solo_index_agent + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize  + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.solo_index_agent + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize)  + this.parseParam(this.searchInfo);
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
        return paramStr;

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitChange(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setOper();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setOper(){
        var _this = this;
        this.$ajax({
          url: api.setOperate+_this.changeData.id,
          method: 'put',
          data:{
            note:_this.changeData.note
          }

        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.showOper = false;
            _this.$message({
              type: 'success',
              message: '操作成功!24小时内生效。'
            });
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      submitEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setScale();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitSentMoney(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.moneySent();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitSetPwd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setPsw();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //佣金操作
      moneySent: function () {
        if (!this.checkMoney) {
          var _this = this;
          this.$ajax({
            url: api.sentMoney + _this.editData.id,
            method: 'put',
            data: _this.sentMoney
          }).then(function (response) {
            if (response.data.code == 200) {
              _this.getInfo();
              _this.getData();
              _this.showMoneyCor = false;
              _this.$message({
                type: 'success',
                message: '操作成功!'
              });
            }
          })
        } else {
          return false;
        }

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

      //状态过滤器
      agentStatus: function (value) {
        if (value == 1) {
          return '冻结';
        } else {
          return '激活';
        }
      },

      //获取编辑代理信息
      getAgentdata: function (id) {
        //获取编辑的域名信息
        var _this = this;
        for (var i in _this.adminAgent) {
          if (id == _this.adminAgent[i].id) {
            _this.editData = _this.adminAgent[i];
          }
        }


      },
      //激活冻结
      activeControl: function (_id, _status) {
        //激活或冻结
        _status == 0 ? _status = 1 : _status = 0;
        var _this = this;
        this.$ajax({
          url: api.adminSetAgentStatus + '/' + _id,
          method: 'put',
          data: {
            is_on: _status
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
          }
          console.log(response)
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      //设置密码
      setPsw: function () {
        var _this = this;
        this.$ajax({
          url: api.adminUpdateAgentSafe + '/' + _this.editData.id,
          method: 'put',
          data: _this.setPwd
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showSetPwd = false;
            _this.resetForm('setPwd');
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })
          .catch(function (error) {
          });
      },
      showCustomerFn: function (id, name) {
        this.$store.dispatch('agentInfo', {'agentId': id, 'agentName': name});
        this.$store.dispatch('showFlag', {'showAgent': false, 'showCustomer': true});
      },


//      重置密码
      resetPsw: function () {
        var _this = this;
        this.$ajax({
          url: api.agentUpdateSafe + '/' + _this.editData.id,
          method: 'put',
          data: {
            prefect: _this.editData.perfect
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showResetPwd = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })
          .catch(function (error) {

          });

      },
      //设置scale
      setScale: function () {
        var _this = this;
        this.$ajax({
          url: api.adminSetAgentScale + '/' + _this.editData.id,
          method: 'put',
          data: {
            scale: _this.editData.scale,
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.showEdit = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })
          .catch(function (error) {
            console.log(error);
          });


      },

      destroyed: function () {

      }
    }
  }
</script>


