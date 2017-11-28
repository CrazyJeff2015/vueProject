<template>
  <div>
    <el-card class="box-card">
      <el-table
        :data="countData" border style="width: 100%;">
        <el-table-column prop="adminCount" label="当前管理员总数">
        </el-table-column>
        <el-table-column prop="roleCount" label="当前角色数">
        </el-table-column>
        <el-table-column prop="disableCount" label="禁用子账号">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <el-button @click="showAdd = true" style="margin-bottom: 20px" v-if="permissions.view_userbackregist">新增管理员
      </el-button>
      <el-table
        :data="Data.data" border style="width: 100%;">
        <el-table-column prop="login_name" label="登录名">
        </el-table-column>
        <el-table-column label="角色">
          <template scope="scope">
            <span v-text="idFilter(scope.row.role)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录时间">
        </el-table-column>
        <el-table-column prop="last_login_ip" label="最后登录IP">
        </el-table-column>
        <el-table-column prop="last_login_address" label="登录地址">
        </el-table-column>
        <el-table-column prop="login_num" label="登录次数">
        </el-table-column>
        <el-table-column prop="is_on" label="状态">
          <template scope="scope">
            <span v-text="scope.row.is_on=='1'?'正常':'禁用'"></span>
          </template>
        </el-table-column>
        <el-table-column prop="disableCount" label="操作">
          <template scope="scope">
            <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link">
    选择<i class="el-icon-caret-bottom el-icon--right"></i>
  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'0#'+scope.row.id+'#'+scope.row.is_on">
                  <span v-text="agentStatus(scope.row.is_on)"></span>
                </el-dropdown-item>
                <el-dropdown-item :command="'1#'+scope.row.id+'#'+scope.row.role+'#'+scope.row.role_type">更改角色
                </el-dropdown-item>
                <el-dropdown-item :command="'2#'+scope.row.id">重置密码</el-dropdown-item>
                <el-dropdown-item :command="'3#'+scope.row.id">删除</el-dropdown-item>
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
    <el-dialog title="新增管理员" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addInfo" :rules="rules" ref="addInfo" label-width="100px">
        <el-form-item label="登录名" prop="login_name" required>
          <el-input v-model="addInfo.login_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input v-model="addInfo.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id" required>
          <el-checkbox-group v-model="addInfo.role_id">
            <el-checkbox-button v-for="item in roleList" :label="item.id" :key="item.id">{{item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false;resetForm('addInfo')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="showRole" :show-close="false">
      <table class="table table-bordered table-striped">
        <thead>
        <tr>
          <th></th>
          <th>选择</th>
          <th>角色名</th>
          <th>角色别名</th>
          <th>角色描述</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in roleList" v-if="item.type==roleType">
          <td v-text="index+1"></td>
          <td><input type="checkbox" :value="item.id" v-model="userInfo.role_id"></td>
          <td v-text="item.name"></td>
          <td v-text="item.display_name"></td>
          <td v-text="item.description"></td>
        </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRole = false;">取 消</el-button>
        <el-button type="primary" @click="userBindRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "usersList",
    data: function () {
      var validateName = (rule, value, callback) => {
        var reg = /[a-zA-Z][a-zA-Z0-9]{2,10}/;
        if (reg.test(value) == false) {
          callback(new Error('必须以字母开头，3-10位字母或数字的组合'));
        } else {
          callback();
        }
      };
      var validatePwd = (rule, value, callback) => {
        var reg = /[a-zA-Z0-9]{6,16}/;
        if (reg.test(value) == false) {
          callback(new Error('请输入6-16位字母或数字的组合'));
        } else {
          callback();
        }
      };
      return {
        switchValue: false,
        countData: [],
        roleList: [],
        usersList: [],
        userInfo: {
          user_id: '',
          role_id: []
        },
        searchInfo: {
          myself: 1
        },
        showRole: false,
        showActive: false,
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        rules: {
          login_name: [
            {validator: validateName, trigger: 'change'},
            {required: true, message: '登录名不能为空', trigger: 'change'},
          ],
          password: [
            {validator: validatePwd, trigger: 'change'},
            {required: true, message: '密码不能为空', trigger: 'change'},
          ],
          role_id: [
            {type: 'array', required: true, message: '至少选择一个角色', trigger: 'change'},
          ],

        },
        showAdd: false,
        addInfo: {
          login_name: '',
          password: '',
          role_id: []
        },
        activeData: {
          aid: '',
          status: ''
        },
        userRole: {
          user_id: '',
          role_id: []
        },
        roleType: 0
      }
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {
      this.getRoleList();
      this.getCountList();
      this.getData();
    },
    methods: {
      switchChange(){
        this.switchValue == true ? this.searchInfo.myself = 1 : this.searchInfo.myself = 0;
        this.getData();
      },

      submitAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setUser();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      setUser: function () {
        var _this = this;
        this.$ajax({
          url: api.userRegister,
          method: "post",
          data: {
            agent_name: _this.addInfo.login_name,
            password: _this.addInfo.password,
          }
        }).then(function (response) {
          _this.userRole.user_id = response.data.data;
          _this.userRole.role_id = _this.addInfo.role_id;
          _this.userBanRole();
        }).catch(function (error) {
          console.log(error)
        })
      },
      //用户绑定角色
      userBanRole: function () {
        var _this = this;
        this.$ajax({
          url: api.userBindRole,
          method: "post",
          data: _this.userRole
        }).then(function (response) {
          _this.$message({
            type: 'success',
            message: '操作成功!'
          });
          _this.showAdd = false;
          _this.getData()
        }).catch(function (error) {
          console.log(error)
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //激活冻结
      activeConfrim(_id, _status){
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
            _this.getData();
            _this.getCountList();
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
      activeControl: function (_id, _status) {
        //激活或冻结
        let txt = '是否' + (_status == '1' ? '禁用' : '启用') + '该管理员？';
        this.$confirm(txt, '更改管理员状态', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.activeConfrim(_id, _status);
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });

      },
      //状态过滤器
      agentStatus: function (value) {
        if (value == 1) {
          return '禁用';
        } else {
          return '启用';
        }
      },
      handleCommand(command) {
        let arr = command.split("#");
        switch (arr[0]) {
          case '0':
            this.activeControl(arr[1], arr[2]);
            break;
          case '1':
            this.userInfo.user_id = arr[1];
            if (arr[2] == '') {
              var roleId = []
            } else {
              var roleId = arr[2].split(',')
            }
            this.userInfo.role_id = roleId;
            if (arr[3][0] == 0) {
              this.roleType = 0
            } else {
              this.roleType = 1
            }
            this.showRole = true;
            break;
          case '2':
            this.$confirm('是否重置该管理员密码为123456', '重置密码', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.resetPwd(arr[1]);
            }).catch(() => {
              this.$notify.info({
                title: '提示',
                message: '操作已取消',
                offset: 50,
                duration: 800
              });
            });
            break;
          case '3':
            this.$confirm('是否该删除管理员', '删除管理员', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.removeUser(arr[1]);
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
      getData(val) {
        this.Data.pageApi = api.getUsersList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getUsersList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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
      //角色列表
      getRoleList: function () {
        var _this = this;
        this.$ajax.get(api.roleList)
          .then(function (response) {
            _this.roleList = response.data.data;
          }).catch(function (error) {
          console.log(error)
        })
      },
      //概况
      getCountList: function () {
        var _this = this;
        this.$ajax.get(api.userSurvey)
          .then(function (response) {
            _this.countData = [];
            _this.countData.push(response.data);
          }).catch(function (error) {
          console.log(error)
        })
      },

      //重置密码
      resetPwd: function (id) {
        var _this = this;
        this.$ajax({
          url: api.resetUserPwd,
          method: "post",
          data: {
            id: id
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      removeUser: function (id) {
        var _this = this;
        this.$ajax({
          url: api.delUser,
          method: "post",
          data: {
            id: id
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getData()
          }
        }).catch(function (error) {
          console.log(error)
        })
      },

      //角色绑定权限
      userBindRole: function () {
        var _this = this;
        this.$ajax({
          url: api.userBindRole,
          method: "post",
          data: _this.userInfo
        }).then(function (response) {
          if (response.status == 200) {
            _this.getData();
            _this.showRole = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //role
      idFilter: function (value) {
        var txt = '';
        for (var i = 0; i < this.roleList.length; i++) {
          for (var t = 0; t < value.length; t++) {
            if (this.roleList[i].id == value[t]) {
              txt = txt + ' ' + this.roleList[i].name;
            }
          }
        }
        return txt;
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


