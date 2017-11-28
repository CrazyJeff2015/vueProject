<template>
    <div>
      <div class="panel">
        <div class="panel-heading">
          <h3 class="panel-title" style="color:#008DE4">游戏信息</h3>
        </div>
        <div class="row">
          <div class="col-md-12 table-responsive">
            <table class="table table-striped table-bordered">
              <tbody>
              <tr>
                <td class="text-left">
                  <span>游戏次数：</span>
                  <span v-text="data3.game_num"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>共计：</span>
                  <span v-text="data3.total_num"></span>
                  <span class="margin-30">赢局：</span>
                  <span v-text="data3.win"></span>
                  <span class="margin-30">输局：</span>
                  <span v-text="data3.fail"></span>
                  <span class="margin-30">和局：</span>
                  <span v-text="data3.draw"></span>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <span>游戏总时长：</span>
                  <span v-text="data3.total_time"></span>分钟
                    </td>
              </tr>
              </tbody>
            </table>
            <table class="table table-striped table-bordered">
              <thead>
              <tr class="filter">
                <th>游戏</th>
                <th>时长</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in data3.gamelist">
                <td v-text="item.ganme_name"></td>
                <td><span v-text="item.time"></span>分钟</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading">

        </div>
        <div class="row">
          <div class="col-md-12 table-responsive">
            <table class="table table-striped table-bordered">
              <thead>
              <tr class="filters">
                <th>登陆时间</th>
                <th>登陆地址</th>
                <th>机器码</th>
                <th>客户端版本</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in data2List">
                <td v-text="item.login_time"></td>
                <td v-text="item.login_ip"></td>
                <td v-text="item.login_device"></td>
                <td v-text="item.client_version"></td>
              </tr>
              </tbody>
            </table>
            <!-- 分页开始 -->
            <div class="pagination" id="pager3">
                    <span class="form-inline">
                        <select class="form-control" v-model="loginPagingData.pagesize"
                                v-on:change="getLoginInfo(loginPagingData.pageCurrent,$event,true)"
                                number>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
              <template v-for="item in loginPagingData.pageCount+1">
                        <span v-if="item==1" class="btn btn-default" v-on:click="getLoginInfo(1,$event)">
                            首页
                        </span>
                <span v-if="item==1" class="btn btn-default"
                      v-on:click="getLoginInfo(loginPagingData.pageCurrent-1,$event)">
                            上一页
                        </span>
                <span v-if="item==1" class="btn btn-default" v-on:click="getLoginInfo(item,$event)">
                            {{item}}
                        </span>
                <span v-if="item==1&&item<loginPagingData.showPagesStart-1" class="btn btn-default disabled">
                            ...
                        </span>
                <span
                  v-if="item>1&&item<=loginPagingData.pageCount-1&&item>=loginPagingData.showPagesStart&&item<=loginPagingData.showPageEnd&&item<=loginPagingData.pageCount"
                  class="btn btn-default" v-on:click="getLoginInfo(item,$event)">
                            {{item}}
                        </span>
                <span v-if="item==loginPagingData.pageCount&&item>loginPagingData.showPageEnd+1"
                      class="btn btn-default disabled">
                            ...
                        </span>
                <span v-if="item==loginPagingData.pageCount&&loginPagingData.pageCount!==1" class="btn btn-default"
                      v-on:click="getLoginInfo(item,$event)"
                      v-text="item">

                        </span>
                <span v-if="item==loginPagingData.pageCount" class="btn btn-default"
                      v-on:click="getLoginInfo(loginPagingData.pageCurrent+1,$event)">
                            下一页
                        </span>
                <span v-if="item==loginPagingData.pageCount" class="btn btn-default"
                      v-on:click="getLoginInfo(loginPagingData.pageCount,$event)">
                            尾页
                        </span>
              </template>
              <span class="form-inline">
                        <input class="pageIndex form-control" style="width:60px;text-align:center" type="text"
                               v-model="loginPagingData.pageCurrent"
                               v-on:keyup.enter="getLoginInfo(loginPagingData.pageCurrent,$event,true)"/>
                    </span>
              <span>{{loginPagingData.pageCurrent}}/{{loginPagingData.pageCount}}</span>
            </div>
            <!-- 分页结束 -->
          </div>
        </div>
      </div>
    </div>
</template>
<script>

    export default {
        name: "gameLogList",
      data: function () {
        return {
            uid:'',
          logData:[],
          gamePagingInfo: [],
          gamePagingData: {
            //总项目数
            "totalCount": 200,
            //分页数
            "pageCount": 20,
            //当前页面
            "pageCurrent": 1,
            //分页大小
            "pagesize": 10,
            //显示分页按钮数
            "showPages": 8,
            //开始显示的分页按钮
            "showPagesStart": 1,
            //结束显示的分页按钮
            "showPageEnd": 100
          }
        }
      },
        mounted: function () {

        },
        methods: {},
        destroyed: function () {

        }

    }
</script>
<style type="text/css" scoped>

</style>


