<template>
  <el-card>
    <el-form :inline="true">
    <el-form-item label="类型">
      <el-select v-model="searchInfo.type" placeholder="请选择" clearable @change="cType">
        <el-option
          v-for="item in typeInfo"
          :key="item.name"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <el-table :data="Data.data" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="date" label="时间段">
        <template scope="scope">
          <span v-text="scope.row.start"></span><br>
          <span v-text="scope.row.end"></span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总计">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.total)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="unsettled" label="未结算">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.unsettled)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="settlement" label="已结算">
        <template scope="scope">
          <span v-text="-1*Number(scope.row.settlement)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="adj_score" label="调整金额">
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
  import api from '../../request/api';
    export default {
      name: "",
        mounted: function () {
          this.getData()
        },
        methods: {
          cType(){
            console.log(this.searchInfo.type)
            this.getData()
          },
          getData() {
            this.Data.pageApi = api.soleWorkData + '?'+this.parseParam(this.searchInfo);
            this.dataHandle();
          },
          dataHandle(){
            var _this = this;
            this.$ajax.get(this.Data.pageApi)
              .then(function (response) {
                for(var k in response.data){
                    _this.Data.data.push(response.data[k])
                }
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
            return paramStr.substr(1);

          },
        },
        destroyed: function () {

        },
        data: function () {
            return {
              Data: {
                data: []
              },
              searchInfo:{
                  type:''
              },
              typeInfo:[
                {
                  id:' ',
                  name:'所有'
                },
                {
                  id:'my',
                  name:'自身'
                },
                {
                  id:'other',
                  name:'代运营'
                }
              ],
            }
        }
    }
</script>
<style type="text/css" scoped>

</style>


