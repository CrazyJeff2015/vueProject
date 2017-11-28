<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>游戏信息</span>
      </div>
      <div class="row">
        <div class="col-md-12 table-responsive">
          <table class="table  table-bordered">
            <tbody>
            <tr v-for="item in data3">
              <td>
                <span>游戏：</span><span v-text="item.ganme_name"></span><br>
                <span>共计：</span> <span v-text="item.game_num"></span>
               <div>
                <span class="margin-30">赢局：</span>
                 <span v-text="item.win"></span> <span class="margin-30">输局：</span><span v-text="item.fail"></span> <span class="margin-30">和局：</span><span v-text="item.tie"></span>
               </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-card>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="选择时间范围"
            align="center"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchInfo.gid" placeholder="全部游戏" clearable>
            <el-option
              v-for="item in gameTypeList"
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
      <el-table
        :data="Data.data" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="game_name" label="所在游戏">
        </el-table-column>
        <el-table-column prop="room" label="所在房间">
        </el-table-column>
        <el-table-column prop="desk" label="桌子编号">
        </el-table-column>
        <!--<el-table-column prop="chair" label="椅子编号">-->
        <!--</el-table-column>-->
        <el-table-column prop="join_score" label="进入金币">
        </el-table-column>
        <el-table-column prop="score_change" label="金币变化">
        </el-table-column>
        <el-table-column prop="commision" label="佣金">
        </el-table-column>
        <el-table-column prop="time" label="游戏时长">
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间">
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间">
        </el-table-column>
        <el-table-column prop="status" label="状态">
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
    name: "userGameList",
    data: function () {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > (Date.now()+3600 * 1000 * 24);            return timeFlag;
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
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeValue: '',
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchInfo: {
          begin_at: '',
          end_at: '',
          gid:''
        },
        gameTypeList:[],
        data3:[]
      }
    },
    props: ['uid'],
    mounted: function () {
      this.getGanmeInfo();
   this.getData()
    },

    methods: {
      getData(val) {
        this.Data.pageApi = api.getGameList + this.uid + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize  + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.getGameList + this.uid + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize)  + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data;
            _this.gameTypeList = response.data.game_type;
            _this.Data.totalCount = Number(response.data.meta.total);
            _this.Data.pageCurrent = Number(response.data.meta.current_page);
            _this.Data.pagesize = Number(response.data.meta.per_page);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      dateHandle(){
        this.timeValue[0] == null ? (this.searchInfo.begin_at = '', this.searchInfo.end_at = '')
          : ( this.searchInfo.begin_at = this.dataFormat(this.timeValue[0], "yyyy-MM-dd hh:mm:ss"), this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss"))

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
      //获取游戏信息
      getGanmeInfo: function () {

        var requestUrl = api.getGameInfo + this.uid;
        var _this = this;
        this.$ajax.get(requestUrl)
          .then(function (response) {
            _this.data3 = response.data.data;
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
  .table-bordered {
    font-size: 16px;
  }
</style>


