<template>
 <el-card>
   <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
     <el-form-item label="代理号">
       <el-input v-model="searchInfo.aname" placeholder="请输入代理号"></el-input>
     </el-form-item>
     <el-form-item>
       <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
     </el-form-item>
   </el-form>
   <el-table :data="Data.data" border tooltip-effect="dark" style="width: 100%;">
     <el-table-column label="代理ID" prop="id">
     </el-table-column>
     <el-table-column label="代理号" prop="aname">
     </el-table-column>
     <el-table-column label="代充余额" prop="bank_score">
     </el-table-column>
     <el-table-column label="今日充值" prop="today_pay">
     </el-table-column>
     <el-table-column label="创建时间" prop="created_at">
     </el-table-column>
     <el-table-column label="操作">
       <template scope="scope">
         <el-button size="small" type="primary" @click="showEdit = true,editEleid=scope.row.id">充值
         </el-button>
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

   <el-dialog title="充值" :visible.sync="showEdit" :show-close="false">
     <el-form :model="editData" ref="editData" :rules="rules" label-width="150px">
       <el-form-item label="代充余额">
         <span style="color: red" v-text="loginBankScore"></span>
       </el-form-item>
       <el-form-item label="金额" prop="change">
         <el-input v-model="editData.change" type="text"></el-input>
       </el-form-item>
     </el-form>

     <div slot="footer" class="dialog-footer">
       <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
       <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
     </div>
   </el-dialog>
 </el-card>
</template>
<script>
  import api from '../request/api';
  import ElCard from "../../node_modules/element-ui/packages/card/src/main";
  export default {
    components: {ElCard},
    name: "",
    computed: {
      loginBankScore: function () {
        return Number(this.$store.state.login.loginData.loginBankScore);
      },
    },
    data: function () {
      var checkMoney = (rule, value, callback) => {
        var reg = /^[0-9]+$/;
       if( reg.test(value) == false) {
          callback(new Error('请输入的金额'));
        } else if(value>this.loginBankScore){
          callback(new Error('输入金额不可大于自身代充余额'));
        }else{
            callback();
       }
      };
      return {
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        rules:{
          change: [
            { validator: checkMoney, trigger: 'change' },
            { required: true, message: '请输入金额', trigger: 'change,blur' }
          ],
        },
        searchInfo:{
          aname:''
        },
        DataMsg: [],
        editData: {
        change:''
        },
        addData: {
          wid:'',
          name:'',
          url: ''
        },
        editEleid: '',
        showEdit: false,
        showAdd: false,
        showMsg: false,
        delId: '',
        isOnFlag:false
      }
    },
    mounted: function () {
      this.getData()
    },
    methods: {

      getData(val) {
        this.Data.pageApi = api.aPayList+'?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize +this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.aPayList+'?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize +this.parseParam(this.searchInfo);
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


      deleteEle(){
        var _this = this;
        this.$ajax({
          url: api.delPage + _this.delId,
          method: 'DELETE'
        }).then(function (response) {
          _this.$message({
            type: 'success',
            message: '操作成功'

          });
          _this.getData();
        }).catch(function (error) {
          console.log(error)
        })
      },
      submitEdit(){
        var _this = this;
        this.$ajax({
          url: api.sentBankScore + _this.editEleid,
          data: _this.editData,
          method: "PUT"
        }).then(function (response) {
          _this.showEdit = false;
          _this.getData();
          _this.$message({
            type: 'success',
            message: '操作成功'
          });
        }).catch(function (error) {
          console.log(error)
        })
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
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





