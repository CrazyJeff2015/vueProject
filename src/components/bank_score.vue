<template>
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
        <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="myBankList" border style="width: 100%;" v-if="loginId!==1&&pId!==1">
      <el-table-column prop="id" label="ID">
        <template scope="scope">
          <span>当前状态:</span>
        </template>
      </el-table-column>
      <el-table-column prop="aname" label="代理号">
        <template scope="scope">
          <el-tooltip :content="'上级代理:'+scope.row.highAgent" placement="top" effect="light">
            <span>{{scope.row.aname}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="bank_score" label="代充余额">
      </el-table-column>
      <el-table-column prop="bank_score_limit" label="代充限额">
      </el-table-column>
      <el-table-column prop="score_change" label="今日变化">
      </el-table-column>
      <el-table-column prop="today_in" label="今日转入">
      </el-table-column>
      <el-table-column prop="today_out" label="今日转出">
      </el-table-column>
      <el-table-column prop="disableCount" label="操作">
        <template scope="scope">
        </template>
      </el-table-column>
    </el-table>
    <hr v-if="loginId!=1&&pId!=1">
    <el-table
      :data="Data.data" border :show-header="loginId==1||pId==1" style="width: 100%;">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="aname" label="代理号">
        <template scope="scope">
          <el-tooltip :content="'上级代理:'+scope.row.highAgent+'  状态:'+scope.row.is_operate" placement="top" effect="light">
            <span>{{scope.row.aname}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="bank_score" label="代充余额">
      </el-table-column>
      <el-table-column prop="bank_score_limit" label="信用额度">
        <template scope="scope">
          <a href="#" v-text="scope.row.bank_score_limit"
             @click.prevent="changeLimit(scope.row.id,scope.row.bank_score_limit)" v-if="permissions.edit_bank_score_limit"></a>
          <span v-else v-text="scope.row.bank_score_limit"></span>
        </template>
      </el-table-column>
      <el-table-column prop="score_change" label="今日变化">
      </el-table-column>
      <el-table-column prop="today_in" label="今日转入">
      </el-table-column>
      <el-table-column prop="today_out" label="今日转出">
      </el-table-column>
      <el-table-column prop="disableCount" label="操作">
        <template scope="scope">
          <el-button v-if="loginBankScore>0" @click="edit(scope.row)" size="small">编辑</el-button>
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
    <el-dialog title="编辑金币" :visible.sync="showEdit" :show-close="false">
      <el-form :model="bankData" :rules="rules" ref="bankData" label-width="150px">
        <el-form-item label="当前余额">
          <span v-text="editData.bank_score"></span>
        </el-form-item>
        <el-form-item label="代理号">
          <span v-text="editData.aname"></span>
        </el-form-item>
        <el-form-item label="修改金币" prop="change" required>
          <el-input v-model="bankData.change" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="bankData.note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('bankData')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('bankData')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="代充限额" :visible.sync="showLimit" :show-close="false">
      <el-table
        :data="limitData" border style="width: 100%;margin-bottom: 20px">
        <el-table-column prop="event" label="限额记录">
        </el-table-column>
        <el-table-column prop="created_at" label="时间">
        </el-table-column>
      </el-table>
      <el-form :model="changeData" ref="changeData" :rules="changeRule" label-width="150px">
        <el-form-item label="代理ID:" required>
          <span v-text="changeData.id"></span>
        </el-form-item>
        <el-form-item label="限额:" prop="bank_score_limit" required>
          <el-input v-model="changeData.bank_score_limit" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showLimit = false;resetForm('changeData')">取 消</el-button>
        <el-button type="primary" @click="submitChange('changeData')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
  import api from '../request/api';
  import ElButton from "../../node_modules/element-ui/packages/button/src/button";
  export default {
    components: {ElButton},
    name: "",
    data: function () {
      var checkScore = (rule, value, callback) => {
        var reg;
        this.loginId == 1 ? reg = /^[-+]?([1-9]\d*|0)(\.\d{1,2})?$/ : reg = /^[+]?([1-9]\d*|0)(\.\d{1,2})?$/;
        if (reg.test(value) == false) {
          callback(new Error('请输入数字，精确到小数点后2位'));
        } else {
          callback()
        }
      };
      var checkNum = (rule, value, callback) => {
        var reg = /^[0-9]+$/;
        if (reg.test(value) == false) {
          callback(new Error('只能输入正整数'));
        } else {
          callback()
        }
      };
      return {
        searchInfo: {
          aname: '',
          aid: ''
        },
        searchTxt: '',
        searchType: 'aname',
        typeInfo: [{
          name: '代理号'
          , id: 'aname'
        },
          {
            id: 'aid',
            name: '代理ID'
          }
        ],
        editI: '',
        editData: {},
        bankData: {
          change: '',
          note: ''
        },
        limitData: [],
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        showEdit: false,
        showLimit: false,
        myBankList: [],
        changeData: {
          id: '',
          bank_score_limit: 0
        },
        changeRule: {
          id: [
            {required: true, message: 'id不能为空', trigger: 'change'},
          ],
          bank_score_limit: [
            {required: true, message: '限额不能为空', trigger: 'blur'},
            {validator: checkNum, trigger: 'change'},
          ]
        },
        rules: {
          change: [
            {validator: checkScore, trigger: 'change'},
            {required: true, message: '金币不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    mounted: function () {
      this.getData();
      this.myBnakList();
    },
    computed: {
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      pId: function () {
        return this.$store.state.login.loginData.pid;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      loginBankScore:function () {
        return this.$store.state.login.loginData.loginBankScore;
      }
    },
    methods: {
      limitChange(){
        var _this = this;
        this.$ajax({
          url: api.changeLimit + _this.changeData.id,
          method: 'put',
          data: {
            bank_score_limit: _this.changeData.bank_score_limit
          }

        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.showLimit = false;
            _this.resetForm('changeData');
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
      myBnakList(){
        var _this = this;
        this.$ajax.get(api.operMyBankList).then(function (response) {
          _this.myBankList.push(response.data.data)
        })
      },
      submitChange(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.limitChange();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      changeLimit(id, limit){
        this.showLimit = true;
        this.changeData.id = id;
        this.changeData.bank_score_limit = limit;
        let _this = this;
        this.$ajax.get(api.limitLog + id)
          .then(function (response) {
            _this.limitData = response.data.data;
          })
      },
      changScore: function () {
        var _this = this;
        this.$ajax({
          url: api.editBankScore + this.editI,
          method: "put",
          data: _this.bankData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.refresh();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.showEdit = false;
            _this.getData();
            _this.resetForm('bankData')
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      refresh: function () {
        var _this = this;
        this.$ajax.get(api.updateUserInfo)
          .then(function (response) {
            _this.userData = response.data.data;
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
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changScore();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      edit(row){
        this.editData = row;
        this.editI = row.id;
        this.showEdit = true;
      },
      getData(val) {
        this.searchInfo.aid = '';
        this.searchInfo.aname = '';
        for (var k in this.searchInfo) {
          if (k == this.searchType) {
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.getBankMoneyList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getBankMoneyList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        ;
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

</style>


