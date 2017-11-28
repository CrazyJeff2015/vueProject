<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="变化时间">
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
            <el-switch
              v-model="switchValue"
              on-text="精确"
              off-text="模糊"
              @change="switchChange">
            </el-switch>
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
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="变动时间">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作者">
        </el-table-column>
        <el-table-column
          prop="aname"
          label="代理号">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="ID/账号">
          <template scope="scope">
            <span>{{scope.row.uid}}/{{scope.row.user_account}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="score_change"
          label="变动金额">
        </el-table-column>
        <el-table-column
          prop="after_change"
          label="变动后余额">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作地址" v-if="loginId==1||pId==1">
        </el-table-column>
        <el-table-column
          prop="location"
          label="区域" v-if="loginId==1||pId==1">
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注">
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
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        switchValue:true,
        searchTxt:'',
        searchType:'aname',
        searchInfo: {
          begin_at: '',
          end_at: '',
          type: '',
          preg:1,
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
        productInfo: [{
          name:'上分',
          id:'1'
        },
          {
            name:'代充',
            id:'7'
          },
          {
            name:'佣金扣减',
            id:'6'
          },

          {
            name:'金币转换',
            id:'3'
          },
          {
            name:'上级代运营转账',
            id:'5'
          },
          {
            name:'顶层操作(出)',
            id:'2'
          },
          {
            name:'顶层操作(进)',
            id:'4'
          }
        ],
      }
    },
    computed: {

      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
      pId:function () {
        return this.$store.state.login.loginData.pid;
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
        this.searchInfo.uid = '';
        this.searchInfo.aname = '';
        this.searchInfo.gaccount = '';
        for(var k in this.searchInfo){
          if(k==this.searchType){
            this.searchInfo[k] = this.searchTxt;
          }
        }
        this.Data.pageApi = api.oPayLog + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize + this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {

        this.Data.pageApi = api.oPayLog + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize) + this.parseParam(this.searchInfo);
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


