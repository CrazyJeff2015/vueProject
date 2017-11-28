<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>代理统计</span>
      </div>
      <table class="table table-striped table-bordered table-hover sample">
        <tbody>
        <tr>
          <td width="25%">系统总代理数</td>
          <td width="25%">{{ statics.agent_count }}</td>
          <td width="25%">禁用代理总数</td>
          <td width="25%">
            <a href="#" data-toggle="modal" data-target="#today" data-placement="top"
               v-text="statics.agentdisable_count" @click.prevent="getStop()"></a>
          </td>
        </tr>
        <tr>
          <td>今日新增代理</td>
          <td>{{ statics.agenttody_count }}</td>
          <td>今日登录代理</td>
          <td><a href="#" v-text="statics.login_tody" @click.prevent="getToday()"></a></td>
        </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>佣金统计</span>
      </div>
      <table class="table table-striped table-bordered table-hover sample">
        <tbody>
        <tr>
          <td width="25%">累计总佣金</td>
          <td width="25%">{{ statics.total_score }}</td>
          <td width="25%">今日总佣金</td>
          <td width="25%">{{ statics.account }}</td>
        </tr>
        <tr>
          <td>当前总余额</td>
          <td>{{ statics.tady_account }}</td>
          <td>今日总转出</td>
          <td v-text="statics.today_out_total"></td>
        </tr>
        </tbody>
      </table>

    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>域名统计</span>
      </div>
      <table class="table table-striped table-bordered table-hover sample">
        <tbody>
        <tr>
          <td width="25%">累计自定义域名</td>
          <td width="25%">{{ statics.name }}</td>
          <td width="25%">新增自定义域名</td>
          <td width="25%">{{ statics.add_name }}</td>
        </tr>
        </tbody>
      </table>

    </el-card>
    <div>

      <!-- First Basic Table Ends Here-->
      <!--今日禁用-->
      <el-dialog title="今日禁用代理" :visible.sync="showStop" :show-close="false">
        <el-table
          :data="stopData.data"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="代理ID"
          >
          </el-table-column>
          <el-table-column
            prop="aname"
            label="代理号">
          </el-table-column>
        </el-table>
        <!-- 分页开始 -->
        <el-pagination
          @size-change="getStopSize"
          @current-change="getStop"
          :current-page="stopData.pageCurrent"
          :page-sizes="[10, 20]"
          :page-size="stopData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="stopData.totalCount">
        </el-pagination>
        <span slot="footer" class="dialog-footer">
    <el-button @click="showStop = false">关 闭</el-button>
  </span>
      </el-dialog>
      <!--今日登陆-->
      <el-dialog title="今日登陆代理" :visible.sync="showToday" :show-close="false">
            <el-table
              :data="todayData.data"
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
               >
              </el-table-column>
              <el-table-column
                prop="id"
                label="代理ID"
               >
              </el-table-column>
              <el-table-column
                prop="aname"
                label="代理号">
              </el-table-column>
            </el-table>
          <!-- 分页开始 -->
          <el-pagination
            @size-change="getTodaySize"
            @current-change="getToday"
            :current-page="todayData.pageCurrent"
            :page-sizes="[10, 20]"
            :page-size="todayData.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="todayData.totalCount">
          </el-pagination>
        <span slot="footer" class="dialog-footer">
    <el-button @click="showToday = false">关 闭</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "statistics",
    data: function () {
      return {
        statics: [],
        todayData: {
          data:[],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
        },
        stopData: {
          data:[],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
        },
        showToday: false,
        todayApi:'',
        stopApi:'',
        showStop: false
      }
    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
    },
    mounted: function () {
      "use strict";
      var _this = this;
      _this.getStatics();
    },
    methods: {
      //获得统计数据
      getStatics: function () {
        var _this = this;
        this.$ajax.get(api.statistics)
          .then(function (response) {
            _this.statics = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleSizeChange(val) {
        console.log(val);
      },
      getToday(val) {

        this.todayApi = api.todayLogin + '?page=' + (val?val:this.todayData.pageCurrent) + '&limit=' + this.todayData.pagesize;
        this.todayHandle();
      },

      getTodaySize(val) {

        this.todayApi = api.todayLogin + '?page=' + this.todayData.pageCurrent + '&limit=' + (val?val:this.todayData.pagesize);
        //搜索结束
        this.todayHandle();
      },
      todayHandle(){
        var _this = this;
        this.$ajax.get(this.todayApi)
          .then(function (response) {
            _this.showToday = true;
            _this.todayData.data = response.data.data;
            _this.todayData.totalCount = Number(response.data.meta.pagination.total);
            _this.todayData.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.todayData.pagesize = Number(response.data.meta.pagination.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      // 今日禁用
      getStop(val) {
        this.stopApi = api.stopLogin + '?page=' + (val?val:this.stopData.pageCurrent) + '&limit=' + this.stopData.pagesize;
        this.stopHandle();
      },
      getStopSize(val) {

        this.stopApi = api.stopLogin + '?page=' + this.stopData.pageCurrent + '&limit=' + (val?val:this.stopData.pagesize);
        //搜索结束
        this.stopHandle();
      },
      stopHandle(){
        var _this = this;
        this.$ajax.get(this.stopApi)
          .then(function (response) {
            _this.showStop = true;
            _this.stopData.data = response.data.data;
            _this.stopData.totalCount = Number(response.data.meta.pagination.total);
            _this.stopData.pageCurrent = Number(response.data.meta.pagination.current_page);
            _this.stopData.pagesize = Number(response.data.meta.pagination.per_page);

          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    destroyed: function () {

    }
  }
</script>

