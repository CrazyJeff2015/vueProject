<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>用户日志记录</span>
      </div>
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="time" label="操作时间">
        </el-table-column>
        <el-table-column prop="type" label="操作类型">
        </el-table-column>
        <!--<el-table-column prop="user" label="操作员">-->
        <!--</el-table-column>-->
        <el-table-column prop="ip" label="操作地址">
        </el-table-column>
        <el-table-column prop="location" label="区域">
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
    name: "userLogList",
    data: function () {
      return {
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
      }
    },
    props: ['uid'],
    mounted: function () {
      this.getData()

    },

    methods: {
      getData(val) {
        this.Data.pageApi = api.getUserLog + this.uid + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize ;
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getUserLog + this.uid + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.Data.totalCount = Number(response.data.meta.total);
            _this.Data.pageCurrent = Number(response.data.meta.current_page);
            _this.Data.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    },
    destroyed: function () {

    }

  }
</script>
<style type="text/css" scoped>
  .col-6{
    display: inline-block;
    width: 49%;
    vertical-align: middle;
  }
</style>


