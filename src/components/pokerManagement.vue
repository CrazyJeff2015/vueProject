<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>棋牌管理</span>
      </div>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline" v-show="permissions.admin||pId==1">
        <el-form-item label="代理号">
          <el-autocomplete
            v-model="searchInfo.aname"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="data"
        border
        tooltip-effect="dark"
        style="width: 100%;">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="room"
          label="房间">
        </el-table-column>
        <el-table-column
          prop="score_changed"
          label="金币变化">
        </el-table-column>
        <el-table-column
          prop="online_num"
          label="在线人数">
        </el-table-column>
        <el-table-column
          prop="room_target_tax"
          label="目标">
        </el-table-column>
        <el-table-column
          prop="cur_tax_value"
          label="当前">
        </el-table-column>
        <el-table-column
          prop="user_ai_speed"
          label="系数">
        </el-table-column>
        <el-table-column
          label="管理">
          <template scope="scope">
            <el-button icon="edit" size="small" @click="editFn(scope.row.id,scope.row.user_ai_speed)"></el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <el-dialog title="设置" :visible.sync="showSet" :show-close="false">
      <el-form :model="setData" ref="setData" :rules="rules" label-width="150px">
        <el-form-item label="系数" prop="user_ai_speed" required>
          <el-input v-model="setData.user_ai_speed" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSet = false;">取 消</el-button>
        <el-button type="primary" @click="submitSet('setData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {

    name: "",
    data: function () {
      var checkSpeed1 = (rule, value, callback) => {
        var reg = /^[0-1]\.((0[1-9])|([0-9]\d))$/;
//        var reg = /^[0-9]*.?[0-9]*$/;
        if(reg.test(value)==false){
          callback(new Error('请输入正确的值，范围(0.01 ~ 1.00)'));
        } else if (value<0.01||value>1) {
          callback(new Error('请输入正确的值，范围(0.01 ~ 1.00)'));
        } else {
          callback();
        }
      }
      return {
        data: [],
        setId: '',
        setData: {
          user_ai_speed:''
        },
        searchInfo: {
          aname:''
        },
        rules:{
          user_ai_speed: [
            {validator: checkSpeed1, trigger: 'change'},
            {required: true, message: '不能为空', trigger: 'change'},
          ]
        },
        editId: '',
        showSet:false
      }
    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      pId: function () {
        return this.$store.state.login.loginData.pid;
      },
    },
    mounted: function () {
      this.getData();
    },
    methods: {
      querySearchAsync(queryString, cb) {
        var _this = this;
        this.$ajax.get(api.showAname+'?value='+_this.searchInfo.aname).
        then(function (response) {
          var arr = new Array;
          for(var i=0;i< response.data.data.length;i++){
            arr.push( response.data.data[i])
          }
          var results = queryString ? arr.filter(_this.createStateFilter(queryString)) : arr;
          cb(results);
        })

      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      editFn(id,value){
        this.editId = id;
        this.setData.user_ai_speed = value.toString();
        this.showSet=true

      },

      submitSet(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sentFn();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      getData: function () {
        var _this = this;
        this.$ajax({
          url: api.getPokerList+'?'+_this.parseParam(_this.searchInfo),
          method: 'get'
        }).then(function (response) {
          _this.data = response.data.data;
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


      sentFn: function () {
        var _this = this;
        this.$ajax({
          url: api.updatePoker + _this.editId,
          method: "post",
          data: _this.setData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.resetForm('setData');
            _this.getData();
            _this.showSet = false;
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        }).catch(function (error) {

        })

      },

      destroyed: function () {

      }
    }

  }
</script>
