<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        当前在线总人数：<span v-text="Data.totalNum" style="color: red"></span> 人
      </div>
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
          <el-switch
            v-model="switchValue"
            on-text="精确"
            off-text="模糊"
            @change="switchChange">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchInfo.agent_id" placeholder="选择代运营" @change="changeOper" clearable>
            <el-option
              v-for="item in operList"
              :key="item.aname"
              :label="item.aname"
              :value="item.aid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchInfo.rid" placeholder="全部游戏房间" clearable>
            <el-option
              v-for="item in Data.roomList"
              :key="item.id"
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
        :data="Data.data"
        border
        tooltip-effect="dark"
        style="width: 100%; margin-top: 20px"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="uid"
          label="用户ID">
        </el-table-column>
        <el-table-column
          label="用户账号">
          <template scope="scope">
            <a href="#" v-text="scope.row.gaccount" @click.prevent="showUser(scope.row)"></a>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名">
          <template scope="scope">
            <a href="#" v-text="scope.row.id_name" @click.prevent="showUser(scope.row)"></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="room"
          label="房间">
        </el-table-column>
        <el-table-column
          prop="win_lose"
          label="当前输赢">
        </el-table-column>
        <el-table-column
          prop="carry_score"
          label="携带金币">
        </el-table-column>
        <el-table-column
          prop="score_bank"
          label="银行金币">
        </el-table-column>
        <el-table-column
          prop="online_time"
          label="在线时长">
        </el-table-column>
        <el-table-column
          prop="login_ip"
          label="登陆IP">
        </el-table-column>
        <el-table-column
          prop="register_location"
          label="登陆地区">
        </el-table-column>
        <el-table-column
          prop="ai_value"
          label="系数金币">
        </el-table-column>
        <el-table-column
          prop="ai_speed"
          label="系数速率">
        </el-table-column>
        <el-table-column
          label="修改系数">
          <template scope="scope">
            <el-button v-if="permissions.coefficient_onlineuser" type="primary" :plain="true" icon="edit"
                       @click="editData.uid=scope.row.uid;editData.ai_value=scope.row.ai_value;editData.ai_speed=scope.row.ai_speed;showEdit=true"
                       size="small"></el-button>
          </template>
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
    <el-dialog title="系数修改" :visible.sync="showEdit" :show-close="false">
      <el-form>
        <el-form-item label="用户ID:">
          <span v-text="editData.uid"></span>
        </el-form-item>
        <el-form-item label="系数金币:">
          <el-input v-model="editData.ai_value"></el-input>
        </el-form-item>
        <el-form-item label="系数速率:">
          <el-input v-model="editData.ai_speed"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;">取 消</el-button>
        <el-button type="primary" @click="aiChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "",
    data: function () {
      return {
        Data: {
          data: [],
          roomList: [],
          totalNum: '0',
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo: {
          uid: '',
          gaccount: '',
          id_name: '',
          rid: '',
          type: 1,
          agent_id: ''
        },
        uidTxt: '',
        searchTxt: '',
        searchType: 'gaccount',
        switchValue: true,

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
          }
        ],
        editData: {
          uid: '',
          ai_value: '',
          ai_speed: ''
        },
        showEdit: false,
        operList: []
      }
    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {
      this.getData();
      this.getOperList();
    },
    watch: {},
    methods: {
      changeOper(){
        this.getData();
      },
      getOperList(){
        let _this = this;
        this.$ajax.get(api.operList).then(function (response) {
          _this.operList = response.data.data;
        })
      },
      aiChange: function () {
        var _this = this;
        this.$ajax({
          url: api.numChange,
          data: _this.editData,
          method: "post"
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showEdit = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData()
          }
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

      tableRowClassName(row) {
        if (row.is_on == '冻结') {
          return 'unFree';
        }
        return '';
      },


      switchChange(){
        this.switchValue == true ? this.searchInfo.type = 1 : this.searchInfo.type = 0;
      },

      getData(val) {
        this.searchInfo.uid = '';
        this.searchInfo.id_name = '';
        this.searchInfo.gaccount = '';
        for (let k in this.searchInfo) {
          if (k == this.searchType) {
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.getOnlineUserList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getOnlineUserList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        let _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data.user_list || [];
            _this.Data.roomList = response.data.data.room_list;
            _this.Data.totalNum = response.data.data.total_online || 0;
            _this.Data.totalCount = (response.data.meta === undefined ? 0 : Number(response.data.meta.total));
            _this.Data.pageCurrent = (response.data.meta === undefined ? 1 : Number(response.data.meta.current_page));
            _this.Data.pagesize = response.data.meta === undefined ? 10 : Number(response.data.meta.per_page);
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
