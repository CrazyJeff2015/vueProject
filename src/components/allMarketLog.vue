<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="类型">
          <el-select v-model="searchInfo.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in productInfo"
              :key="item.key"
              :label="item.name"
              :value="item.key">
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
        <div>
          <el-form-item>
            <el-input v-model="searchTxt" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchType" placeholder="查询类型">
              <el-option
                v-for="item in typeInfo"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :plain="true" icon="search" @click="getData()">搜 索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="Data.data"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="id"
          label="索引">
        </el-table-column>
        <el-table-column
          prop="time"
          label="变动时间">
        </el-table-column>
        <el-table-column
          prop="aname"
          label="代理号">
        </el-table-column>
        <el-table-column
          prop="gaccount"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="UID">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="withdrawal_amount"
          label="领取金额">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作地址">
        </el-table-column>
        <el-table-column
          prop="location"
          label="区域">
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
        Data: {
          data: [],
          totalCount: 10,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        switchValue:true,
        searchTxt:'',
        searchType:'gaccount',
        searchInfo: {
          begin_at: '',
          end_at: '',
          type: '',
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

      getData(val) {
        this.searchInfo.uid = '';
        this.searchInfo.aname = '';
        this.searchInfo.gaccount = '';
        for(var k in this.searchInfo){
          if(k==this.searchType){
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.allMarketLog + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.allMarketLog + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
        //搜索结束
        this.dataHandle();
      },
      dataHandle(){
        var _this = this;
        this.$ajax.get(this.Data.pageApi)
          .then(function (response) {
            _this.Data.data = response.data.data||[];
            if(response.data.type.length>0){
              _this.productInfo =response.data.type;
            }
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


