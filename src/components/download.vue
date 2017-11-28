<template>
  <div>
    <!--<el-button :plain="true" type="info" style="margin-top: 20px" @click="showAdd = true">新增</el-button>-->
    <el-table :data="Data.data" border tooltip-effect="dark" style="width: 100%;margin-top: 20px">
      <el-table-column label="位置说明" prop="way">
      </el-table-column>
      <el-table-column label="版本" prop="version">
      </el-table-column>
      <el-table-column label="展示方式" prop="show">
      </el-table-column>
      <el-table-column label="按钮文字" prop="button">
      </el-table-column>
      <el-table-column label="URL" prop="url">
      </el-table-column>
      <el-table-column label="状态" prop="is_on">
      </el-table-column>
      <el-table-column label="更新日期" prop="updated_at">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <!--<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <!--<el-pagination-->
      <!--@size-change="getSize"-->
      <!--@current-change="getData"-->
      <!--:current-page="Data.pageCurrent"-->
      <!--:page-sizes="[10, 20]"-->
      <!--:page-size="Data.pagesize"-->
      <!--layout="total, sizes, prev, pager, next, jumper"-->
      <!--:total="Data.totalCount">-->
    <!--</el-pagination>-->

    <el-dialog title="修改下载" :visible.sync="showEdit" :show-close="false">
      <el-form :model="editData" ref="editData" label-width="150px">
        <el-form-item label="位置说明" prop="way">
          <span v-text="editData.way" auto-complete="off"></span>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <span v-text="editData.version" auto-complete="off"></span>
        </el-form-item>
        <el-form-item label="展示方式" prop="show">
          <span v-text="editData.show" auto-complete="off"></span>
        </el-form-item>
        <el-form-item label="按钮文字" prop="button">
          <el-input v-model="editData.button" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="editData.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="isOnFlag"
            on-color="#13ce66"
            off-color="#ff4949"
            on-text="启动"
            off-text="关闭"
          @change="handleSwitch">
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增页面" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addData" ref="addData" label-width="150px">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="addData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="description">
          <el-input v-model="addData.url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('addData')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
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
        editData: {
          way: '',
          version: '',
          show:'',
          button:'',
          url:'',
          is_on:''
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
      handleSwitch(value){
         if(value == false){
             this.editData.is_on = 0;
         }else {
             this.editData.is_on = 1;
         }
      },
      getData() {
        this.Data.pageApi = api.getDownList;
        this.dataHandle();
      },
      getSize() {

        this.Data.pageApi = api.getDownList;
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
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
        this.editEleid = row.id;
        this.editData.way = row.way;
        this.editData.version = row.version;
        this.editData.show = row.show;
        this.editData.button = row.button;
        this.editData.url = row.url;
        if(this.editData.is_on == '关闭'){
            this.isOnFlag = false;
            this.editData.is_on = 0;
        }else {
          this.isOnFlag = true;
          this.editData.is_on = 1;
        }
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
          url: api.editDownload + _this.editEleid,
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
      submitAdd(){
        var _this = this;
        _this.addData.wid = _this.wid;
        this.$ajax({
          url: api.createPage,
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
      getMsg(){
        var _this = this;
        this.$ajax({
          url: api.companyMsg,
          method: "get"
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
</style>




