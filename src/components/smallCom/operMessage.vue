<template>
  <el-card>
    <div slot="header" class="clearfix">
    <h4>我的消息<el-button @click="showAdd=true" class="pull-right" size="small">新增消息</el-button></h4>
    </div>
    <el-table
      :data="Data.data"
      border
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
        <template scope="scope">
          <a href="#" class="cContent" @click.prevent="show(scope.row)"><el-badge :value="scope.row.is_read" class="item">
            <el-button size="small" style="border: none;"
                       v-bind:style="{color:scope.row.size.color,fontWeight:scope.row.size.weight}">{{scope.row.title}}</el-button>
          </el-badge></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间"
        width="200px">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px">
        <template scope="scope">
          <el-button type="primary" :plain="true" size="small" @click.prevent="show(scope.row)">查看详情</el-button>
          <el-button @click="del(scope.row.id)"  size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
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
    <el-dialog title="新增消息" size="large" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addData" ref="addData" :rules="addRule" label-width="150px">
        <el-form-item label="生效时间" required >
          <el-date-picker
            v-model="addData.timeValue"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="选择时间范围"
            align="left"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="范围" required>
          <el-radio-group v-model="addData.type" @change="selectFn">
            <el-radio-button label="3">全局</el-radio-button>
            <el-radio-button label="6">代理</el-radio-button>
            <el-radio-button label="2">指定</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指定代理:"  v-show="showAgentId" required>
          <el-input v-model="aId" auto-complete="off" placeholder="多个代理号请用半角逗号分隔','"></el-input>
        </el-form-item>
        <el-form-item label="标题:" prop="title" required>
          <el-input v-model="addData.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content" required>
          <quill-editor :content="addData.content"
                        :options="editorOption"
                        @change="onEditorChange2($event)">
          </quill-editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false;">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
  import api from '../../request/api';
  export default {
    name: "",
    data: function () {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() < (Date.now()-3600 * 1000 * 24);
            return timeFlag;
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                const date = new Date();
                const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
                const dateStr = [year, month, day].join('-');
                const a = new Date(dateStr);
                start.setTime( a.getTime()-(8*3600000));
                end.setTime( a.getTime()+3600000 * 16)
                picker.$emit('pick', [start, end]);
              }
            },{
            text: '未来一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '未来15天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 15);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '未来30天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
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
          type:1
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
          method: "put",
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
        this.getUnread();
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
            _this.getData();
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getData(val) {
        this.Data.pageApi = api.operMessage + '?type=7&page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.operMessage + '?type=7&page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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


