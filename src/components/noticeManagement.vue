<template>
 <el-card>
   <div>
     <!--<el-button :plain="true" type="info" style="margin-top: 20px" @click="showAdd = true">新增</el-button>-->
     <el-switch v-if=""
       v-model="switchValue"
       on-text="自身"
       off-text="所有"
       @change="switchChange">
     </el-switch>
     <el-table :data="Data.data" border tooltip-effect="dark" style="width: 100%;margin-top: 20px">
       <el-table-column label="Id" prop="id">
       </el-table-column>
       <el-table-column label="代理号" prop="aname">
       </el-table-column>
       <el-table-column label="状态" prop="is_show">
         <template scope="scope">
           <span v-if="scope.row.is_show == 1">生效中</span>
           <span v-else>已失效</span>
         </template>
       </el-table-column>
       <el-table-column label="类型" prop="type">
         <template scope="scope">
           <span v-if="scope.row.type == 'lobby'">游戏公告</span>
           <span v-if="scope.row.type == 'news'">游戏消息</span>
           <span v-if="scope.row.type == 'site'">网站公告</span>
         </template>
       </el-table-column>
       <el-table-column label="标题" prop="title">
       </el-table-column>
       <el-table-column label="内容" prop="msg">
         <template scope="scope">
           <div class="msg" v-html="scope.row.msg"></div>
         </template>
       </el-table-column>
       <el-table-column label="操作">
         <template scope="scope">
           <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
           </el-button>
         </template>
       </el-table-column>
     </el-table>

     <el-dialog title="修改公告" :visible.sync="showEdit" :show-close="false">
       <el-form :model="editData" ref="editData" label-width="150px">
         <el-form-item label="ID" prop="id">
           <el-input v-model="editData.id" auto-complete="off" disabled></el-input>
         </el-form-item>
         <el-form-item label="标题" prop="title">
           <el-input v-model="editData.title" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="内容" prop="msg">
           <el-input type="textarea" autosize v-model="editData.msg" auto-complete="off"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
         <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
       </div>
     </el-dialog>
     <el-dialog title="新增公告" :visible.sync="showAdd" :show-close="false">
       <el-form :model="addData" ref="addData" label-width="150px">
         <el-form-item label="类型">
           <el-radio-group v-model="addData.type">
             <el-radio-button label="lobby">游戏公告</el-radio-button>
             <el-radio-button label="news">游戏消息</el-radio-button>
             <el-radio-button label="site">网站公告</el-radio-button>
           </el-radio-group>
         </el-form-item>
         <el-form-item label="标题" prop="title">
           <el-input v-model="addData.title" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="内容" prop="msg">
           <el-input type="textarea" autosize v-model="addData.msg" auto-complete="off"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="showAdd = false;resetForm('addData')">取 消</el-button>
         <el-button type="primary" @click="submitAdd('addData')">确 定</el-button>
       </div>
     </el-dialog>
   </div>
 </el-card>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "",
    computed: {

    },
    data: function () {
      return {
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        DataMsg: [],
        switchValue:true,
        editData: {
          id: '',
          type: '',
          msg:'',
          title:'',
          zid:''
        },

        addData: {
          type: '',
          msg:'',
          title:'',
        },
        editEleid: '',
        showEdit: false,
        showAdd: false,
        showMsg: false,
        delId: '',
        searchInfo:{
          my:'1',
          all:''
        },
      }
    },
    mounted: function () {
      this.getData()
    },
    methods: {
      switchChange(){
        this.switchValue == true ? (this.searchInfo.my = '1',this.searchInfo.all='') : (this.searchInfo.my = '',this.searchInfo.all='1');
        this.getData()
      },


      getData() {
        this.Data.pageApi = api.getNotice+'?'+this.parseParam(this.searchInfo) ;
        this.dataHandle();
      },
      getSize() {
        this.Data.pageApi = api.getNotice+'?'+this.parseParam(this.searchInfo) ;
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data.notice;
//            _this.Data.totalCount = Number(response.data.meta.total);
//            _this.Data.pageCurrent = Number(response.data.meta.current_page);
//            _this.Data.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleEdit(index, row) {
        this.showEdit = true;
        this.editData.id = row.id;
        this.editData.type = row.type;
        this.editData.msg = row.msg;
        this.editData.title = row.title;
        this.editData.zid = row.zid;
      },
      handleMsg(index, row) {
        this.showMsg = true;
        var _this =this;
        this.$ajax({
          url: api.companyMsg + row.id,
          method: "get"
        }).then(function (response) {
          _this.DataMsg.push(response.data.data) ;
        }).catch(function (error) {
          console.log(error)
        })
      },
      handleDelete(index, row) {
        this.delId = row.id;
        this.$confirm('此操作将删除该公司,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteEle()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
          url: api.editGameNotice,
          data: _this.editData,
          method: "post"
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
      submitAdd(){
        var _this = this;
        this.$ajax({
          url: api.editNotice,
          data: _this.addData,
          method: "post"
        }).then(function (response) {
          _this.showAdd = false;
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
        return paramStr.substr(1);

      },
    },
    destroyed: function () {

    }
  }
</script>
<style type="text/css" scoped>
  .companyMsg {
    cursor: pointer;
  }
  .msg {
    max-height: 50px;
  }

</style>




