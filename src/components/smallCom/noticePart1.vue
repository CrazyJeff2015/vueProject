<template>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>温馨提示(开设账号)</span>
        </div>
        <div v-for="item in warmData">
          <div v-html="item.content"></div>
          <el-button style="float: right;margin-bottom: 20px" v-if="permissions.create_prompt"  icon="edit"  size="small" @click="editWarm(item.id,item.content)"></el-button>
        </div>
        <el-button style="float: right;margin-bottom: 20px" v-if="warmData.length==0&&(permissions.create_prompt)"  icon="edit"  size="small" @click="showAdd=true"></el-button>

      </el-card>
      <el-dialog title="新增提示" size="large" :visible.sync="showAdd" :show-close="false">
        <quill-editor :content="addMsg"
                      :options="editorOption"
                      @change="onEditorChange1($event)">
        </quill-editor>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false;">取 消</el-button>
          <el-button type="primary" @click="addWarm()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑提示" size="large" :visible.sync="showEdit" :show-close="false">
        <quill-editor :content="warmMsg"
                      :options="editorOption"
                      @change="onEditorChange($event)">
        </quill-editor>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEdit = false;">取 消</el-button>
          <el-button type="primary" @click="sentWarm()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>
<script>
  import api from '../../request/api';

    export default {
        name: "",
        mounted: function () {
          this.getWarm();
        },
      computed: {
        loginName: function () {
          return this.$store.state.login.loginData.loginName;
        },
        loginScale: function () {
          return this.$store.state.login.loginData.loginScale;
        },
        loginId: function () {
          return this.$store.state.login.loginData.loginId;
        },
        pId: function () {
          return this.$store.state.login.loginData.pid;
        },
        permissions: function () {
          return this.$store.state.permissions.permissionsData;
        },

      },
        methods: {
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
          onEditorChange({editor, html, text}) {
            this.warmMsg = html;
          },
          onEditorChange1({editor, html, text}) {
            this.addMsg = html;
          },
          addWarm:function () {
            var _this = this;
            this.$ajax({
              url: api.addWarm,
              method: 'post',
              data: {
                aid: 0,
                content: _this.addMsg
              }
            }).then(function (response) {
              if (response.data.code == 200) {
                _this.showAdd= false;
                _this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                _this.getWarm();
              }
            }).catch(function (error) {
              console.log(error)
            })
          },
          sentWarm: function () {
            var _this = this;
            this.$ajax({
              url: api.editWarm,
              method: 'put',
              data: {
                id: _this.warmId,
                content: _this.warmMsg
              }
            }).then(function (response) {
              if (response.data.code == 200) {
                _this.showEdit= false;
                _this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                _this.getWarm();
              }
            }).catch(function (error) {
              console.log(error)
            })
          },
          getWarm: function () {
            var _this = this;
            this.$ajax.get(api.warmNot)
              .then(function (response) {
                _this.warmData = response.data.data;
              })
              .catch(function (error) {
                console.log(error)
              })
          },
          //富文本编辑器

          editWarm: function (id, value) {
            this.warmId=id;
            this.warmMsg = value;
            this.showEdit = true;
          },
          makeNew: function () {
            var _this = this;
            this.$ajax({
              url: api.setAgent,
              method: 'post',
              data:_this.ruleForm
            }).then(function (response) {
              _this.savePwd =JSON.parse(JSON.stringify(_this.ruleForm.pwd))
              _this.newAgentInfo = response.data.data;
              _this.showInfo = true;
              _this.resetForm('ruleForm')
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });

            }).catch(function (erro) {

            })
          }
        },
        destroyed: function () {

        },
        data: function () {
            return {
              showInfo: false,
              showAdd:false,
              showEdit:false,
              myUrl: '',
              newAgentInfo: [],
              warmData: '',
              warmId: '',
              warmMsg: '',
              savePwd:'',
              addMsg:'',
              newWarm:'',
              editorOption: {

              },
              showOption:{
                theme: 'bubble',
                modules: {
                  toolbar: [

                  ]
                }
              },

            }
        }
    }
</script>
<style type="text/css" scoped>

</style>


