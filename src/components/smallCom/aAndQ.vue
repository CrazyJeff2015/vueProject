<template>
  <el-card class="admin">
    <el-button @click="del()"  size="small">批量删除</el-button>
    <el-table
      :data="Data.data"
      border
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="selection"
        width="55">
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
        label="发布时间"
        width="200px">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px">
        <template scope="scope">
          <el-button type="primary" :plain="true" size="small" @click.prevent="show(scope.row)">查看详情</el-button>
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
    <el-dialog :title="msgData.title+'('+msgData.note+')'" :visible.sync="showMsg" :show-close="false" size="large">
      <hr />
      <div v-html="msgData.content"></div>
      <hr />
      <el-form>
        <el-form-item label="回复:" prop="content" required>
          <el-input  type="textarea" autosize  :autosize="{ minRows: 4, maxRows: 20}" placeholder="请输入内容" v-model="reContent" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMsg = false">关 闭</el-button>
        <el-button type="primary" @click="reFn()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增消息" size="large" :visible.sync="showAdd" :show-close="false">
      <el-form :model="addData" ref="addData" :rules="addRule" label-width="150px">
        <el-form-item label="指定代理:" v-show="showAgentId" required>
          <el-input v-model="aId" auto-complete="off" placeholder="多个代理ID请用半角逗号分隔','"></el-input>
        </el-form-item>
        <el-form-item label="标题:" prop="title" required>
          <el-input v-model="addData.title" placeholder="请输入标题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content" required>
          <el-input  type="textarea" autosize placeholder="请输入内容" v-model="addData.content" auto-complete="off"></el-input>
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
        options: [
          {value:'系统报障'},
          {value:'比例调整'},
          {value:'疑问解答'}
        ],
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        readData:{
          mid:'',
          type:1
        },
        addData: {
          title: '',
          content: '',
          type: 4,
          status: 2,
          start:'',
          end:''
        },
        font: {
          color: '',
          weight: 'normal'
        },
        addRule: {
          title: [
            {required: true, message: '标题必填', trigger: 'change'},
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
          ],
          content: {required: true, message: '内容必填', trigger: 'change'},
        },
        aId: '',
        reContent:'',
        showMsg: false,
        showAdd: false,
        switchValue: false,
        switchValue2: false,
        msgData: {},
        showAgentId: false,
        selectArr:[]
      }
    },
    mounted: function () {
      this.getData();

    },

    computed:{
      loginAgentName: function () {
        return this.$store.state.login.loginData.loginAgentName;
      },
    },
    methods: {
      getUnread(){
        var _this = this;
        this.$ajax.get(api.unreadNum).then(function (response) {
          _this.$store.dispatch('getNum', response.data.data.num);
        })
      },
      del(){
        this.$confirm('是否删除所选问答？', '删除问答', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         for(var i=0;i<this.selectArr.length;i++){
             this.delFn(this.selectArr[i])
         }
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
            _this.getUnread();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });

          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      handleSelectionChange(val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].id)
        }
        this.selectArr = arr;
      },
      getUnread(){
        var _this = this;
        this.$ajax.get(api.unreadNum).then(function (response) {
          _this.$store.dispatch('getNum', response.data.data.num);
        })
      },

      reFn(){

        var  start = new Date();
        var time = this.dataFormat(start, "yyyy-MM-dd hh:mm:ss");
        var content = this.msgData.content + '<div class="ad">系统' + ':' + this.reContent + '<br>'+time+'</div><br><br>';
        var _this = this;
        this.$ajax({
          url: api.editAAndQ+_this.msgData.id,
          method: "PUT",
          data: {
            content:content
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showMsg = false;
            _this.reContent='';
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
      addMessage: function () {
        var end = new Date();
        var  start = new Date();
        end.setTime(start.getTime() + 10*365*24*60*60*1000);
        this.addData.start = this.dataFormat(start, "yyyy-MM-dd hh:mm:ss");
        this.addData.end = this.dataFormat(end, "yyyy-MM-dd hh:mm:ss");
        var content = this.loginAgentName + ':' + this.addData.content + '<br>'+this.addData.start+'<br><br>';
        this.addData.content = content;
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
      show(item){
        this.msgData = item;
        this.readData.mid = item.id;
        this.readFn();
        this.showMsg = true;
      },
      readFn(){
        var _this = this;
        this.$ajax({
          url: api.ifRead,
          method: "post",
          data: _this.readData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getUnread()
            _this.getData();
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getData(val) {
        this.Data.pageApi = api.AdminMes + '?type=4&page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.AdminMes + '?type=4&page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data || [];
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


