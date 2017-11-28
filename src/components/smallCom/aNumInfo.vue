<template>
  <div class="box-card">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="所属代理">
        <el-input v-model="agentName" disabled></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="Data.data" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="aid" label="代理ID">
      </el-table-column>
      <el-table-column prop="aname" label="代理号">
      </el-table-column>
      <el-table-column prop="scale" label="佣金比例">
      </el-table-column>
      <el-table-column prop="sole_scale" label="占成比例">
      </el-table-column>
      <el-table-column prop="score" label="代理资产">
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间">
      </el-table-column>
      <el-table-column prop="is_on" label="状态">
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
  </div>
</template>

<script>
  import api from '../../request/api';
  export default {
    name: "",
    props: ['id', 'agentName'],
    mounted: function () {
      this.getData()
    },
    computed: {

      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },

    },
    methods: {
      getData(val) {
        this.Data.pageApi = api.aNumInfo + this.id + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + "&" + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.aNumInfo + this.id + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + "&" + this.parseParam(this.searchInfo);
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
        return paramStr.substr(1);

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    destroyed: function () {

    },
    data: function () {
      return {

        timeValue: '',
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },

        cusId: '',
        searchInfo: {
          begin_at: '',
          end_at: '',
          gaccount: '',
        },
        showDialog: false
      }
    }
  }
</script>



