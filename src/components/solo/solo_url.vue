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
        <el-form-item>
          <el-switch
            v-model="switchValue"
            on-text="精确"
            off-text="模糊"
            @change="switchChange">
          </el-switch>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" size="small" @click="getData()">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="danger" icon="delete" size="small" @click="deleteConfirm()">删除选择</el-button>
      <el-button type="primary" size="small" @click="showAdd=true"><i class="el-icon-plus" ></i> 新增域名</el-button>
    </div>
    <!-- Second Data Table Starts Here-->
    <el-table
      ref="multipleTable"
      :data="Data.data"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="aname"
        label="代理号">
      </el-table-column>
      <el-table-column
        prop="agent_aname"
        label="登录名">
      </el-table-column>
      <el-table-column
        prop="cname"
        label="域名">
      </el-table-column>
      <el-table-column
        label="资质">
        <template scope="scope">
          <span v-html="scope.row.qualification"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建日期">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog title="域名编辑" :visible.sync="showEdit" :show-close="false">
      <el-form :model="editData" :rules="rules" ref="editData" label-width="80px">
        <el-form-item label="代理号" prop="aname" required>
          <el-input v-model="editData.aname" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="域名" prop="cname" required>
          <el-input v-model="editData.cname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资质">
          <quill-editor :content="editData.qualification"
                        :options="editorOption"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增域名" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addData" :rules="rules" ref="addData" label-width="80px">
        <el-form-item label="代理号" prop="aname" required>
          <el-input v-model="addData.aname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="域名" prop="cname" required>
          <el-input v-model="addData.cname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资质">
          <quill-editor :content="addData.qualification"
                        :options="editorOption"
                        @change="onAddChange($event)">
          </quill-editor>
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
  import api from '../../request/api';
  export default {
    name: "name_charge",
    data: function(){
      var validateUrl = (rule, value, callback) => {
        var reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
        if (value === '') {
          callback(new Error('域名不能为空'));
        } else if( reg.test(value) == false) {
          callback(new Error('请输入正确的域名,不需要加http://'));
        } else{
          callback();
        }
      };
      var validateAname = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9]+$/;
        if (value === '') {
          callback(new Error('代理号不能为空'));
        } else if( reg.test(value) == false) {
          callback(new Error('请输入正确的代理号'));
        } else{
          callback();
        }
      };
      return {
        Data: {
          data:[],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi:''
        },
        searchTxt:'',
        switchValue:true,
        searchType:'cname',
        typeInfo:[{
          id:'cname',
          name:'域名'

        },
          {
            id:'agent_name',
            name:'代理号'
          },
          {
            id:'aname',
            name:'登录名'
          },
        ],
        searchInfo:{
          cname:'',
          agent_name:'',
          aname:'',
          preg:1
        },
        rules: {
          aname: [
            { validator: validateAname,  trigger: 'blur' }
          ],
          cname: [
            { validator: validateUrl,  trigger: 'blur' }
          ]
        },
        selectArr: [],
        editData: {
          id:'',
          aname:'',
          cname:'',
          qualification:''
        },
        addData: {
          aname:'',
          cname:'',
          qualification:''
        },
        showEdit:false,
        showAdd:false,
        isChecked:true,
        editorOption: {}
      }
    },
    computed:{
      loginScale:function(){
        return this.$store.state.login.loginData.loginScale;
      }
    },
    mounted: function() {
      //获取域名管理数据
      this.getData();
    },
    methods: {
      switchChange(){
        this.switchValue==true?this.searchInfo.preg=1:this.searchInfo.preg=0;
      },
      handleEdit(index, row) {
        this.showEdit = true;
        this.editData.id = row.id;
        this.editData.aname = row.aname;
        this.editData.cname = row.cname;
        this.editData.qualification = row.qualification;
      },
      getData(val) {
        this.searchInfo.cname = '';
        this.searchInfo.aname = '';
        this.searchInfo.agent_name = '';
        for(var k in this.searchInfo){
          if(k==this.searchType){
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.getUrlList + '?page=' + (val?val:this.Data.pageCurrent) + '&limit=' + this.Data.pagesize+"&"+this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getUrlList + '?page=' + this.Data.pageCurrent + '&limit=' + (val?val:this.Data.pagesize)+"&"+this.parseParam(this.searchInfo);
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

      //搜索序列化
      parseParam: function (param) {
        var paramStr = "";
        for (var k in param) {
          if (param[k] != "" || typeof(param[k]) == "number") {
            paramStr += '&' + k + '=' + param[k]
          }
        }
        return paramStr.substr(1);

      },
      onEditorChange({editor, html, text}) {
        this.editData.qualification = html;
      },
      onAddChange({editor, html, text}) {
        this.addData.qualification = html;
      },
      submitEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editName();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addName();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      handleSelectionChange(val) {
        var arr = [];
        this.selectArr = [];
        for(var i=0;i<val.length;i++){
          arr.push(val[i].id)
        }
        this.selectArr = arr;
      },
      deleteConfirm() {
        this.$confirm('此操作将删除已勾选的域名, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSelect()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteSelect: function () {
        //删除域名
        var _this = this;
        //连接删除ID
        this.$ajax({
          url:api.deleteUrl,
          data:{
            id:_this.selectArr
          },
          method:'post'
        }).then(function (response) {
          _this.$message({
            type: 'success',
            message: '操作成功!'
          });
          _this.getData();
        }).catch(function (error) {
          console.log(error);
        });
      },

      editName: function () {
        //编辑域名
        var _this = this;
        this.$ajax({
          url:api.updateUrl,
          method:'post',
          data:_this.editData
        })
          .then(function (response) {
            if (response.data.code == 200) {
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
              _this.showEdit = false;
              _this.getData()
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      addName: function () {
        //添加域名
        var _this = this;
        this.$ajax({
          url:api.addUrl,
          method:'post',
          data:_this.addData
        })
          .then(function (response) {
            if(response.data.code == 200){
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
              _this.resetForm('addData');
              _this.addData.qualification = '';
              _this.showAdd = false;
              _this.getData()
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }

    },
    destroyed: function() {

    }
  }
</script>

