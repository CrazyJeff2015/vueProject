<template>
  <el-card>
    <div slot="header" class="clearfix"  v-if="index!=1">
      <h4>系统消息</h4>
    </div>
    <el-table
      :data="Data.data"
      border
      tooltip-effect="dark"
      :class=" index ? 'index' : '' "
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="index"
        label="#"
      v-if="index!=1">
      </el-table-column>
      <el-table-column
        prop="title"
        :label="label">
        <template scope="scope">
          <a href="#" class="cContent" @click.prevent="show(scope.row)"><el-badge :value="scope.row.is_read" class="item">
            <el-button size="small" style="border: none;"
                       v-bind:style="{color:scope.row.size.color,fontWeight:scope.row.size.weight}">{{scope.row.title}}</el-button>
          </el-badge></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="发布时间"
        width="200px"
        v-if="index!=1">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100px"
        v-if="index!=1">
        <template scope="scope">
          <el-button type="primary" :plain="true" size="small" @click.prevent="show(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="index!=1"
      @size-change="getSize"
      @current-change="getData"
      :current-page="Data.pageCurrent"
      :page-sizes="[10,20]"
      :page-size="Data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Data.totalCount">
    </el-pagination>
    <el-dialog :title="msgData.title" :visible.sync="showMsg" :show-close="false" size="large">
      <div style="margin-bottom:20px">时间：<span v-text="msgData.start"></span></div>
      <div v-html="msgData.content"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMsg = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
  import api from '../../request/api';
  export default {
    name: "",
    props: ['index'],
    data: function () {
      return {
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        label:'标题',
        addData: {
          title: '',
          content: '',
          type: 3,
          status: 2,
          start: '',
          end: '',
          timeValue: ''
        },
        font: {
          color: '',
          weight: 'normal'
        },
        addRule: {
          title:[
            {required: true, message: '标题必填', trigger: 'change'},
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
          ]
        },
        aId:'',
        showMsg: false,
        showAdd: false,
        switchValue: false,
        switchValue2: false,
        msgData: {},
        editorOption: {},
        showAgentId:false,
        readData:{
          mid:'',
          type:2
        },
      }
    },
    mounted: function () {
      this.getData();

    },
    methods: {
      selectFn(value){
        if(value==2){
          this.showAgentId = true;
        }else{
          this.showAgentId = false;
        }
      },

      del(id){
        this.$confirm('是否删除该消息？', '删除消息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delFn(id)
        }).catch(() => {
          this.$notify.info({
            title: '提示',
            message: '操作已取消',
            offset: 50,
            duration: 800
          });
        });
      },
      delFn(id){
        var _this = this;
        this.$ajax({
          url: api.delAdminMes+id,
          method: "DELETE",
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });

          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      dateHandle(){
        this.addData.timeValue[0] == null ? (this.addData.start = '', this.addData.end = '')
          : ( this.addData.start = this.dataFormat(this.addData.timeValue[0], "yyyy-MM-dd hh:mm:ss"), this.addData.end = this.dataFormat(this.addData.timeValue[1], "yyyy-MM-dd hh:mm:ss"))

      },
      submitAdd(formName){
        if(this.addData.type==2&&this.aId == ''){
          this.$message.error('指定ID必填！');
          return false;
        }else if(this.addData.type==2&&this.aId !=''){
          this.addData.receiver_id = [];
          if(this.aId.indexOf('，')>0){
            this.$message.error('请输入半角逗号','！');
            return false;
          }else {
            var arr = this.aId.split(',');
            this.addData.receiver_id = arr;
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this. addMessage();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //增加代理公告
      addMessage: function () {
        var _this = this;
        this.$ajax({
          url: api.addAdminMes,
          method: "post",
          data: _this.addData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showAdd = false;
            _this.resetForm('addData');
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });

          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      onEditorChange2({editor, html, text}) {
//        console.log('editor change!', editor, html, text)
        this.addData.content = html;
      },
      show(item){
        this.msgData = item;
        this.readData.mid = item.id;
        this.readFn();
        this.showMsg = true;
      },
      getUnread(){
        var _this = this;
        this.$ajax.get(api.unreadNum).then(function (response) {
          _this.$store.dispatch('getNum', response.data.data.num);
        })
      },
      readFn(){
        var _this = this;
        this.$ajax({
          url: api.ifRead,
          method: "post",
          data: _this.readData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getUnread();
            _this.getData();
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getData(val) {
        if(this.index==1){
          this.label = '系统消息';
        }
        this.Data.pageApi = api.agentMQ + '?type=7&page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.agentMQ + '?type=7&page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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

    },

  }
</script>
<style type="text/css" scoped>
  .index {
    min-height: 160px;
    max-height: 161px;
    overflow: hidden;
  }
  .j-message span {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    margin: 10px;
    vertical-align: middle;
  }

  .j-li {
    font-size: 0;
  }

  .ql-image {
    display: none !important;
  }
</style>


