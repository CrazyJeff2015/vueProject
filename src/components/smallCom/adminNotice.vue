<template>
   <el-card>
     <div slot="header" class="clearfix">
       <h4>公告管理<el-button @click="showAdd=true" class="pull-right" size="small">新增公告</el-button></h4>
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
           <a href="#" class="cContent" @click.prevent="show(scope.row)"><el-badge :value="scope.row.status" class="item">
             <el-button size="small" style="border: none;"
                        v-bind:style="{color:scope.row.size.color,fontWeight:scope.row.size.weight}">{{scope.row.title}}</el-button>
           </el-badge></a>
         </template>
       </el-table-column>
       <el-table-column
         prop="created_at"
         label="发布时间"
         width="200px">
       </el-table-column>
       <el-table-column
         prop="end"
         label="失效时间"
         width="200px">
       </el-table-column>
       <el-table-column
         label="操作"
       width="300px">
         <template scope="scope">
           <el-button type="primary" :plain="true" size="small" @click.prevent="show(scope.row)">查看详情</el-button>
           <el-button @click="editNot(scope.row)"  size="small">修改</el-button>
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
     <el-dialog title="新增公告" size="large" :visible.sync="showAdd" :show-close="false">
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
         <el-form-item label="类型" prop="type">
           <el-switch
             v-model="switchValue"
             on-text="置顶"
             off-text="普通"
             @change="switchChange"
             style="margin-left: 20px">
           </el-switch>
         </el-form-item>
         <el-form-item label="标题样式">
           <el-switch
             v-model="switchValue2"
             on-text="加粗"
             off-text="正常"
             @change="switchChange2"
             style="margin-left: 20px">
           </el-switch>
           <el-select v-model="font.color" placeholder="颜色" clearable>
             <el-option
               v-for="item in colorArr"
               :key="item.name"
               :label="item.name"
               :value="item.id">
             </el-option>
           </el-select>
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
     <el-dialog title="编辑公告" size="large" :visible.sync="showEdit" :show-close="false">
       <el-form :model="editData" ref="editData" :rules="addRule" label-width="150px">
         <el-form-item label="生效时间" required >
           <el-date-picker
             v-model="editData.timeValue"
             type="datetimerange"
             :picker-options="pickerOptions2"
             placeholder="选择时间范围"
             @change="dateHandle1()"
             align="left">
           </el-date-picker>
         </el-form-item>
         <el-form-item label="类型" prop="type">
           <el-switch
             v-model="switchValue1"
             on-text="置顶"
             off-text="普通"
             @change="switchChange1"
             style="margin-left: 20px">
           </el-switch>
         </el-form-item>
         <el-form-item label="标题:" prop="title" required>
           <el-input v-model="editData.title" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="内容:" prop="content" required>
           <quill-editor :content="editData.content"
                         :options="editorOption"
                         @change="onEditorChange3($event)">
           </quill-editor>
         </el-form-item>
       </el-form>

       <div slot="footer" class="dialog-footer">
         <el-button @click="showEdit = false;">取 消</el-button>
         <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
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
        Data1: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        addData: {
          title: '',
          content: '',
          type: 1,
          status: 2,
          start: '',
          end: '',
          timeValue: '',
          size: ''
        },
        font: {
          color: '',
          weight: 'normal'
        },
        font1: {
          color: '',
          weight: 'normal'
        },
        addRule: {
            title:[
              {required: true, message: '标题必填', trigger: 'change'},
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
            ]
        },
        showMsg: false,
        showMsg1: false,
        showAdd: false,
        switchValue: false,
        switchValue1:false,
        switchValue2: false,
        switchValue3:false,
        switchValue4:false,
        msgData: {},
        msgData1: {},
        editorOption: {

        },
        showOption:{
          theme: 'bubble',
          modules: {
            toolbar: [

            ]
          }
        },
        showOption1:{
          theme: 'bubble',
          modules: {
            toolbar: [

            ]
          }
        },
        colorArr: [
          {
            id: '#bb0946',
            name: '深红'
          },
          {
            id: '#ff0000',
            name: '红色'
          },
          {
            id: '#0000ff',
            name: '蓝色'
          },
          {
            id: '#673ab7',
            name: '紫色'
          },
          {
            id: ' #008000',
            name: '绿色'
          }
        ],
        editData:{
          title: '',
          content: '',
          type: 1,
          status: 2,
          start: '',
          end: '',
          timeValue: '',
          size: '',
          id:''
        },
        showEdit:false
      }
    },
    mounted: function () {
      this.getData();
    },
    methods: {
      del(id){
        this.$confirm('是否删除该公告？', '删除公告', {
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
      switchChange(){
        this.switchValue == true ? this.addData.status = 1 : this.addData.status = 2;
      },
      switchChange1(){
        this.switchValue1 == true ? this.editData.status = 1 : this.editData.status = 2;
      },
      switchChange2(){
        this.switchValue2 == true ? this.font.weight = 'bold' : this.font.weight = 'normal';
      },
      dateHandle(){
        this.addData.timeValue[0] == null ? (this.addData.start = '', this.addData.end = '')
          : ( this.addData.start = this.dataFormat(this.addData.timeValue[0], "yyyy-MM-dd hh:mm:ss"), this.addData.end = this.dataFormat(this.addData.timeValue[1], "yyyy-MM-dd hh:mm:ss"))

      },
      dateHandle1(){
        this.editData.timeValue[0] == null ? (this.editData.start = '', this.editData.end = '')
          : ( this.editData.start = this.dataFormat(this.editData.timeValue[0], "yyyy-MM-dd hh:mm:ss"), this.editData.end = this.dataFormat(this.editData.timeValue[1], "yyyy-MM-dd hh:mm:ss"))

      },
      submitAdd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addMessage();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitEdit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.editFn()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editFn(){
        this.editData.size = JSON.stringify(this.editData.size)
        var _this = this;
        this.$ajax({
          url: api.editNotice+_this.editData.id,
          method: "put",
          data: _this.editData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showEdit = false;
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
      //增加代理公告
      addMessage: function () {
        this.addData.size = JSON.stringify(this.font)
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
        this.addData.content = html;
      },
      onEditorChange3({editor, html, text}) {
        this.editData.content = html;
      },
      show(item){

        this.msgData = item;
        this.showMsg = true;

      },
      show1(item){
        this.msgData1 = item;
        this.showMsg1 = true;
      },
      editNot(item){
        item.status =='置顶'?(this.editData.status = 1,this.switchValue1 = true) : (this.editData.status = 2,this.switchValue1 = false);
        this.editData.title = item.title;
        this.editData.content = item.content;
        this.editData.size = item.size;
        this.editData.id = item.id;
        console.log(this.editData);
        this.showEdit = true;
      },
      getData(val) {
        this.Data.pageApi = api.AdminMes + '?type=1&page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.AdminMes + '?type=1&page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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
            for (var i = 0; i < _this.Data.data.length; i++) {
              if (_this.Data.data[i].size != '') {
                var size = JSON.parse(_this.Data.data[i].size)
                _this.Data.data[i].size = size;
              }
            }
            console.log()
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getData1(val) {
        this.Data1.pageApi = api.AdminMes + '?type=1&is_operate=1&page=' + (val ? val : this.Data1.pageCurrent) + '&limit=' + this.Data1.pagesize;
        this.dataHandle1();
      },
      getSize1(val) {

        this.Data1.pageApi = api.AdminMes + '?type=1&is_operate=1&page=' + this.Data1.pageCurrent + '&limit=' + (val ? val : this.Data1.pagesize);
        //搜索结束
        this.dataHandle();
      },
      dataHandle1(){
        var _this = this;
        this.$ajax.get(this.Data1.pageApi)
          .then(function (response) {
            _this.Data1.data = response.data.data;
            _this.Data1.totalCount = Number(response.data.meta.pagination.total);
            _this.Data1.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.Data1.pagesize = Number(response.data.meta.pagination.per_page);
            for (var i = 0; i < _this.Data1.data.length; i++) {
              if (_this.Data1.data[i].size != '') {
                var size = JSON.parse(_this.Data1.data[i].size)
                _this.Data1.data[i].size = size;
              }
            }
            console.log()
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


