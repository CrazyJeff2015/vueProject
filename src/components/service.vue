<template>
<el-card>
    <el-button :plain="true" type="info" v-if="ifShow" @click="showAdd = true">新增客服</el-button>
    <el-table :data="Data.data" border tooltip-effect="dark" style="width: 100%;margin-top: 20px">
      <el-table-column type="index" width="80">
      </el-table-column>
      <el-table-column label="内容" prop="body">
        <template scope="scope">
          <div class="serContent">
            <div v-html="scope.row.body"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
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

    <el-dialog title="修改客服" :visible.sync="showEdit" :show-close="false" size="large">
      <el-form :model="editData" ref="editData" label-width="150px">
        <el-form-item label="内容" prop="menu" required>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="editData.body">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增客服" :visible.sync="showAdd" :show-close="false" size="large">
      <el-form :model="addData" ref="addData" label-width="150px">
        <el-form-item label="内容" prop="menu" required>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="addData.body">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false;resetForm('addData')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">确 定</el-button>
      </div>
    </el-dialog>
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
        editData: {
          body:''
        },
        addData: {
          body:''
        },
        editEleid: '',
        showEdit: false,
        showAdd: false,
        showMsg: false,
        delId: '',
        ifShow:false,
        editorOption:{},
        showOption:{
          theme: 'bubble',
          modules: {
            toolbar: [

            ]
          }
        },
      }
    },
    mounted: function () {
      this.getData()

    },
    methods: {
      onEditorChange1({editor, html, text}) {
        this.addData.body = html;
      },
      onEditorChange2({editor, html, text}) {
        this.editData.body = html;
      },
      getData(val) {
        this.Data.pageApi = api.serviceList + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize ;
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.serviceList + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
              if(response.data.data.length==0){
                _this.ifShow = true;
              }else {
                _this.ifShow = false;
              }
            _this.Data.data = response.data.data;
            _this.Data.totalCount = Number(response.data.meta.pagination.total);
            _this.Data.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.Data.pagesize = Number(response.data.meta.pagination.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleEdit(index, row) {
        this.showEdit = true;
        this.editEleid = row.id;
        this.editData.body = row.body;
      },

      handleDelete(index, row) {
        this.delId = row.id;
        this.$confirm('此操作将删除代码,是否继续?', '提示', {
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
          url: api.delService + _this.delId,
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
          url: api.editService + _this.editEleid,
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
        this.$ajax({
          url: api.addService,
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





