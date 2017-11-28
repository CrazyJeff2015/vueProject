<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="代理号">
          <el-input v-model="searchInfo.aname" placeholder="请输入代理号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="Data.data" border style="width: 100%;" @sort-change="sortHandle" >
        <el-table-column prop="id"  label="代理ID">
        </el-table-column>
        <el-table-column prop="aname"  label="代理号">
          <template scope="scope">
            <a href="#" v-text="scope.row.aname" @click.prevent="showMsgFn(scope.row)"></a>
          </template>
        </el-table-column>
        <el-table-column prop="scale" sortable="custom"   label="佣金比例">
        </el-table-column>
        <el-table-column prop="sole_scale" sortable="custom"   label="占成比例">
        </el-table-column>
        <el-table-column prop="status"  label="状态">
          <template scope="scope">
            <span  :class="{'danger':scope.row.status=='异常'}" v-text="scope.row.status"></span>
            <el-button v-if="scope.row.status=='测试'&&permissions.operation_online" @click="upOper(scope.row.id)">上线</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="bank_score"  label="营销金币">
        </el-table-column>
        <el-table-column prop="bank_score_limit"  label="信用额度">
        </el-table-column>
        <el-table-column prop="last_login_time"  label="最后登录">
        </el-table-column>
        <el-table-column prop="last_login_ip"  label="登陆IP">
        </el-table-column>
        <el-table-column prop="login_location"  label="登陆地址">
        </el-table-column>
        <el-table-column prop="disableCount"  label="操作">
          <template scope="scope">
            <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link">
    选择<i class="el-icon-caret-bottom el-icon--right"></i>
  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="permissions.operation_edit" :command="'0#'+scope.row.id+'#'+scope.row.aname+'#'+scope.row.scale+'#'+scope.row.topAgent+'#'+scope.row.topScale">编辑</el-dropdown-item>
                <el-dropdown-item v-if="permissions.operation_work" :command="'2#'+scope.row.id+'#'+scope.row.note+'#'+scope.row.aname">工单</el-dropdown-item>
                <el-dropdown-item v-if="permissions.operation_game_count" :command="'3#'+scope.row.aname">游戏统计</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
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
    <el-dialog title="编辑代运营" :visible.sync="showEdit" :show-close="false">
      <el-form :model="editInfo" :rules="rules" ref="editInfo" label-width="150px">
        <el-form-item label="上级代理号" prop="topName" required>
          <el-input v-model="editInfo.topName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="上级佣金比例" prop="topScale" required>
          <el-input v-model="editInfo.topScale" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前代理号" prop="aname" required>
          <el-input v-model="editInfo.aname" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="佣金比例"  prop="scale" required>
          <el-input v-model="editInfo.scale" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editInfo')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改工单" :visible.sync="showNote" :show-close="false">
      <el-form :model="noteData"  ref="noteData" label-width="150px">
        <el-form-item label="代理号"  required>
          <el-input v-model="noteData.aname" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="工单内容"  required>
          <el-input  type="textarea" autosize v-model="noteData.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNote = false;">取 消</el-button>
        <el-button type="primary" @click="submitNote()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="代理信息" :visible.sync="showMsg" :show-close="false" size="large">
      <el-form  label-width="150px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="上级代理号:">
              <span v-text="msgData.topAgent"></span>
            </el-form-item>
            <el-form-item label="登陆账号:">
              <span v-text="msgData.agent_name"></span>
            </el-form-item>
            <el-form-item label="申请时间:">
              <span v-text="msgData.approve_time"></span>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="QQ号码:">
              <span v-text="msgData.qq"></span>
            </el-form-item>
            <el-form-item label="手机号码:">
              <span v-text="msgData.cell"></span>
            </el-form-item>
            <el-form-item label="邮箱:">
              <span v-text="msgData.email"></span>
            </el-form-item>
            <el-form-item label="姓名:">
              <span v-text="msgData.name"></span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMsg = false;">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "operationList",
    data: function () {
      var checkScale = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9]+$/;
        if (value === '') {
          callback(new Error('佣金比例不能为空'));
        } else if (reg.test(value) == false) {
          callback(new Error('请输入正确的佣金比例'));
        } else if (value < 0 || value > (this.editInfo.topScale-1)) {
          callback(new Error('请输入正确的佣金比例'));
        } else {
          callback()
        }
      };

      return {
        searchInfo: {
          aname: ''
        },
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        showEdit:false,
        editId:'',
        editInfo:{
          aname:'',
          scale:'',
          topName:'',
          topScale:'',
        },
        rules:{
          scale: [
            {validator: checkScale, trigger: 'change'}
          ]
        },
        noteData:{
            id:'',
          note:'',
          aname:'',
          agent_name:'',
          time:''
        },
        showNote:false,
        showMsg:false,
        msgData:{

        }

      }
    },
    computed:{
      permissions:function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {
      this.getData();
    },
    methods: {
      sortHandle(value){
        if (value.prop == 'scale') {
            this.searchInfo.sortSoleScale = '';
          value.order == 'descending' ? this.searchInfo.scale = 'desc' : this.searchInfo.scale = 'asc';
        } else if (value.prop == 'sole_scale') {
          this.searchInfo.scale = '';
          value.order == 'descending' ? this.searchInfo.sortSoleScale = 'desc' : this.searchInfo.sortSoleScale = 'asc';
        }
        this.getData();
      },
      showMsgFn(obj){
          this.msgData = obj;
         this.showMsg = true;
      },
      submitNote(){
        var _this = this;
        this.$ajax({
          url: api.editOperNote  + _this.noteData.id,
          method: 'put',
          data: {
            note: _this.noteData.note,
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.showNote = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })
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
      setScale: function () {
        var _this = this;
        this.$ajax({
          url: api.adminSetAgentScale + '/' + _this.editId,
          method: 'put',
          data: {
            scale: _this.editInfo.scale,
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

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      upOper(id){

          var _this =this;
        this.$confirm('将该代运营从测试状态改为上线状态，是否继续？', '代运营上线', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url: api.upOper+id,
            method: "PUT",
          }).then(function (response) {
             if(response.data.code ==200){
                 _this.getData();
               _this.$message({
                 type: 'success',
                 message: '操作成功!'
               });
             }
          }).catch(function (error) {

          })
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },

      handleCommand(command) {
        let arr = command.split("#");
        switch (arr[0]) {
          case '0':
            this.editId = arr[1];
            this.editInfo.aname = arr[2];
            this.editInfo.scale = arr[3];
            this.editInfo.topName = arr[4];
            this.editInfo.topScale = arr[5];
            this.showEdit = true;
            break;
          case '1':
            this.$confirm('是否取消该代理代运营资格?', '取消代运营', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.cancelOp(arr[1]);
            }).catch(() => {
              this.$notify.info({
                title: '提示',
                message: '操作已取消',
                offset: 50,
                duration: 800
              });
            });
            break;
          case '2':
              this.noteData.id = arr[1];
            this.noteData.note = arr[2];
            this.noteData.aname = arr[3];
            this.showNote = true;
              break;
          case '3':
            this.noteData.id = arr[1];
            var newUrl = '/user/gameStatistics?'+arr[1];
            this.$router.push(newUrl);
            break
        }
      },
      cancelOp(id){
        var _this = this;
        this.$ajax({
          url: api.cancelOp  + id,
          method: 'put'
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
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
      getData(val) {
        this.Data.pageApi = api.getOperationList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize+ this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getOperationList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize)+ this.parseParam(this.searchInfo);
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


      removeUser:function (id) {
        var _this = this;
        this.$ajax({
          url:api.cancelOp+id,
          method:"put",
        }).then(function (response) {
          if(response.data.code==200){
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

    }
  }
</script>
<style scoped>
  span.danger {
    color: red;
    font-weight: bold;
    font-size: 18px;
  }
</style>

