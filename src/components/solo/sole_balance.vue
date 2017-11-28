<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>结算详情</span>
      </div>
      <el-table :data="Data.data" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="start" label="开始">
        </el-table-column>
        <el-table-column prop="end" label="结束">
        </el-table-column>
        <el-table-column prop="score" label="结算收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.score)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="adj_score" label="调整金额">
        </el-table-column>
        <el-table-column prop="after_score" label="最终受益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.after_score)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span v-text="soloStatus(scope.row.status)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
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

    <!--main content ends-->
  </div>
</template>
<script>
  import api from '../../request/api';
  export default {
    name: "agent_detail",

    data () {

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

    mounted: function () {


      this.getData();

    },
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    methods: {
      getMoney(id){
        let _this = this;
        this.$confirm('提取该收益, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url:api.getSoloMoney+id,
            method:'put',
            data:{
              type:2,
              aid:_this.loginId
            }
          }).then(function (response) {
            if(response.data.code==200){
              _this.getData();
              _this.$message({
                type: 'success',
                message: '操作成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      },
      soloStatus(value){
        switch (value){
          case 0:
            return '未提取';
            break;
          case 1:
            return '已结算';
            break;
          case 2:
            return '待处理';
            break;
          case 3:
            return '驳回';
            break;
        }

      },
      getData(val) {
        this.Data.pageApi = api.soloMoneyList + '0?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize;
        this.dataHandle();
      },
      getSize(val) {
        this.Data.pageApi = api.soloMoneyList + '0?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize);
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



      resetForm(formName) {
        this.$refs[formName].resetFields();
      },






    },
    destroyed: function () {

    }
  }

</script>


