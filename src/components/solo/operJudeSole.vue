<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true">
        <el-form-item label="代理号">
          <el-input v-model="searchInfo.aname" placeholder="请输入代理号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchInfo.status" placeholder="请选择" clearable>
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
      </el-form>
      <el-form :inline="true" v-if="permissions.oper_fast_juge">
        <el-form-item label="金额">
          <el-input v-model="score" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :plain="true"  @click="judgeList()">快速审批</el-button>
        </el-form-item>
        <el-form-item>
          <span style="color: red;font-size: 12px;">tips:小于此金额的收益将自动审批</span>
        </el-form-item>
      </el-form>
      <el-button v-if="permissions.update_profit" @click="fastJudge()">批量审批</el-button>  <span style="color: red;font-size: 12px;">tips:占成结算收益将会从您的代运营余额中扣除</span>
      <el-table ref="selectArr" :data="Data.data" border style="width: 100%; margin-top: 20px" @sort-change="sortHandle"  @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="aname" label="代理号">
        </el-table-column>
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
        <el-table-column prop="after_score" sortable="custom" label="最终收益">
          <template scope="scope">
            <span v-text="-1*Number(scope.row.after_score)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span v-text="soloStatus(scope.row.status)"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="primary" :plain="true" v-if="scope.row.status==2&&permissions.update_profit&&scope.row.type==1"
                       @click="getMoney(scope.row)">批准
            </el-button>
            <!--<el-button type="primary" :plain="true" v-if="scope.row.status==2&&permissions.update_profit"-->
            <!--@click="rejectCon(scope.row)">驳回-->
            <!--</el-button>-->
            <!--<el-button type="primary" :plain="true" v-if="scope.row.status==3&&permissions.adj_score"-->
            <!--@click="changeCon(scope.row)">调整-->
            <!--</el-button>-->
          </template>
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
    <el-dialog title="批准收益" :visible.sync="showAgree" :show-close="false">
      <el-form :model="agreeData" ref="agreeData" label-width="90px" size="small">
        <el-form-item label='代理号'>
          <span v-text="detailData.aname"></span>
        </el-form-item>
        <el-form-item label='时间段'>
          <span v-text="detailData.start + '~' + detailData.end"></span>
        </el-form-item>
        <el-form-item label='金额'>
          <span v-text="-1*Number(detailData.score)"></span>
        </el-form-item>
        <el-form-item label='调整金额' prop="adj_score">
          <el-input type="text" v-model="agreeData.adj_score" auto-complete="off"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item label='备注' prop="note">
          <el-input
            type="textarea"
            :rows="4"
            placeholder=""
            v-model="agreeData.note">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('agreeData'),showAgree = false;">取 消</el-button>
        <el-button type="primary" @click="agree()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="驳回原因" :visible.sync="showNo" :show-close="false">
      <el-form :model="rejectData" ref="rejectData" label-width="90px" size="small">
        <el-form-item label='代理号'>
          <span v-text="detailData.aname"></span>
        </el-form-item>
        <el-form-item label='时间段'>
          <span v-text="detailData.start + '~' + detailData.end"></span>
        </el-form-item>
        <el-form-item label='金额'>
          <span v-text="-1*Number(detailData.score)"></span>
        </el-form-item>
        <el-form-item label='备注' prop="note">
          <el-input
            type="textarea"
            :rows="4"
            placeholder=""
            v-model="rejectData.note">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('rejectData'),showNo = false;">取 消</el-button>
        <el-button type="primary" @click="reject()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="结算调整" :visible.sync="showChange" :show-close="false">
      <el-form :model="rejectData" ref="rejectData" label-width="90px" size="small">
        <el-form-item label='代理号'>
          <span v-text="detailData.aname"></span>
        </el-form-item>
        <el-form-item label='时间段'>
          <span v-text="detailData.start + '~' + detailData.end"></span>
        </el-form-item>
        <el-form-item label='金额'>
          <span v-text="-1*Number(detailData.score)"></span>
        </el-form-item>
        <el-form-item label='调整金额' prop="adj_score">
          <el-input type="text" v-model="changeData.adj_score" auto-complete="off"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item label='备注' prop="note">
          <el-input
            type="textarea"
            :rows="4"
            placeholder=""
            v-model="changeData.note">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('changeData'),showChange= false;">取 消</el-button>
        <el-button type="primary" @click="change()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../request/api';
  export default {
    data () {

      return {

        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        searchType:'',
        typeInfo:[
          {
            id:'0',
            name:'未提取'
          },
          {
            id:'1',
            name:'已结算'
          },
          {
            id:'2',
            name:'待处理'
          }
        ],
        searchInfo:{
          status:'',
          aname:'',
          sort:'',
          type:''
        },
        judeInfo:[
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
        showChange: false,
        showNo: false,
        showAgree: false,
        changeId: '',
        rejectId: '',
        agreeId: '',
        detailData: {},
        changeData: {
          type: 1,
          note: '',
          adj_score: ''
        },
        agreeData: {
          type: 1,
          note: '',
          adj_score: ''
        },
        rejectData: {
          type: 3,
          note: ''
        },
        selectArr:[],
        busCount:0,
        score:''

      }
    },

    mounted: function () {

      this.getData();

    },
    computed: {


      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },

      loginAgentName: function () {
        return this.$store.state.login.loginData.loginAgentName;
      },

      loginScore: function () {
        return this.$store.state.login.loginData.loginScore;
      },
      permissions: function () {
        return this.$store.state.permissions.permissionsData;
      },
      isOper: function () {
        return this.$store.state.login.loginData.isOperate;
      },
      pId: function () {
        return this.$store.state.login.loginData.pId;
      },
      aId: function () {
        return this.$store.state.login.loginData.loginId;
      },
    },
    methods: {
      judgeList(){
        if(this.score==''){
          return false;
        }
        let _this = this;
        this.$ajax({
          url: api.operFastJudge,
          method:'post',
          data: {
            score: _this.score
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })

      },
      fastJudge(){
        for(var i=0;i<this.selectArr.length;i++){
          this.agreeBus(this.selectArr[i])
        }
      },
      handleSelectionChange(val) {

        var arr = [];
        var arr1 = [];
        this.busCount=0;
        this.selectArr = [];
        for(var i=0;i<val.length;i++){
          if(val[i].status==2&&val[i].type==1){
            arr.push(val[i].id)
            this.busCount++;
          }else {
            arr1.push(val[i])
          }
        }
        arr1.forEach(arr1 => {
          this.$refs.selectArr.toggleRowSelection(arr1);
        });

        this.selectArr = arr;
      },
      sortHandle(value){
        value.order == 'descending' ? this.searchInfo.sort = 'desc' : this.searchInfo.sort = 'asc';
        this.getData();
      },
      agreeBus(id){
        let _this = this;
        this.$ajax({
          url: api.getSoloMoney + id,
          method:'PUT',
          data: {
            type: 1
          }
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.busCount--;
            if(_this.busCount==0){
              _this.getData();
              _this.$message({
                type: 'success',
                message: '操作成功!'
              });
            }
          }
        })

      },
      agree(){
        this.agreeData = this.checkObj(this.agreeData)
        let _this = this;
        this.$ajax({
          url: api.getSoloMoney + _this.agreeId,
          method:'PUT',
          data: _this.agreeData
        }).then(function (response) {
          if (response.data.code == 200) {

            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.showAgree= false;
          }
        })

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeCon(obj){
        this.detailData = obj;
        this.changeId = obj.id;
        this.showChange = true;

      },
      change()
      {
        this.changeData = this.checkObj(this.changeData)
        let _this = this;
        this.$ajax({
          url: api.getSoloMoney + _this.changeId,
          method: 'put',
          data: _this.changeData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.changeData.note = '';
            _this.showChange = false;
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })


      },
      reject(){
        this.rejectData = this.checkObj(this.rejectData)
        let _this = this;
        this.$ajax({
          url: api.getSoloMoney + _this.rejectId,
          method: 'put',
          data: _this.rejectData
        }).then(function (response) {
          if (response.data.code == 200) {
            _this.rejectData.note = '';
            _this.showNo = false;
            _this.getData();
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })

      },
      rejectCon(obj){
        this.detailData = obj;
        this.rejectId = obj.id;
        this.showNo = true;
      },
      getMoney(obj){
        this.detailData = obj;
        this.agreeId = obj.id;
        this.showAgree = true;
      },
      checkObj(obj){
        var new_obj = {};
        for (var k in obj) {
          if (obj[k] !== '') {
            new_obj[k] = obj[k]
          }
        }
        return new_obj;
      },
      soloStatus(value){
        switch (value) {
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
        this.Data.pageApi = api.operSoleJudge + '?page=' + (val ? val : this.Data.pageCurrent) + '&limit=' + this.Data.pagesize+this.parseParam(this.searchInfo);
        this.dataHandle();
      },
      getSize(val) {
        this.Data.pageApi = api.operSoleJudge + '?page=' + this.Data.pageCurrent + '&limit=' + (val ? val : this.Data.pagesize)+this.parseParam(this.searchInfo);
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
        return paramStr;

      },

    },
    destroyed: function () {

    }
  }

</script>
<style type="text/css" scoped>

</style>


