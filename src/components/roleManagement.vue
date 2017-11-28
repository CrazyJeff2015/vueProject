<template>
  <div>
    <el-card class="box-card">
      <el-select placeholder="类型" v-model="type" clearable @change="changeType">
        <el-option
          v-for="item in typeInfo"
          :key="item.name"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button v-if="permissions.creat_role" @click="showAdd = true" style="margin-bottom: 20px">新增角色</el-button>
      <el-table
        :data="roleList" border style="width: 100%;">
        <el-table-column prop="name" label="角色名">
        </el-table-column>
        <el-table-column prop="display_name" label="角色别名">
        </el-table-column>
        <el-table-column prop="description" label="角色描述">
        </el-table-column>
        <el-table-column prop="disableCount" label="操作">
          <template scope="scope">
            <el-button v-if="permissions.edit_roleintroduce" size="small"
                       @click="editFn(scope.row.id,scope.row.name,scope.row.display_name,scope.row.description)">编辑
            </el-button>
            <el-button v-if="permissions.edit_rolejurisdiction" size="small"
                       @click="changeRoleFn(scope.row.id,scope.row.name,scope.row.permissions)">权限
            </el-button>
            <el-button v-if="permissions.del_rolejurisdiction" size="small" @click="removeFn(scope.row.id)">删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="新增角色" :visible.sync="showAdd" :show-close="false">
      <el-form :model="createRole" :rules="rules" ref="createRole" label-width="100px">
        <el-form-item label="角色名" prop="agent_name" required>
          <el-input v-model="createRole.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-show="showTypeChange">
          <span>完整角色名:代运营-</span><span v-text="createRole.name"></span>
        </el-form-item>
        <el-form-item label="角色别名" prop="password">
          <el-input v-model="createRole.display_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_id">
          <el-input v-model="createRole.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="createRole.type" @change="typeChange">
            <el-radio-button label="0">普通</el-radio-button>
            <el-radio-button label="1">代运营</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false;resetForm('createRole')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('createRole')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="showEdit" :show-close="false">
      <el-form :model="editRoleInfo" :rules="rules" ref="editRoleInfo" label-width="100px">
        <el-form-item label="角色名" prop="name" required>
          <el-input v-model="editRoleInfo.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色别名" prop="display_name">
          <el-input v-model="editRoleInfo.display_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editRoleInfo.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editRoleInfo')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editRoleInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改权限" size="full" :visible.sync="showChangePer" :show-close="false">
      <div class="panel-heading">
        <h3 class="panel-title">角色名称：
          <span v-text="bindRoleName"></span>
        </h3>
      </div>
      <el-table
        :data="permissionsList"
        stripe
        border
        style="width: 100%"
        :show-header="false">
        <el-table-column
          prop="name"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column class-name="perList">
          <template scope="scope">
            <el-checkbox-group v-model="selectArr">
              <el-checkbox v-for="item in scope.row.list" :label="item.id" :key="item.id">{{item.display_name}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangePer = false;">取 消</el-button>
        <el-button type="primary" @click="roleBindPermission()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "roleManagement",
    data: function () {
      return {
        createRole: {
          name: "",
          display_name: '',
          description: '',
          type: 0
        },
        roleList: [],
        myRole:[],
        operRole:[],
        allRole:[],
        deleteRole: '',
        editRoleId: '',
        editRoleInfo: {
          name: '',
          display_name: '',
          description: '',
          type: 0
        },
        rules: {
          name: [
            {required: true, message: '角色名不能为空', trigger: 'change'},
          ]
        },

        typeInfo: [
          {
            id: '0',
            name: '所有'
          },
          {
            id: '1',
            name: '管理员'
          },
          {
            id: '2',
            name: '代运营'
          }
        ],
        showTypeChange: false,
        permissionsList: [],
        pmtLength: 0,
        showPermission: false,
        selectCount: 0,
        allSeclect: false,
        seclected: false,
        selectArr: [],
        bindRoleName: '',
        bindRoleId: '',
        showEdit: false,
        showChangePer: false,
        showAdd: false,
        switchValue: true,
        type:''
      }
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {
      this.getRoleList();
      this.getPermissionsList();
//      this.getP()
    },
    methods: {
      changeType(v){
          if(v==0){
              this.roleList = this.allRole;
          }else if(v==1){
            this.roleList = this.operRole;

          }else{
            this.roleList = this.myRole;

          }
      },
      getP(){
        this.$ajax.get(api.getPermissionsList).then(function (response) {
          var arr = response.data.data;
          var txt = '';
          for (var i = 0; i < arr.length; i++) {
            txt = txt + 'state.permissionsData.' + arr[i].name + '= permissionsData.' + arr[i].name + ';'
          }
//
//            for(var i=0;i<arr.length;i++){
//              txt += arr[i].name+':false,';
//            }
          console.log(txt)
        })
      },
      switchChange(){
        this.switchValue == true ? this.createRole.type = 0 : this.createRole.type = 1;
      },
      typeChange(type){
        if (type == 1) {
          this.showTypeChange = true;
        } else {
          this.showTypeChange = false;
        }
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editRoleFn();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createRoleFn();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editFn(id, name, displayName, description){
        this.editRoleId = id;
        this.editRoleInfo.name = name;
        this.editRoleInfo.display_name = displayName;
        this.editRoleInfo.description = description;
        this.showEdit = true;
      },
      changeRoleFn(id, name, permissions){
        this.bindRoleName = name;
        this.bindRoleId = id;
        this.showChangePer = true;
        this.selectArr = permissions;
      },
      removeFn(id){
        this.deleteRole = id;
        this.$confirm('删除该角色之后，此角色的用户权限全部失效，是否继续？', '删除角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSelect();
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },
      //创建角色
      createRoleFn: function () {
        var _this = this;
        if (this.createRole.type == 1) {
          this.createRole.name = '代运营-' + this.createRole.name;
        }
        this.$ajax({
          url: api.createRole,
          data: _this.createRole,
          method: "post"
        }).then(function (response) {

          if (response.status == 200) {
            _this.getRoleList();
            _this.$message({
              type: 'success',
              message: '操作成功!请通过[角色列表]->操作->权限 为角色绑定所属权限'
            });
            _this.showAdd = false;
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //角色列表
      getRoleList: function () {
        var _this = this;
        this.$ajax.get(api.roleList)
          .then(function (response) {
            _this.allRole = response.data.data;
            _this.roleList = _this.allRole;
            _this.operRole=[];
            _this.myRole=[];

            var arr = response.data.data;
            for(var i=0;i<arr.length;i++){
                if(arr[i].name.indexOf('代运营')){
                    _this.operRole.push(arr[i]);
                }else{
                    _this.myRole.push(arr[i])
                }
            }
            _this.type='';

          }).catch(function (error) {
          console.log(error)
        })
      },
      //删除角色
      deleteSelect: function () {
        var _this = this;
        this.$ajax.delete(api.deleteRole + _this.deleteRole)
          .then(function (response) {
            if (response.status == 200) {
              _this.$message({
                type: 'success',
                message: '操作成功!'
              });
              _this.getRoleList();
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      //编辑角色
      editRoleFn: function () {
        var _this = this;
        this.$ajax({
          url: api.editRole + _this.editRoleId,
          data: _this.editRoleInfo,
          method: "put"
        }).then(function (response) {

          if (response.status == 200) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.showEdit = false;
            _this.getRoleList();
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //获取权限列表
      getPermissionsList: function () {
        var _this = this;
        this.$ajax.get(api.newPermissionList)
          .then(function (response) {
            _this.pmtLength = response.data.length;
            var obj = [];
            for (var k in  response.data) {
              var item = {};
              item.name = k;
              item.list = [];
              for (var j in response.data[k]) {
                item.list.push(response.data[k][j])
              }
              obj.push(item)
            }
            _this.permissionsList = obj;
          })
          .catch(function (error) {
            console.log(error)
          })

      },
      //权限全选
      selectAll: function () {
        var _this = this;
        _this.allSeclect = !_this.allSeclect;
        //滞空数组
        _this.selectArr = [];
        _this.selectCount = 0;
        //全选
        if (_this.allSeclect) {
          _this.permissionsList.forEach(function (item, i) {
            _this.selectArr.push(item.id);
            _this.selectCount++;
          });
        }
        console.log(_this.selectArr);
      },
      //角色绑定权限
      roleBindPermission: function () {
        var _this = this;
        _this.showPermission = false;
        this.$ajax({
          url: api.roleBindPermission,
          method: "post",
          data: {
            role_id: _this.bindRoleId,
            permission_id: _this.selectArr
          }
        }).then(function (response) {
          if (response.status == 200) {
            _this.getRoleList();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.showChangePer = false;
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //获得角色权限
      getRolePer: function (id, name, permissons) {
        this.bindRoleName = name;
        this.bindRoleId = id;
        this.showPermission = true;
        this.selectArr = permissons;
      }
    },
    destroyed: function () {

    }
  }
</script>
<style type="text/css" scoped>
  .md-6 {
    display: inline-block;
    width: 50%;
  }

  .tb-md-6 {
    width: 50%;
    float: left;
  }

  .permission {
    position: absolute;
    width: 80%;
    left: 10%;
    top: 10%;
  }

  @media (max-width: 992px) {
    .sm-12 {
      width: 100%;
    }
  }
</style>


