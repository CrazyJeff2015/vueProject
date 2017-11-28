<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="searchInfo.product" placeholder="所有类型" clearable>
            <el-option
              v-for="item in productInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <h3 class="panel-title" style="color: rgb(0, 141, 228);"><span v-text="time"></span>财务日报<span style="color: rgb(244, 67, 54);">（点击代理号查看下一级代理统计情况）</span>
        <el-button v-show="showTop" size="small" @click="backTopAgent()">返回上级代理</el-button>
      </h3>
      <el-table :data="Data.data" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="agent_aname" label="代理号">
          <template scope="scope">
            <a href="#" v-text="scope.row.agent_aname"
               @click.prevent="enterIndexAgent(scope.row.agent_id,scope.row.agent_aname)" v-if="scope.row.nextAgent==1&&scope.row.nextCommission!=0"></a>
            <span v-else v-text="scope.row.agent_aname"></span>
          </template>
        </el-table-column>
        <el-table-column prop="allCashCount" label="所有玩家金币变化">
          <template scope="scope">
            前:<span v-text="scope.row.allCashCount"></span>
            <br>后:<span class="red" v-text="scope.row.soleAllCashCount"></span>
          </template>
        </el-table-column>
        <el-table-column prop="cashCount" label="直接玩家金币变化">
          <template scope="scope">
            前:<span v-text="scope.row.cashCount"></span><br>后:<span class="red" v-text="scope.row.soleCashCount"></span>
          </template>
        </el-table-column>
        <el-table-column prop="nextCashCount" label="间接玩家金币变化">
          <template scope="scope">
            前:<span v-text="scope.row.nextCashCount"></span>
            <br>后:<span class="red" v-text="scope.row.soleNextCashCount"></span>
          </template>
        </el-table-column>
        <el-table-column prop="myCommission" label="直接会员收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.myCommission)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="nextCommission" label="间接会员总收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.nextCommission)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="soleCommissionCount" label="占比收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.soleCommissionCount)"></span>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="countData.data" border :show-header="false">
        <el-table-column>
          <template scope="scope">
            <span>总计:</span>
          </template>
        </el-table-column>
        <el-table-column prop="allCashCount" label="所有玩家金币变化">
          <template scope="scope">
            前:<span v-text="scope.row.allCashCount"></span>
            <br>后:<span class="red" v-text="scope.row.soleAllCashCount"></span>
          </template>
        </el-table-column>
        <el-table-column prop="cashCount" label="直接玩家金币变化">
          <template scope="scope">
            前:<span v-text="scope.row.cashCount"></span><br>后:<span class="red" v-text="scope.row.soleCashCount"></span>
          </template>
        </el-table-column>
        <el-table-column prop="nextCashCount" label="间接玩家金币变化">
          <template scope="scope">
            前:<span v-text="scope.row.nextCashCount"></span>
            <br>后:<span class="red" v-text="scope.row.soleNextCashCount"></span>
          </template>
        </el-table-column>
        <el-table-column prop="myCommission" label="直接会员收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.myCommission)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="nextCommission" label="间接会员总收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.nextCommission)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="soleCommissionCount" label="总收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.soleCommissionCount)"></span>
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
    </el-card>
  </div>
</template>
<script>
  import api from '../../request/api';
  export default {

    name: "agent_statistics",
    data() {
      return {
        month: '',
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

        productInfo: [],
        topAgentId: '',
        topAgentName: '',
        nowAgentId: '',
        nowAgentName: '',
        indexId: 0,
        showTop: false
      }
    },
    props: ['time'],
    mounted: function () {
        console.log(this.time)
//      let now = new Date();
//      let year = now.getFullYear().toString();
//      let monthV = now.getMonth() + 1;
//      monthV.toString()
//      let time = year + '-' + monthV;
//      this.month = time;
//      this.time = time;
      this.getProduct();
      this.getData();
    },

    methods: {
      checkYear(year){
        this.time = year;
      },
      backTopAgent(){
        this.indexId = this.topAgentId;
        this.getData();
      },
      enterIndexAgent(id, name){
        this.nowAgentId = JSON.parse(JSON.stringify(this.indexId))
        this.nowAgentName = JSON.parse(JSON.stringify(name))
        this.indexId = id;
        this.topAgentName = name;
        this.showTop = true;
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
        this.searchInfo.begin_at  = this.time + ' 00:00:00';
        this.searchInfo.end_at  = this.time + ' 23:59:59';
        this.Data.pageApi = api.adminMoneyDay + '/' + this.indexId + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.countData.pageApi = api.adminMoneyDayC + '/' +this.indexId  +'?'+ this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {
        this.Data.pageApi = api.adminMoneyDay + '/' + this.indexId + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        this.dataCountHandle();
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
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
            _this.countData.data = [];
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

    },
    computed: {

    },

    destroyed: function () {

    }
  }
</script>


