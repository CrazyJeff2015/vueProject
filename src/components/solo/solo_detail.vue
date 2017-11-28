<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>代理链接</span>
      </div>
      <table id="mytable" class="table table-striped table-bordered table-hover text-center">
        <thead>
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">类型</th>
          <th class="text-center">代理链接</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in agentLinks">
          <td v-text="index+1"></td>
          <td v-text="item.type"></td>
          <td>
            <a target="_blank" :href="'http://'+item.link" v-text="'http://'+item.link"></a>
          </td>
        </tr>
        <tr v-if="aId!=1||pId!=1" v-for="(item,index) in secLinks">
          <td v-text="agentLinks.length + index + 1"></td>
          <td v-text="item.name"></td>
          <td>
            <a target="_blank" :href="'http://'+item.cname" v-text="'http://'+item.cname"></a>
          </td>
        </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <el-row>
        <el-col :span="12">
          <p>
            代理账号：<span style="color: red">{{ loginAgentName }}</span>
          </p>
          <p>
            抽佣比例：<span style="color: red">{{ loginScale }}</span>
          </p>
          <p>
            可用资产：<span style="color: red">{{ soleScore }}</span>
          </p>
          <p>未结算资产: <span style="color: red" v-text="noChange"></span>
          <p>
            用户状态：<span style="color: red">正常</span>
          </p>
          <p>
            建立时间：<span style="color: red">{{ createdAt }}</span>
          </p>
          <p>
            最后登陆时间：<span style="color: red">{{ lastLoginTime }}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p>
            姓名：<span style="color: red">**</span>
          </p>
          <p>
            邮箱：<span style="color: red" v-text="email"></span>
          </p>
          <p>
            qq：<span style="color: red" v-text="qq"></span>
          </p>
          <p>手机：<span style="color: red" v-text="cell"></span>
          </p>
        </el-col>
      </el-row>

    </el-card>



    <!--main content ends-->
  </div>
</template>
<script>
  import api from '../../request/api';
  export default {
    name: "agent_detail",

    data () {
      var validateUrl = (rule, value, callback) => {
        var reg = /^(?=^.{3,255}$)(www\.)[a-zA-Z0-9][-a-zA-Z0-9]{1,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{1,62})+$/;
        if (value === '') {
          callback(new Error('域名不能为空'));
        } else if (reg.test(value) == false) {
          callback(new Error('请输入正确的域名,不需要加http://'));
        } else {
          callback();
        }
      };
      return {
        agentStatuss: [],
        agentLinks: [],
        secLinks: [],
        contentInfo: '',
        contentId: '',
        linkId: '',
        linkContent: '',
        addData: {
          type: '',
          link: ''
        },
        noChange:'',
        editData: {
          id: '',
          type: '',
          link: ''
        },
        rules: {
          link: [
            {validator: validateUrl, trigger: 'change'}
          ]
        },
        Data: {
          data: [],
          totalCount: 20,
          pageCurrent: 1,
          pagesize: 10,
          pageApi: ''
        },
        addLink: '',
        addType: '',
        addMsg: '',
        showTex: true,
        agentContents: '',
        subTex: '',
        delId: '',
        showAdd: false,
        showEdit: false,
        showAurl: false,
        editType: '',
        editorOption: {},
        inData: {}
      }
    },

    mounted: function () {

      this.getLinks();
      this.getSeclinks();
//      this.getContents();
//      this.getInData();
//      this.getData();
      this.dataHandle1()

    },
    computed: {

      loginId: function () {
        return this.$store.state.login.loginData.loginId;
      },
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
      isSole: function () {
        return this.$store.state.login.loginData.isSole;
      },
      createdAt:function () {
        return this.$store.state.login.loginData.createdAt;
      },
      lastLoginTime:function () {
        return this.$store.state.login.loginData.lastLoginTime;
      },
      soleScore: function () {
        return this.$store.state.login.loginData.soleScore;
      },
      qq: function () {
        return this.$store.state.login.loginData.qq;
      },
      cell: function () {
        return this.$store.state.login.loginData.cell;
      },
      email: function () {
        return this.$store.state.login.loginData.email;
      },
    },
    methods: {
      dataHandle1(){
        var _this = this;
        this.$ajax.get(api.soloMoneyList+'0')
          .then(function (response) {
            var data = response.data.data;
            for(var i=0;i<data.length;i++){
              if(data[i].status!==1){
                _this.noChange += data[i].after_score;
              }
            }
            _this.noChange = -1*Number(_this.noChange)
          })
          .catch(function (error) {
            console.log(error);
          });
      },
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
      getInData(){
        let _this = this;
        this.$ajax.get(api.soloInCount).then(function (response) {
          _this.inData = response.data.data.data;
        })
      },
      getLinks: function () {
        //获取代理链接
        var _this = this;
        this.$ajax.get(api.agentLinkList)
          .then(function (response) {
            _this.agentLinks = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getSeclinks: function () {
        //获取非100%代理链接
        var _this = this;
        this.$ajax.get(api.secLinkList)
          .then(function (response) {
            _this.secLinks = response.data.data;
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


