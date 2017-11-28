<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchTxt" placeholder="查询内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchType" placeholder="查询类型" clearable>
            <el-option
              v-for="item in typeInfo"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
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
          <el-radio-group v-model="searchInfo.is_on">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">冻结</el-radio>
          </el-radio-group>
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
      </el-form>
      <div style="text-align: right">
        <el-button v-if="permissions.reset_user_score" @click="showZero = true">金币回收</el-button>
        <el-button v-if="permissions.freeze_reguser" @click="showUnFree = true">冻 结</el-button>
        <el-button v-if="permissions.thaw_reguser" @click="freeConc()">解 冻</el-button>
        <el-button v-if="permissions.give_reguser" @click="sentCon()">赠 送</el-button>
        <el-button v-if="permissions.creat_reguser" @click="showAdd=true">新增用户</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="Data.data"
        border
        tooltip-effect="dark"
        style="width: 100%; margin-top: 20px"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        @sort-change="sortHandle">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="用户ID">
          <template scope="scope">
            <span v-text="scope.row.uid" :class="{'red':scope.row.is_test=='测试'}"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户账号">
          <template scope="scope">
            <a href="#" v-text="scope.row.gaccount" @click.prevent="showUser(scope.row)"></a>
          </template>
        </el-table-column>
        <el-table-column
          label="真实姓名">
          <template scope="scope">
            <a href="#" v-text="scope.row.id_name" @click.prevent="showUser(scope.row)"></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="金币"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="score_bank"
          label="银行"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="all_score"
          label="总金币"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="注册IP">
        </el-table-column>
        <el-table-column
          prop="location"
          label="注册地">
        </el-table-column>
        <el-table-column
          prop="m_uuid"
          label="机器码">
        </el-table-column>
        <el-table-column
          prop="login_num"
          label="登陆次数">
        </el-table-column>
        <el-table-column
          prop="last_login_time"
          label="最后登录时间">
        </el-table-column>
        <el-table-column
          prop="is_on"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="getSize"
        @current-change="getData"
        :current-page="Data.pageCurrent"
        :page-sizes="[10]"
        :page-size="Data.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Data.totalCount">
      </el-pagination>
    </el-card>
    <el-dialog title="冻结用户" :visible.sync="showUnFree" :show-close="false">
      <el-form>
        <el-form-item label="冻结ID:">
          <span v-text="selectArr"></span>
        </el-form-item>
        <el-form-item label="冻结原因:">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="note">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUnFree = false;note=''">取 消</el-button>
        <el-button type="primary" @click="unfreeFn()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="赠送金币" :visible.sync="showSent" :show-close="false">
      <el-form>
        <el-form-item label="赠送金额:">
          <el-input v-model="sentData.score"></el-input>
        </el-form-item>
        <el-form-item label="赠送账户UID(多个用户请以半角逗号分隔',')：">
          <el-input v-model="uidTxt"></el-input>
        </el-form-item>
        <el-form-item label="赠送原因">
          <el-radio-group v-model="sentData.msg">
            <el-radio-button label="SYS_SEND">系统赠送</el-radio-button>
            <el-radio-button label="SYS_ADD">系统补偿</el-radio-button>
            <el-radio-button label="SYS_ADJUST">系统调整(系统调整只能是负数)</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSent = false;note=''">取 消</el-button>
        <el-button type="primary" @click="sentFn()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="金币回收" :visible.sync="showZero" :show-close="false">
      <el-form>
        <el-form-item label="回收ID:">
          <span v-text="selectArr"></span>
        </el-form-item>
        <el-form-item label="回收原因:">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="zeroData.note">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showZero = false;zeroData.note=''">取 消</el-button>
        <el-button type="primary" @click="zeroFn()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增用户" :visible.sync="showAdd" :show-close="false">
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
        <el-form-item label="提示:" v-if="isOper==4">
        <span>您当前为代运营测试状态，新增用户默认为测试用户。</span>
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
  export default {
    name: "registeredUsersList",
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
        timeValue: '',
        selectArr: [],
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo: {
          uid: '',
          gaccount: '',
          id_name: '',
          is_on: '',
          ip: '',
          last_ip: '',
          m_uuid: '',
          last_m_uuid: '',
          begin_at: '',
          end_at: '',
          type: 1
        },
        isTest: false,
        uidTxt: '',
        searchTxt: '',
        searchType: 'gaccount',
        switchValue: true,
        switchValue1: true,
        sentData: {
          score: '',
          gaccount: [],
          msg: 'SYS_SEND'
        },
        zeroData: {
          uid: [],
          note: ''
        },
        isOnType: [{
          name: '正常'
          , id: '1'
        },
          {
            name: '冻结'
            , id: '0'
          }],
        typeInfo: [{
          name: '用户ID'
          , id: 'uid'
        },
          {
            id: 'gaccount',
            name: '用户账号'
          },
          {
            id: 'id_name',
            name: '真实姓名'
          },
          {
            id: 'ip',
            name: '注册IP'
          },
          {
            id: 'last_ip',
            name: '登陆IP'
          },
          {
            id: 'm_uuid',
            name: '注册机器码'
          },
          {
            id: 'last_m_uuid',
            name: '登陆机器码'
          },
        ],
        test: {
          id: '',
          uid: []
        },
        note: '',
        showUnFree: false,
        showSent: false,
        showZero: false,
        showAdd: false,
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
        }
      }
    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      isOper: function () {
        return this.$store.state.login.loginData.isOperate;
      },
    },
    mounted: function () {
      if(window.location.hash.indexOf('?')>0){
        this.searchTxt = window.location.hash.substr(window.location.hash.indexOf('?')+1);
      }
      this.getData()
    },
    watch: {},
    methods: {
      sortHandle(value){
        this.searchInfo.score = '';
        this.searchInfo.score_bank = '';
        this.searchInfo.score_all = '';
        this.searchInfo.uid = '';
        this.searchInfo.id_name = '';
        this.searchInfo.gaccount = '';
        this.searchInfo.ip = '';
        this.searchInfo.last_ip = '';
        this.searchInfo.m_uuid = '';
        this.searchInfo.last_m_uuid = '';
        this.searchTxt = '';
        switch (value.prop) {
          case 'score':
            value.order == 'descending' ? this.searchInfo.score = 'desc' : this.searchInfo.score = 'asc';
            this.getData();
            break;
          case 'score_bank':
            value.order == 'descending' ? this.searchInfo.score_bank = 'desc' : this.searchInfo.score_bank = 'asc';
            this.getData();
            break;
          case 'all_score':
            value.order == 'descending' ? this.searchInfo.score_all = 'desc' : this.searchInfo.score_all = 'asc';
            this.getData();
            break;

        }

//        value.order == 'descending' ? this.searchInfo.scale = 'desc' : this.searchInfo.scale = 'asc';
//        this.getData();
      },
      change(){

        this.$confirm('是否将所选中用户转为测试用户？', '转为测试用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.changeTest()
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },
      changeTest(uid){
        let _this = this;
        let postId = [];
        _this.test.uid = _this.selectArr;
        if (uid) {
          postId = uid;
        } else {
          postId = _this.test.uid;
        }

        this.$ajax({
          url: api.addTestUser + _this.loginId,
          method: 'put',
          data: {
            uid: postId
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
          }
        }).catch(function (error) {
          console.log(error)
        })

      },
      showUser(data){
        this.$store.dispatch('getUserData', {
          'uid': data.uid,
          'ip': data.ip,
          'is_on': data.is_on,
          'login_num': data.login_num,
          'no_login_days': data.no_login_days,
          'location': data.location,
          'gaccount': data.gaccount
        });
        this.$router.push('/user/userMsg')
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
      addFn(){
        let _this = this;
        this.$ajax({
          url: api.fastAddAccount,
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
            //转测试
            if (_this.isOper == 4) {
              var uid = [];
              uid.push(response.data.data.uid);
              _this.changeTest(uid)
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      zeroFn(){
        this.zeroData.uid = this.selectArr;
        let _this = this;
        this.$ajax({
          url: api.zero,
          method: 'post',
          data: _this.zeroData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
            _this.zeroData.note = '';
            _this.showZero = false;
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      sentFn: function () {
        let arr = this.uidTxt.split(",");
        for(var i=0;i<arr.length;i++){
            if(arr[i]==''){
              arr.splice(i, 1);
              break;
            }
        }
        this.sentData.gaccount = arr;
        let _this = this;
        this.$ajax({
          url: api.sentScore,
          method: 'post',
          data: _this.sentData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
            _this.showSent = false;
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      sentCon(){
        this.showSent = true;
        this.uidTxt = '';
        for (let j = 0; j < this.selectArr.length; j++) {
          this.uidTxt += this.selectArr[j] + ','
        }
      },
      tableRowClassName(row) {
        if (row.is_on == '冻结') {
          return 'unFree';
        }
        return '';
      },
      freeConc(){
        this.$confirm('是否解冻所选中用户？', '解冻用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.free()
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },
      free(){
        let _this = this;
        this.$ajax({
          url: api.unfreezeGUser,
          method: "post",
          data: {
            uid: _this.selectArr,
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      unfreeFn() {
        let _this = this;
        this.$ajax({
          url: api.freezeGUser,
          method: "post",
          data: {
            uid: _this.selectArr,
            note: _this.note
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData();
            _this.showUnFree = false;
            _this.note = '';
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      handleSelectionChange(val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].uid)
        }
        this.selectArr = arr;
      },
      switchChange(){
        this.switchValue == true ? this.searchInfo.type = 1 : this.searchInfo.type = 0;
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
      getData(val) {
        this.searchInfo.uid = '';
        this.searchInfo.id_name = '';
        this.searchInfo.gaccount = '';
        this.searchInfo.ip = '';
        this.searchInfo.last_ip = '';
        this.searchInfo.m_uuid = '';
        this.searchInfo.last_m_uuid = '';
        if (this.searchTxt !== '') {
          for (let k in this.searchInfo) {
            if (k == this.searchType) {
              this.searchInfo[k] = this.searchTxt;
            }
          }
        }
        this.Data.pageApi = api.getRegisterList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getRegisterList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        let _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.Data.totalCount = Number(response.data.meta.total);
            _this.Data.pageCurrent = Number(response.data.meta.current_page);
            _this.Data.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      parseParam: function (param) {
        let paramStr = "";
        for (let k in param) {
          if (param[k] != "" || typeof(param[k]) == "number") {
            paramStr += '&' + k + '=' + param[k]
          }
        }
        return paramStr;

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    destroyed: function () {
    }
  }
</script>
<style scoped>
  .red {
    color: red;
  }
</style>
