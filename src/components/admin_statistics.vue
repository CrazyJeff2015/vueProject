<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>温馨提示:</span>
      </div>
      <div v-for="item in warmData">
        <div v-html="item.content"></div>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="游戏类型">
          <el-select v-model="searchInfo.product" placeholder="请选择" clearable>
            <el-option
              v-for="item in productInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="时间间隔应小于7天"
            align="left"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <h3 class="panel-title" style="color: rgb(0, 141, 228);">代理分成统计<span style="color: rgb(244, 67, 54);">（点击代理号查看下一级代理统计情况）</span>
        <el-button v-show="!ifMy" size="small" @click="backTopAgent()">返回上级代理</el-button>
      </h3>
      <el-table :data="Data.data" border style="width: 100%; margin-top: 20px" @sort-change="sortHandle">
        <el-table-column prop="agent_aname" label="代理号">
          <template scope="scope">
            <a href="#" v-text="scope.row.agent_aname"
               @click.prevent="enterIndexAgent(scope.row.agent_id,scope.row.agent_aname)" v-if="Number(scope.row.nextCommission)!==0"></a>
            <span v-else v-text="scope.row.agent_aname"></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="代理状态">
        </el-table-column>
        <el-table-column prop="scale" sortable="custom" label="抽佣比例">
        </el-table-column>
        <el-table-column prop="commissionCount" label="总佣金">
        </el-table-column>
        <el-table-column prop="myCommission" label="自身佣金">
        </el-table-column>
        <el-table-column prop="nextCommission" label="下级贡献">
        </el-table-column>
        <el-table-column prop="soleCashCount" label="直接会员总输赢">
        </el-table-column>
        <el-table-column prop="soleNextCashCount" label="间接会员总输赢">
        </el-table-column>
        <el-table-column prop="soleAllCashCount" label="所有会员总输赢">
        </el-table-column>
      </el-table>
      <el-table :data="countData.data" border :show-header="false" v-if="!ifMy">
        <el-table-column>
        </el-table-column>
        <el-table-column>
        </el-table-column>
        <el-table-column>
          <template scope="scope">
            <span>总计:</span>
          </template>
        </el-table-column>
        <el-table-column prop="commissionCount" label="总佣金">
        </el-table-column>
        <el-table-column prop="myCommission" label="自身佣金">
        </el-table-column>
        <el-table-column prop="nextCommission" label="下级贡献">
        </el-table-column>
        <el-table-column prop="soleCashCount" label="直接会员总输赢">
        </el-table-column>
        <el-table-column prop="soleNextCashCount" label="间接会员总输赢">
        </el-table-column>
        <el-table-column prop="soleAllCashCount" label="所有会员总输赢">
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
    </el-card>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "agent_statistics",
    data() {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > (Date.now()+3600 * 1000 * 24);
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
            text: '最近3天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '最近7天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        timeValue: '',
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        countData:{
          data:[],
          pageApi:''
        },
        searchInfo: {
          begin_at: '',
          end_at: '',
          product: '',
          scale: ''
        },
        showOption:{
          theme: 'bubble',
          modules: {
            toolbar: [

            ]
          }
        },
        showAdd: false,
        showEdit: false,
        productInfo: [],
        topAgentId: '',
        topAgentName: '',
        nowAgentId: '',
        nowAgentName: '',
        addMsg: '',
        warmMsg: '',
        editorOption: {},
        indexId: 0,
        warmData: [],
        showTop: false,
        ifMy:true,
        firstId:0,
        ifFirst:true
      }
    },
    computed:{
      loginScale:function(){
        return this.$store.state.login.loginData.loginScale;
      },
      loginId:function(){
        return this.$store.state.login.loginData.loginId;
      },
      pId:function(){
        return this.$store.state.login.loginData.pid;
      },
      isOper:function(){
        return this.$store.state.login.loginData.isOperate;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function () {

      this.getWarm();
      this.getData();
      this.getProduct();
    },

    methods: {
      backTopAgent(){

        if(this.firstId!=0&&this.firstId==this.Data.data[0].agent_id){
            this.ifMy = true;
            this.firstId = 0;
            this.ifFirst = true;
            this.getData()
        }else {
          this.indexId = this.topAgentId;
          this.getData();
        }
      },
      enterIndexAgent(id, name){
       if(this.ifMy){
         this.ifMy = false;
         this.getData();
       }else {
         this.nowAgentId = JSON.parse(JSON.stringify(this.indexId))
         this.nowAgentName = JSON.parse(JSON.stringify(name))
         this.indexId = id;
         this.topAgentName = name;
         this.showTop = true;
         this.ifMy = false;
         this.getData();
       }
      },
      sortHandle(value){
        value.order == 'descending' ? this.searchInfo.scale = 'desc' : this.searchInfo.scale = 'asc';
        this.getData();
      },
      getProduct(){
        var _this = this;
        this.$ajax.get(api.productType).then(function (response) {
          _this.productInfo = response.data.m8a_product_types;
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      getData(val) {
          if(this.searchInfo.product!=''||this.searchInfo.begin_at!=''){
              this.searchInfo.scale='';
          }
          if(this.ifMy){
            this.Data.pageApi = api.myCommissions  + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
          }else {
            this.Data.pageApi = api.agentCount + '/' + this.indexId + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
            this.countData.pageApi = api.commissionsCount + '/' + this.indexId +'?' + this.parseParam(this.searchInfo);
          }


        this.dataHandle();
      },
      getSize(val) {
        this.Data.pageApi = api.agentCount + '/' + this.indexId + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
       if(!this.ifMy){
         this.dataCountHandle();
       }
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
           if(_this.ifMy){
            if(response.data.data===undefined){
              _this.Data.data=[];
              _this.Data.totalCount = 1;
              _this.Data.pageCurrent = 1;
              _this.Data.pagesize = 10;
            }else {
              _this.Data.data = [];
              _this.Data.data.push(response.data.data);
              _this.Data.totalCount = 1;
              _this.Data.pageCurrent = 1;
              _this.Data.pagesize = 10;
            }
           }else {
             _this.Data.data = response.data.data;
             if(_this.ifFirst){
               _this.firstId = _this.Data.data[0].agent_id;
               console.log(_this.firstId)
               _this.ifFirst =false;
             }
             _this.Data.totalCount = Number(response.data.meta.pagination.total);
             _this.Data.pageCurrent = Number(response.data.meta.pagination.current_page);
             _this.Data.pagesize = Number(response.data.meta.pagination.per_page);
             if (_this.Data.data.length == 0) {
               _this.topAgentId = _this.nowAgentId;
               _this.topAgentName =  _this.nowAgentName;
             } else {
               _this.topAgentName = _this.Data.data[0].topAgentName;
               _this.topAgentId = _this.Data.data[0].topAgentId;
             }
           }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dataCountHandle(){
        var _this = this;
        _this.countData.data = [];
        this.$ajax.get(this.countData.pageApi)
          .then(function (response) {
            _this.countData.data.push(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle(){
        if (this.timeValue[0] == null) {
          this.searchInfo.begin_at = '';
          this.searchInfo.end_at = '';
        } else {
          let timeS = this.timeValue[1].getTime() - this.timeValue[0].getTime();
          if (timeS > 3600 * 1000 * 24 * 7) {
            this.$notify.error({
              title: '错误',
              message: '查询时间间隔应小于7天',
              offset: 100
            });
            this.searchInfo.begin_at = '';
            this.searchInfo.end_at = '';
            this.timeValue = '';
          } else {
            this.searchInfo.begin_at = this.dataFormat(this.timeValue[0], "yyyy-MM-dd hh:mm:ss");
            this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss");
          }
        }
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

      getWarm: function () {
        var _this = this;
        this.$ajax.get(api.warmNot1)
          .then(function (response) {
            _this.warmData = response.data.data;
          })
          .catch(function (error) {
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
            _this.showEdit = false;
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
      addWarm: function () {
        var _this = this;
        this.$ajax({
          url: api.addWarm,
          method: 'post',
          data: {
            aid: 1,
            content: _this.addMsg
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.showAdd = false;
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
      onEditorChange({editor, html, text}) {
        this.warmMsg = html;
      },
      onEditorChange1({editor, html, text}) {
        this.addMsg = html;
      },
      editWarm: function (id, value) {
        this.warmId = id;
        this.warmMsg = value;
        this.showEdit = true;
      },

    },

    destroyed: function () {

    }
  }
</script>


