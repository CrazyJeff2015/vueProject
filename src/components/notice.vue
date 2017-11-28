<template>
  <el-card>
    <div slot="header" class="clearfix" v-if="index!=1">
      <h4>系统公告</h4>
      <!--<el-button @click="showAdd=true" class="pull-right" size="small">新增公告</el-button>-->
    </div>
    <el-table
      :data="Data.data"
      border
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
      :class=" index ? 'index' : '' ">
      <el-table-column
        type="index"
        label="#"
        v-if="index!=1">
      </el-table-column>
      <el-table-column
        prop="title"
        :label="label">
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
      @size-change="getSize"
      @current-change="getData"
      :current-page="Data.pageCurrent"
      :page-sizes="[10,20]"
      :page-size="Data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Data.totalCount"
     v-if="index!=1">
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
  import api from '../request/api';
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
        showMsg: false,
        msgData: {},
        label:'标题',
        editorOption: {},
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
      this.getData();

    },
    methods: {

      show(item){
        this.msgData = item;
        this.showMsg = true;
      },
      getData(val) {
          if(this.index==1){
              this.label = '系统公告';
          }
        this.Data.pageApi = api.agentMQ + '?type=1&page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.agentMQ + '?type=1&page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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
</style>


