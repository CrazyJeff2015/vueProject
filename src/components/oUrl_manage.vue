<template>
  <div>
    <el-card class="box-card" v-if="aId!=1||pId!=1">
      <div slot="header" class="clearfix">
        <span>代运营配置域名</span>
      </div>
      <el-table
        :data="agentLinks"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type">
        </el-table-column>
        <el-table-column
          label="代运营链接">
          <template scope="scope">
            <a target="_blank" :href="'http://'+scope.row.link" v-text="'http://'+scope.row.link"></a>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" v-if="permissions.edit_agent_link||permissions.delete_agent_link">
          <template scope="scope">
            <button class="btn btn-primary btn-xs"  @click="getLinkContent(scope.row.id,scope.row.type,scope.row.link)">
              <i class="el-icon-edit"></i></button>
            <button class="btn btn-primary btn-xs btn-danger"  @click="getDelId(scope.row.id)">
              <i class="el-icon-delete"></i></button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-button  style="display:block" v-if="permissions.create_agent_link" @click="showAUrl= true">新增代运营链接</el-button>
      <br>
    </el-card>
    <el-dialog title="新增链接" :visible.sync="showAUrl" :show-close="false">
      <el-form :model="addData" :rules="rules" ref="addData" label-width="250px">
        <el-form-item label="类型" prop="type">
          <el-input v-model="addData.type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接：(无需http://)" prop="link">
          <el-input v-model="addData.link" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAUrl = false;resetForm('addData')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改链接" :visible.sync="showEdit" :show-close="false">
      <el-form :model="editData" :rules="rules" ref="editData" label-width="250px">
        <el-form-item label="类型" prop="type">
          <el-input v-model="editData.type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接：(无需http://)" prop="link">
          <el-input v-model="editData.link" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false;resetForm('editData')">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "agent_detail",
    data () {
      var validateUrl = (rule, value, callback) => {
        var reg = /^(?=^.{3,255}$)(www\.)[a-zA-Z0-9][-a-zA-Z0-9]{1,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{1,62})+$/;
        if (value === '') {
          callback(new Error('域名不能为空'));
        } else if( reg.test(value) == false) {
          callback(new Error('请输入正确的域名,不需要加http://'));
        } else{
          callback();
        }
      };
      return {
        agentStatuss: [],
        agentLinks: [],
        secLinks: [],
        contentInfo: '',
        contentId: '',
        linkId: '',
        linkContent: '',
        addData:{
          type:'',
          link:''
        },
        editData:{
          id:'',
          type:'',
          link:''
        },
        rules: {
          link: [
            { validator: validateUrl,  trigger: 'change' }
          ]
        },
        addLink: '',
        addType: '',
        addMsg:'',
        showTex: true,
        agentContents: '',
        subTex: '',
        delId: '',
        showAdd: false,
        showEdit:false,
        showAUrl:false,
        editType:'',
        editorOption: {

        }
      }
    },

    mounted: function () {
      this.getLinks();
    },
    computed: {

      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      pId:function(){
        return this.$store.state.login.loginData.pId;
      },
      aId:function(){
        return this.$store.state.login.loginData.loginId;
      },

    },
    methods: {


      submitAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addLinkFn();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editLink();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      onEditorChange({editor, html, text}) {
        this.contentInfo = html;
      },
      onEditorChange1({editor, html, text}) {
        this.addMsg = html;
      },
      handleSubmit: function () {
        if (this.$vuerify.check()) { // 手动触发校验所有数据
          // do something
          this.addLinkFn();
        }
      },
      //获取修改链接内容
      getLinkContent: function (id, type,link) {
        this.showEdit = true;
        this.editData.type = type;
        this.editData.id = id;
        this.editData.link = link;
      },
      getDelId: function (id) {
        this.delId = id;
        this.$confirm('此操作将删除此推广链接, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delLingFn()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delLingFn: function () {
        var _this = this;
        this.$ajax({
          url: api.delAgentLink,
          method: 'post',
          data: {
            id: _this.delId
          }
        }).then(function (response) {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
          _this.getLinks();
        }).catch(function (error) {
          console.log(error)
        })
      },

      editLink: function () {
        var _this = this;
        this.$ajax({
          url: api.editLink,
          method: 'post',
          data: _this.editData
        }).then(function (response) {
          if(response.data.code == 200){
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.showEdit = false;
            _this.getLinks();
          }
        }).catch(function (erro) {
          console.log(erro)
        })

      },
      //新增代理链接
      addLinkFn: function () {
        var _this = this;
        this.$ajax({
          url: api.createLink,
          method: 'post',
          data:_this.addData
        }).then(function (response) {
          _this.getLinks();
          _this.getSeclinks();
          if (response.data.code == 200) {
            _this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            });
            _this.showAUrl = false;
            _this.resetForm('addData');
          }
        }).catch(function (erro) {
          console.log(erro)
        })

      },
//    余额状态
      checkmoney:function (val) {
        if(val>=0){
          return '正常'
        }else {
          return '异常'
        }
      },
      editWarm: function (id, value) {
        this.contentId=id;
        this.contentInfo = value;
        this.showEdit = true;
      },
//        更新代理佣金说明
      //获取原内容
      getContent: function (id, value) {
        this.contentId = id;
        this.contentInfo = value;
        this.showTex = true;
      },


      getStatuss: function () {
        //获取代理状态
        var _this = this;
        this.$ajax.get(api.agentStatus)
          .then(function (response) {
            _this.agentStatuss = response.data.data;
            //console.log(_this.agentStatuss);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getLinks: function () {
        //获取代理链接
        var _this = this;
        this.$ajax.get(api.agentLinkList)
          .then(function (response) {
            _this.agentLinks = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getSeclinks: function () {
        //获取非100%代理链接
        var _this = this;
        this.$ajax.get(api.secLinkList)
          .then(function (response) {
            _this.secLinks = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getContents: function () {
        //获取代理佣金分成说明
        var _this = this;
        this.$ajax.get(api.showAgentContent)
          .then(function (response) {
            //console.log(response);
            _this.agentContents = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    },
    destroyed: function () {

    }
  }

</script>


