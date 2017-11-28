<template>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="row">
          <div class="col-md-8 table-responsive">
            <table class="table table-bordered">
              <tbody>
              <tr>
                <td class="text-left">
                  <span>用户ID：</span>
                  <span v-text="data1.uid"></span>
                  <span class="margin-30">用户账号：</span>
                  <span v-text="data1.gaccount"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>姓名：</span>
                  <span v-text="data1.id_name"></span>
                  <span class="margin-30">性别：</span>
                  <span v-text="sexFilter(data1.sex)"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>QQ：</span>
                  <span v-text="data1.qq"></span>
                  <span class="margin-30">email：</span>
                  <span v-text="data1.email"></span>
                  <span class="margin-30">tel：</span>
                  <span v-text="data1.tel"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span  v-show="!isOn==false">状态：</span>
                  <span  v-show="!isOn==false" v-text="isOn"></span>
                  <span class="margin-30">备注：</span>
                  <span v-text="data1.note"></span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-4 text-center">
            <img :src="userAvatar" alt="" class="avatar">
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>登录信息</span>
        </div>
        <div class="row">
          <div class="col-md-12 table-responsive">
            <table class="table table-bordered">
              <tbody>
              <tr v-show="!loginNum==false">
                <td class="text-left">
                  <span>大厅登录次数：</span>
                  <span v-text="loginNum"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>注册时间：</span>
                  <span v-text="data1.create_time"></span>
                  <span class="margin-30">地址：</span>
                  <span v-text="ip"></span>
                  <span class="margin-30">区域：</span>
                  <span v-text="location"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>最后登陆时间：</span>
                  <span v-text="data1.last_login_time"></span>
                  <span class="margin-30">地址：</span>
                  <span v-text="data1.last_login_ip"></span>
                  <span class="margin-30">区域：</span>
                  <span v-text="data1.last_login_location"></span>
                </td>
              </tr>
              <tr v-show="!noLogin==false">
                <td class="text-left">
                  <span v-text="noLogin"></span>天未登陆
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>游戏信息</span>
        </div>
        <div class="row">
          <div class="col-md-12 table-responsive">
            <table class="table table-bordered">
              <tbody>
              <tr v-for="item in data3">
                <td>
                  <span>游戏：</span><span v-text="item.ganme_name"></span><br>
                  <span>共计：</span><span v-text="item.game_num"></span><span class="margin-30">赢局：</span>
                  <span v-text="item.win"></span><span class="margin-30">输局：</span><span v-text="item.fail"></span><span class="margin-30">和局：</span><span v-text="item.tie"></span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>财务信息</span>
        </div>
        <div class="row">
          <div class="col-md-12 table-responsive">
            <table class="table table-bordered">
              <tbody>
              <tr>
                <td class="text-left">
                  <span>总金币：</span>
                  <span v-text="data1.total_score"></span>
                  <span class="margin-30">金币：</span>
                  <span v-text="data1.score"></span>
                  <span class="margin-30">银行：</span>
                  <span v-text="data1.bank_score"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>总充值：</span>
                  <span v-text="data1.total_deposit"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>总营销金币：</span>
                  <span v-text="data1.total_ccy"></span>
                  <span class="margin-30">当前锁定流水：</span>
                  <span v-text="data1.locked_flow"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>用户总输赢：</span>
                  <span v-text="data1.consume"></span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-card>
    </div>
</template>
<script>
  import api from '../request/api';
    export default {
        name: "userInfoList",
      data: function () {
        return {
          data:[],
          data1: [],
          data3: [],
          userAvatar:''
        }
      },


      props: [ 'uid','ip','isOn','loginNum','noLogin','location'],
        mounted: function () {
          this.showUserInfo();
        },
        methods: {
          showUserInfo: function () {
            if(this.uid==''){
              window.history.back();
            }else {
              this.getUserBInfo();
              this.getGanmeInfo();
            }

          },
          sexFilter:function (sex) {
            if(sex == 0){
              return '女';
            }else {
              return '男';
            }
          },
          getUserBInfo: function () {

            var requestUrl = api.getUserBinfo+this.uid;
            var _this = this;
            this.$ajax.get(requestUrl)
              .then(function (response) {
                _this.data1 = response.data.data;
               _this.userAvatar = '/static/img/authors/'+_this.data1.user_avatar+'.jpg';

              })
              .catch(function (error) {
                console.log(error);
              });
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
  .margin-30{
    margin-left: 30px;
  }
  .table-bordered {
    font-size: 16px;
  }

  .avatarSelect{
    margin: 25px auto;
    display: block;
  }
  .avatar{
    width: 120px;
    margin: 20px auto;
  }
</style>


