<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item  label="用户ID">
          <el-input v-model="searchInfo.uid" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="房间">
          <el-select v-model="searchInfo.gid" placeholder="请选择" clearable>
            <el-option
              v-for="item in productInfo"
              :key="item.d"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        <el-table-column
          prop="id"
          label="索引">
        </el-table-column>
        <el-table-column prop="uid" label="UID">
        </el-table-column>
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
    name: "",
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
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        switchValue:true,
        searchTxt:'',
        searchType:'',
        searchInfo: {
          begin_at: '',
          end_at: '',
          gid: '',
          uid:'',
          gaccount:'',
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
      this.getData()
    },
    methods: {
      switchChange(){
        this.switchValue==true?this.searchInfo.preg=1:this.searchInfo.preg=0;
      },

      getData(val) {
//        this.searchInfo.uid = '';
//        this.searchInfo.aname = '';
//        this.searchInfo.gaccount = '';
//        for(var k in this.searchInfo){
//          if(k==this.searchType){
//            this.searchInfo[k] = this.searchTxt;
//          }
//        }
        this.Data.pageApi = api.allGameLog + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.allGameLog + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data||[];
            _this.productInfo =response.data.game_type||[];
            _this.Data.totalCount = (response.data.meta === undefined?0:Number(response.data.meta.total));
            _this.Data.pageCurrent = (response.data.meta===undefined?1:Number(response.data.meta.current_page));

            _this.Data.pagesize = response.data.meta===undefined?10:Number(response.data.meta.per_page);
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


