<template>
  <div>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>公告管理</span>
          <el-button v-if="agentAnnment.length < 2&&loginId==1||pId==1"  size="small" @click="showAdd=true" class="pull-right">新增代理公告</el-button>
          <el-button v-if="sysAnnment.length < 2&&loginId==1||pId==1"  size="small" @click="showAdd=true" class="pull-right">新增代理公告</el-button>
        </div>
          <h4 class="sysTit" v-if="loginId==1||pId==1">系统公告</h4>
          <ul>
            <li v-for="(item,index) in sysAnnment">
              <div v-html="item.msg"></div>
              <el-button v-if="loginScale==100"  icon="edit" @click="getSysMsg(item.id,item.title,item.msg)" size="small"></el-button>
            </li>
          </ul>
          <h4 v-if="loginScale==100||loginScale==99">代理公告</h4>
          <ul>
            <li v-for="(item,index) in agentAnnment">
              <div v-html="item.msg"></div>
              <el-button v-if="loginScale==100||loginScale==99"  icon="edit"  @click="getAgentMsg(item.id,item.title,item.msg,item.aname)" size="small"></el-button>
            </li>
          </ul>

      </el-card>

    <!--编辑系统公告-->
    <el-dialog title="编辑公告" size="large" :visible.sync="showAdminEdit" :show-close="false">
      <quill-editor :content="sysMsg"
                    :options="editorOption"
                    @change="onEditorChange($event)">
      </quill-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdminEdit = false;">取 消</el-button>
        <el-button type="primary" @click="subSysann()">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑代理公告-->
    <el-dialog title="编辑公告" size="large" :visible.sync="showAgentEdit" :show-close="false">
      <h4>所属代理: <em v-text="noticeName"></em></h4>
      <quill-editor :content="agentMsg"
                    :options="editorOption"
                    @change="onEditorChange1($event)">
      </quill-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAgentEdit = false;">取 消</el-button>
        <el-button type="primary" @click="subAgtann()">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增代理公告-->
    <el-dialog title="新增公告" size="large" :visible.sync="showAdd" :show-close="false">
      <quill-editor :content="addMsg"
                    :options="editorOption"
                    @change="onEditorChange2($event)">
      </quill-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false;">取 消</el-button>
        <el-button type="primary" @click="addAgtann()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "form_editors",
    data() {
      return {
        userData: [],
        sysAnnment: [],
        agentAnnment: [],
        sysId: '',
        sysTit: '',
        sysMsg: '',
        agentId: '',
        agentTit: '',
        agentMsg: '',
        addMsg: '',
        selected: '10',
        showTex: true,
        subTex: '',
        noticeName: '',
        editorOption: {},
        showAdminEdit:false,
        showAgentEdit:false,
        showAdd:false
      }
    },
    mounted: function () {
      "use strict";
      var _this = this;
      //获取系统公告、代理公告
      _this.getsysAnnment();
//      _this.getagtAnnment();
      $(document).ready(function () {
        $("#addBtn").bind("click", function () {
//          console.log(_this.addMsg);
          _this.addAgtann();
        })
      })
    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      loginId:function(){
        return this.$store.state.login.loginData.loginId;
      },
      pId:function(){
        return this.$store.state.login.loginData.pid;
      },
    },
    methods: {
      refresh: function () {
        this.getsysAnnment();
        this.getagtAnnment();
      },

      onEditorChange({editor, html, text}) {
//        console.log('editor change!', editor, html, text)
        this.sysMsg = html;
      },
      onEditorChange1({editor, html, text}) {
//        console.log('editor change!', editor, html, text)
        this.agentMsg = html;
      },
      onEditorChange2({editor, html, text}) {
//        console.log('editor change!', editor, html, text)
        this.addMsg = html;
      },

      //获取系统公告
      getsysAnnment: function () {
        var _this = this;
        this.$ajax.get(api.getAdminContent)
          .then(function (response) {
            _this.sysAnnment = response.data.data;

          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //获取代理公告
      getagtAnnment: function () {
        var _this = this;
        this.$ajax.get(api.getAgentContent)
          .then(function (response) {
            _this.agentAnnment = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //获取系统公告 内容
      getSysMsg: function (id, tit, msg) {
        this.sysId = id;
        this.sysTit = tit;
        this.sysMsg = msg;
//        this.showTex = true;
        this.showAdminEdit = true;
      },
      //获取代理公告 内容
      getAgentMsg: function (id, tit, msg, aname) {
        this.agentId = id;
        this.agentTit = tit;
        this.agentMsg = msg;
        this.noticeName = aname;
        this.showAgentEdit = true;
      },
      //保存系统公告
      subSysann: function () {
        var _this = this;
        this.$ajax({
          url: api.updateContent,
          method: 'put',
          data: {
            id: _this.sysId,
            title: _this.sysTit,
            msg: _this.sysMsg
          }
        })
          .then(function (response) {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.getsysAnnment();
            _this.showAdminEdit =false;
            console.log(response)
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //保存代理公告
      subAgtann: function () {
        var _this = this;
        this.$ajax({
          url: api.updateContent,
          method: 'put',
          data: {
            id: _this.agentId,
            title: _this.agentTit,
            msg: _this.agentMsg
          }
        })
          .then(function (response) {
            if (response.data.code == 200) {
              _this.$message({
                type: 'success',
                message: '操作成功!'
              });
              _this.getagtAnnment();
              _this.showAgentEdit;
            }
            console.log(response)
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //增加代理公告
      addAgtann: function () {
        var _this = this;
        this.$ajax({
          url: api.addContent,
          method: 'post',
          data: {
            msg: _this.addMsg
          }
        })
          .then(function (response) {
            if (response.data.code == 200) {
              _this.$message({
                type: 'success',
                message: '操作成功!'
              });
              _this.showAdd;
              _this.getsysAnnment();
              _this.getagtAnnment();
            }
            console.log(response)
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    },
    //富文本编辑器

    destroyed: function () {

    }
  }
</script>

<style scoped>


  li {
    margin-bottom: 30px;
  }

  h4 {
    margin: 48px 0 20px 40px;
    color: #0d61a0;;
  }

  .sysTit {
    margin-top: 20px;
  }

  h5 {
    color: #0d61a0;;
  }

  .modal-title.custom_align {
    margin: 10px 0 10px 0;
  }

  .modal-body h4 {
    margin: 0 0 15px 0;
  }

  .modal-body input, .modal-body textarea {
    width: 100%;
    margin-bottom: 20px;
    height: 40px;
    text-indent: 24px;
  }
</style>
