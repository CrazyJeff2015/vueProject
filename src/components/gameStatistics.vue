<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="代理号" v-if="pid==1||loginId==1">
          <el-autocomplete
            v-model="searchInfo.aname"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="日期查询">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="选择时间范围"
            align="left"
            @change="dateHandle()">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="Data.data"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column prop="game_type" label="游戏类型">
        </el-table-column>
        <el-table-column prop="rome_type" label="[ID]房间类型">
          <template scope="scope">
            <div>[{{scope.row.rid}}]{{scope.row.rome_type}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="history_service" label="历史输赢金币总计">
        </el-table-column>
        <el-table-column prop="history_win_lose" label="历史服务费总计">
        </el-table-column>
        <el-table-column prop="today_win_lose" label="今日输赢金币总计">
        </el-table-column>
        <el-table-column prop="today_service" label="今日服务费总计">
        </el-table-column>
      </el-table>
      <el-table
        :data="Data.count"
        border
        style="width: 100%;"
        :show-header="false">
        <el-table-column prop="game_type" label="游戏类型">
        </el-table-column>
        <el-table-column label="房间类型">
          <template scope="scope">
            <span>合计:</span>
          </template>
        </el-table-column>
        <el-table-column prop="history_service" label="历史输赢金币总计">
        </el-table-column>
        <el-table-column prop="history_win_lose" label="历史服务费总计">
        </el-table-column>
        <el-table-column prop="today_win_lose" label="今日输赢金币总计">
        </el-table-column>
        <el-table-column prop="today_service" label="今日服务费总计">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "",
    computed: {
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      pid: function () {
        return this.$store.state.login.loginData.pid;
      },
      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },

    },
    data: function () {
      return {
        pickerOptions2: {
          disabledDate: (time) => {
            let timeFlag = time.getTime() > (Date.now()+3600 * 1000 * 24);            return timeFlag;
          },
          shortcuts: [{
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
          },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                const date = new Date();
                const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
                const dateStr = [year, month, day].join('-');
                const a = new Date(dateStr);
                start.setTime(a.getTime() - 3600 * 1000 * 32);
                end.setTime(a.getTime() - 3600 * 1000 * 8);
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
            }]
        },
        timeValue: '',
        month:'',
        Data: {
          data: [],
          count:[],
          pageApi: ''
        },
        restaurants: [],
        state4: '',
        timeout:  null,
        switchValue:true,
        searchTxt:'',
        searchType:'',
        aNameArr:[],
        searchInfo: {
          begin_at: '',
          end_at: '',
          aname:''
        },
        typeInfo:[{
          name:'代理号'
          ,id:'aname'
        },
          {
            id:'gaccount',
            name:'用户账号'
          },
          {
            id:'uid',
            name:'用户ID'
          },
        ],
        productInfo: []
      }
    },
    mounted: function () {
      if(window.location.hash.indexOf('?')>0){
          this.searchInfo.aname = window.location.hash.substr(window.location.hash.indexOf('?')+1);
      }
      this.getData()
    },
    methods: {

      querySearchAsync(queryString, cb) {
        var _this = this;
        this.$ajax.get(api.showAname+'?value='+_this.searchInfo.aname).
        then(function (response) {
          var arr = new Array;
          for(var i=0;i< response.data.data.length;i++){
            arr.push( response.data.data[i])
          }
          var results = queryString ? arr.filter(_this.createStateFilter(queryString)) : arr;
          cb(results);
        })

      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      getData() {

        this.Data.pageApi = api.gameCount + '?'+ this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.gameCount + '?'+ this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.count = [];
            _this.Data.data = response.data.data||[];
            _this.Data.count.push(response.data.total);
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
          this.searchInfo.begin_at = this.dataFormat(this.timeValue[0], "yyyy-MM-dd hh:mm:ss");
          this.searchInfo.end_at = this.dataFormat(this.timeValue[1], "yyyy-MM-dd hh:mm:ss");
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
    destroyed: function () {

    },

  }
</script>
<style type="text/css" scoped>

</style>


