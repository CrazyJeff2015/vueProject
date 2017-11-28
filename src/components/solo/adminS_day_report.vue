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
          <el-switch
            v-model="thisWeek"
            on-text="本周"
            off-text="上周"
            @change="onSwitchChange">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="Data.data" border style="width: 100%; margin-top: 20px">

        <el-table-column prop="time" label="日期">
        </el-table-column>
        <el-table-column prop="score_change" label="用户金币总变化">
        </el-table-column>
        <el-table-column prop="commission" label="总收益">
          <template scope="scope">
            <a href="#" @click.prevent="getPart(scope.row.time)" v-text="-1*Number(scope.row.commission)"></a>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="详情" size="large" :visible.sync="showDetail" :show-close="false">
      <part v-if="part.show" :time="part.time"></part>
      <div style="text-align: right">
        <el-button @click="showDetail = false,part.show=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../request/api';
  import part from "./admin_indxe_part.vue";
  export default {
    name: "agent_statistics",
    components: {
      part
    },
    data() {
      return {
        month: '',
        timeValue: '',
        time:'',
        Data: {
          data: [],
          pageApi:''
        },
        countData:{
          data:[],
          pageApi:''
        },
        searchInfo: {
          product: '',
          week:0
        },
        thisWeek:true,
        productInfo: [],
        topAgentId: '',
        topAgentName: '',
        nowAgentId: '',
        nowAgentName: '',
        indexId: 0,
        showDetail: false,
        part:{
            time:'',
            show:false
        }
      }
    },
    mounted: function () {
      this.getProduct();
      this.getData();
    },

    methods: {
      onSwitchChange(){

          this.thisWeek==true?this.searchInfo.week=0:this.searchInfo.week=1;
          this.getData()
      },

      getPart(time){
          this.part.time = time;
          this.showDetail = true;
          this.part.show = true;
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
      getData() {
        this.Data.pageApi = api.adminDaySCount  + '?' + this.parseParam(this.searchInfo);

        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
             var obj = [];
             for(var k in response.data.data){
                  var  part = response.data.data[k];
                  part.time  = k;
                  obj.push(part)
             }
            _this.Data.data = obj;
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
    computed: {

    },

    destroyed: function () {

    }
  }
</script>


