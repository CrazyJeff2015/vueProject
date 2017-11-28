<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>代理链接</span>
      </div>
      <table class="table table-striped table-bordered table-hover text-center">
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
        <tr  v-for="(item,index) in secLinks">
          <td v-text="agentLinks.length + index + 1"></td>
          <td>自有域名</td>
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
        抽佣比例：<span style="color: red">{{ loginScale }}%</span>
      </p>
          <p>
            占成比例：<span style="color: red">{{ soloScale }}%</span>
          </p>
      <p>
        可用资产：<span style="color: red">{{ loginScore }}</span>
      </p>
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
  import api from '../request/api';
  export default {
    name: "agent_detail",
    data () {

      return {
        agentStatuss: [],
        agentLinks: [],
        secLinks: [],
        contentInfo: '',
        contentId: '',
        linkId: '',
        linkContent: '',
        addData:{
          type:'',
          link:''
        },
        editData:{
          id:'',
          type:'',
          link:''
        },
        addLink: '',
        addType: '',
        addMsg:'',
        showTex: true,
        agentContents: '',
        subTex: '',
        delId: '',
        showAdd: false,
        showEdit:false,
        showAurl:false,
        editType:'',
        editorOption: {

        }
      }
    },

    mounted: function () {

      this.getLinks();
//      this.getSeclinks();
//      this.getContents();

    },
    computed: {
      loginScale: function () {
        return this.$store.state.login.loginData.loginScale;
      },
      loginIsOn:function () {
        return this.$store.state.login.loginData.loginIsOn;
      },
      soloScale: function () {
        return this.$store.state.login.loginData.sole_scale;
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
      isOper:function(){
        return this.$store.state.login.loginData.isOperate;
      },
      pId:function(){
        return this.$store.state.login.loginData.pId;
      },
      aId:function(){
        return this.$store.state.login.loginData.loginId;
      },
      createdAt:function () {
        return this.$store.state.login.loginData.createdAt;
      },
      lastLoginTime:function () {
        return this.$store.state.login.loginData.lastLoginTime;
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




//    余额状态
      checkmoney:function (val) {
        if(val>=0){
            return '正常'
        }else {
          return '异常'
        }
      },

      getStatuss: function () {
        //获取代理状态
        var _this = this;
        this.$ajax.get(api.agentStatus)
          .then(function (response) {
            _this.agentStatuss = response.data.data;
            //console.log(_this.agentStatuss);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getLinks: function () {
        //获取代理链接
        var _this = this;
        this.$ajax.get(api.myLink)
          .then(function (response) {
            _this.agentLinks = response.data.link;
            _this.secLinks = response.data.cname;
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


