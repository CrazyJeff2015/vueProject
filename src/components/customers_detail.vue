<template>
  <div>
    <div class="panel" :class="{'small':isSmall}">
      <div class="panel-heading">
        <h3 class="panel-title">
          下级客户统计
         </h3>
        <span class="pull-right">
        <span :class="{'ti-fullscreen':!isFull,'ti-move':isFull}" @click="scale()"></span>
      <span class="ti-close" @click="returnIndex"></span>
      </span>
      </div>
      <!--main content-->
      <div class="panel-body">
        <!--查询-->
        <div class="row" v-show="isScale">
          <div class="col-md-12">
            <div class="panel ">
              <div class="panel-heading">
                <h3 class="panel-title">
                  查询
                </h3>
              </div>
              <div class="panel-body">
                <div class="box-body">
                  <!-- Date range -->
                  <form action="">
                    <div class="col-md-2 form-group">
                      <label>所属代理：</label>
                      <input type="text" class="form-control pull-right" readonly :value="agentName">
                    </div>
                    <div class="col-md-2 form-group">
                      <label>会员ID：</label>
                      <input type="text" class="form-control pull-right" v-model="nickName">
                    </div>
                    <div class="col-md-6 form-group">
                      <label>
                        注册时间：
                      </label>
                      <div class="input-group">
                        <div class="input-group-addon">
                          <i class="fa fa-fw ti-calendar"></i>
                        </div>
                        <input type="text" class="form-control pull-right" id="date-range1"
                               placeholder="YYYY-MM-DD HH:MM:SS ~ YYYY-MM-DD HH:MM:SS"/>
                        <input type="text" id="start" v-show="false">
                        <input type="text" id="end" v-show="false">
                      </div>
                    </div>
                    <div class="col-md-2 form-group">
                      <label>
                        &nbsp
                      </label>
                      <input type="submit" value="搜索" @click="search()" class="btn btn-primary"
                             style="display: block;text-align: left"/>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
        <!--数据展示-->
        <div class="panel">
          <div class="panel-heading">
            <h3 class="panel-title" style="color:#008DE4">客户信息</h3>
            <span :class="['pull-right',{'ti-fullscreen':isScale,'ti-move':!isScale}]" @click="isScale=!isScale"></span>
          </div>
          <div class="row">
            <div class="col-md-12 table-responsive">
              <table class="table table-striped table-bordered" id="table1">
                <thead>
                <tr class="filters">
                  <th></th>
                  <th>所属代理</th>
                  <th>会员ID</th>
                  <th>注册时间</th>
                  <th>消费金额</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in customersTable">
                  <td v-text="index+1"></td>
                  <td v-text="agentName"></td>
                  <td v-text="item.nickname"></td>
                  <td v-text="item.created_at"></td>
                  <td v-text="item.success_cash"></td>
                  <td v-text="item.is_on"></td>
                  <td>
                    <input type="button" value="佣金记录" class="btn btn-info" @click="showCash(item.customerId)"></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!--分页-->
        <div class="pagination" id="pager2">
                    <span class="form-inline">
                        <select class="form-control" v-model="agentPagingData.pagesize"
                                v-on:change="getLogInfo(agentPagingData.pageCurrent,$event,true)"
                                number>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
          <template v-for="item in agentPagingData.pageCount+1">
                        <span v-if="item==1" class="btn btn-default" v-on:click="getLogInfo(1,$event)">
                            首页
                        </span>
            <span v-if="item==1" class="btn btn-default"
                  v-on:click="getLogInfo(agentPagingData.pageCurrent-1,$event)">
                            上一页
                        </span>
            <span v-if="item==1" class="btn btn-default" v-on:click="getLogInfo(item,$event)">
                            {{item}}
                        </span>
            <span v-if="item==1&&item<agentPagingData.showPagesStart-1" class="btn btn-default disabled">
                            ...
                        </span>
            <span
              v-if="item>1&&item<=agentPagingData.pageCount-1&&item>=agentPagingData.showPagesStart&&item<=agentPagingData.showPageEnd&&item<=agentPagingData.pageCount"
              class="btn btn-default" v-on:click="getLogInfo(item,$event)">
                            {{item}}
                        </span>
            <span v-if="item==agentPagingData.pageCount&&item>agentPagingData.showPageEnd+1"
                  class="btn btn-default disabled">
                            ...
                        </span>
            <span v-if="item==agentPagingData.pageCount&&agentPagingData.pageCount!==1" class="btn btn-default"
                  v-on:click="getLogInfo(item,$event)"
                  v-text="item">

                        </span>
            <span v-if="item==agentPagingData.pageCount" class="btn btn-default"
                  v-on:click="getLogInfo(agentPagingData.pageCurrent+1,$event)">
                            下一页
                        </span>
            <span v-if="item==agentPagingData.pageCount" class="btn btn-default"
                  v-on:click="getLogInfo(agentPagingData.pageCount,$event)">
                            尾页
                        </span>
          </template>
          <span class="form-inline">
                        <input class="pageIndex form-control" style="width:60px;text-align:center" type="text"
                               v-model="agentPagingData.pageCurrent"
                               v-on:keyup.enter="getLogInfo(agentPagingData.pageCurrent,$event,true)"/>
                    </span>
          <span>{{agentPagingData.pageCurrent}}/{{agentPagingData.pageCount}}</span>
        </div>
      </div>
      <!--main content ends-->
    </div>
    <!--消费记录-->
    <div class="panel cash" v-if="isShowCash" :class="{'smallTop':isShowCash}">
      <!--main content-->
      <div class="panel-body">
        <!--数据展示-->
        <div class="panel">
          <div class="panel-heading">
            <h3 class="panel-title" style="color:#008DE4">佣金记录</h3>
            <span class="ti-close pull-right" @click="isShowCash=!isShowCash"></span>
          </div>
          <div class="row">
            <div class="col-md-12 table-responsive">
              <table class="table table-striped table-bordered" id="table2">
                <thead>
                <tr class="filters">
                  <th></th>
                  <th>所属代理</th>
                  <th>会员ID</th>
                  <th>金币变化</th>
                  <th>佣金</th>
                  <th>提交时间</th>
                  <th>状态</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in cashList">
                  <td v-text="index+1"></td>
                  <td v-text="item.agent"></td>
                  <td v-text="item.nickname"></td>
                  <td v-text="item.cash"></td>
                  <td v-text="item.success_cash"></td>
                  <td v-text="item.created_at"></td>
                  <td v-text="item.status"></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!--分页-->
        <div class="pagination" id="pager3">
                    <span class="form-inline">
                        <select class="form-control" v-model="cashPagingData.pagesize"
                                v-on:change="getLogInfo1(cashPagingData.pageCurrent,$event,true)"
                                number>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
          <template v-for="item in cashPagingData.pageCount+1">
                        <span v-if="item==1" class="btn btn-default" v-on:click="getLogInfo1(1,$event)">
                            首页
                        </span>
            <span v-if="item==1" class="btn btn-default"
                  v-on:click="getLogInfo1(cashPagingData.pageCurrent-1,$event)">
                            上一页
                        </span>
            <span v-if="item==1" class="btn btn-default" v-on:click="getLogInfo1(item,$event)">
                            {{item}}
                        </span>
            <span v-if="item==1&&item<cashPagingData.showPagesStart-1" class="btn btn-default disabled">
                            ...
                        </span>
            <span
              v-if="item>1&&item<=cashPagingData.pageCount-1&&item>=cashPagingData.showPagesStart&&item<=cashPagingData.showPageEnd&&item<=cashPagingData.pageCount"
              class="btn btn-default" v-on:click="getLogInfo1(item,$event)">
                            {{item}}
                        </span>
            <span v-if="item==cashPagingData.pageCount&&item>cashPagingData.showPageEnd+1"
                  class="btn btn-default disabled">
                            ...
                        </span>
            <span v-if="item==cashPagingData.pageCount&&cashPagingData.pageCount!==1" class="btn btn-default"
                  v-on:click="getLogInfo1(item,$event)"
                  v-text="item">

                        </span>
            <span v-if="item==cashPagingData.pageCount" class="btn btn-default"
                  v-on:click="getLogInfo1(cashPagingData.pageCurrent+1,$event)">
                            下一页
                        </span>
            <span v-if="item==cashPagingData.pageCount" class="btn btn-default"
                  v-on:click="getLogInfo1(cashPagingData.pageCount,$event)">
                            尾页
                        </span>
          </template>
          <span class="form-inline">
                        <input class="pageIndex form-control" style="width:60px;text-align:center" type="text"
                               v-model="cashPagingData.pageCurrent"
                               v-on:keyup.enter="getLogInfo1(cashPagingData.pageCurrent,$event,true)"/>
                    </span>
          <span>{{cashPagingData.pageCurrent}}/{{cashPagingData.pageCount}}</span>
        </div>
      </div>
    </div>
    <div class="bgLev1" v-if="isShowCash"></div>
  </div>
</template>
<script>
  const moment = require("moment");
  import api from '../request/api';
  export default {
    name: "customers_detail",
    data: function () {
      return {
        customersTable: [],
        pagingInfo: [],
        selected: '10',
        page: 1,
        selected1: '10',
        page1: 1,
        cashList: [],
        cashPaging: [],
        isScale: true,
        isFull: true,
        isShowCash: false,
        cusId: '',
        nickName: '',
        agentPagingInfo:[],
        agentPagingData:{
          begin_date: '',
          end_date: '',
          parms: '',
          //总项目数
          totalCount: 200,
          //分页数
          pageCount: 20,
          //当前页面
          pageCurrent: 1,
          //分页大小
          pagesize: 10,
          //显示分页按钮数
          showPages: 8,
          //开始显示的分页按钮
          showPagesStart: 1,
          //结束显示的分页按钮
          showPageEnd: 100,
          //分页数据
        },
        cashPagingInfo:[],
        cashPagingData:{
          //总项目数
          totalCount: 200,
          //分页数
          pageCount: 20,
          //当前页面
          pageCurrent: 1,
          //分页大小
          pagesize: 10,
          //显示分页按钮数
          showPages: 8,
          //开始显示的分页按钮
          showPagesStart: 1,
          //结束显示的分页按钮
          showPageEnd: 100,
          //分页数据
        }
      }
    },
    props: ['id','agentName'],
    computed: {

    },
    mounted: function () {
      "use strict";
//      this.getCustomersTable();
      this.getLogInfo(1,null,false)
      $(document).ready(function () {
        $('#date-range1').dateRangePicker({
          autoClose: true,
          separator: ' ~ ',
          format: 'YYYY-MM-DD HH:mm:ss',
          time: {
            enabled: true
          },
          getValue: function () {
            $(this).val("");
          },
          endDate: moment()
        }).bind('datepicker-close', function () {
          var str = $(this).val();
          var arr = str.split(" ~ ");
          $("#start").val(arr[0]);
          $("#end").val(arr[1]);
        });
        ;
      });
    },
    methods: {
      //        搜索
      search: function () {
        this.begin_date = $('#start').val();
        this.end_date = $('#end').val();
        if (this.begin_date == "" && this.nickName !== '') {
          this.parms = '?nickname=' + this.nickName;
        }
        if (this.begin_date !== "" && this.nickName !== '') {
          this.parms = '?nickname=' + this.nickName + 'begin_at=' + this.begin_date + '&end_at=' + this.end_date;
        }
        if (this.begin_date !== "" && this.nickName == '') {
          this.parms = '?begin_at=' + this.begin_date + '&end_at=' + this.end_date;
        }
        console.log(this.parms);
        var _this = this;
        this.$ajax.get(api.agentCustomersList + '/' + this.id + this.parms)
          .then(function (response) {
            _this.customersTable = response.data.data;
            _this.pagingInfo = response.data.meta.pagination;
            _this.nickName = '';
            _this.begin_date = '';
            _this.end_date = '';
            _this.parms = '';
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //下级代理查询

      getLogInfo: function (pageIndex, $event, forceRefresh) {

        if (pageIndex > 0) {

          if (pageIndex > this.agentPagingData.pageCount) {
            pageIndex = this.agentPagingData.pageCount;
          }

          //判断数据是否需要更新
          var currentPageCount = Math.ceil(this.agentPagingData.totalCount / this.agentPagingData.pagesize);
          if (currentPageCount != this.agentPagingData.pageCount) {
            pageIndex = 1;
            this.agentPagingData.pageCount = currentPageCount;
          }
          else if (this.agentPagingData.pageCurrent == pageIndex && currentPageCount == this.agentPagingData.pageCount && typeof (forceRefresh) == "undefined") {
            console.log("not refresh");
            return;
          }

          //处理分页点中样式
          var buttons = $("#pager2").find("span");
          for (var i = 0; i < buttons.length; i++) {
            if (buttons.eq(i).html() != pageIndex) {
              buttons.eq(i).removeClass("active");
            }
            else {
              buttons.eq(i).addClass("active");
            }
          }

          this.agentPagingData.pageCurrent = pageIndex;

          //计算分页按钮数据
          if (this.agentPagingData.pageCount > this.agentPagingData.showPages) {
            if (pageIndex <= (this.agentPagingData.showPages - 1) / 2) {
              this.agentPagingData.showPagesStart = 1;
              this.agentPagingData.showPageEnd = this.agentPagingData.showPages - 1;
            }
            else if (pageIndex >= this.agentPagingData.pageCount - (this.agentPagingData.showPages - 3) / 2) {
              this.agentPagingData.showPagesStart = this.agentPagingData.pageCount - this.agentPagingData.showPages + 2;
              this.agentPagingData.showPageEnd = this.agentPagingData.pageCount;
            }
            else {
              this.agentPagingData.showPagesStart = pageIndex - (this.agentPagingData.showPages - 3) / 2;
              this.agentPagingData.showPageEnd = parseInt(pageIndex) + (this.agentPagingData.showPages - 3) / 2;
            }
          }

          if (pageIndex <= 0) {
            pageIndex = 1;
          }
          this.agentPagingData.begin_date = $('#start').val();
          this.agentPagingData.end_date = $('#end').val();
          if (this.agentPagingData.begin_date == "" && this.nickName !== '') {
            this.agentPagingData.parms = '?nickname=' + this.nickName;
          }
          if (this.agentPagingData.begin_date !== "" && this.nickName !== '') {
            this.agentPagingData.parms = '?nickname=' + this.nickName + '&begin_at=' + this.agentPagingData.begin_date + '&end_at=' + this.agentPagingData.end_date;
          }
          if (this.agentPagingData.begin_date !== "" && this.nickName == '') {
            this.agentPagingData.parms = '?begin_at=' + this.agentPagingData.begin_date + '&end_at=' + this.agentPagingData.end_date;
          }
          console.log(this.agentPagingData.parms);
          var requestUrl = '';
          this.agentPagingData.parms == '' ? requestUrl = api.agentCustomersList + '/' + this.$store.state.showCustomers.agentData.agentId +'?page=' + pageIndex + '&limit=' + this.agentPagingData.pagesize : requestUrl = api.agentCustomersList + '/' + this.$store.state.showCustomers.agentData.agentId + '?'+this.agentPagingData.parms + '&page=' + pageIndex + '&limit=' + this.agentPagingData.pagesize;

          //搜索结束
          var _this = this;
          this.$ajax.get(requestUrl)
            .then(function (response) {
              _this.customersTable = response.data.data;
              _this.agentPagingInfo = response.data.meta.pagination;
              _this.agentPagingData.begin_date = '';
              _this.agentPagingData.end_date = '';
              _this.agentPagingData.parms = '';
              _this.agentPagingData.totalCount = _this.agentPagingInfo.total;
              _this.agentPagingData.pageCount = _this.agentPagingInfo.total_pages;
              _this.agentPagingData.pageCurrent = _this.agentPagingInfo.current_page;
              _this.agentPagingData.pagesize = _this.agentPagingInfo.per_page;

            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
      getLogInfo1: function (pageIndex, $event, forceRefresh) {

        if (pageIndex > 0) {

          if (pageIndex > this.cashPagingData.pageCount) {
            pageIndex = this.cashPagingData.pageCount;
          }

          //判断数据是否需要更新
          var currentPageCount = Math.ceil(this.cashPagingData.totalCount / this.cashPagingData.pagesize);
          if (currentPageCount != this.cashPagingData.pageCount) {
            pageIndex = 1;
            this.cashPagingData.pageCount = currentPageCount;
          }
          else if (this.cashPagingData.pageCurrent == pageIndex && currentPageCount == this.cashPagingData.pageCount && typeof (forceRefresh) == "undefined") {
            console.log("not refresh");
            return;
          }

          //处理分页点中样式
          var buttons = $("#pager3").find("span");
          for (var i = 0; i < buttons.length; i++) {
            if (buttons.eq(i).html() != pageIndex) {
              buttons.eq(i).removeClass("active");
            }
            else {
              buttons.eq(i).addClass("active");
            }
          }

          this.cashPagingData.pageCurrent = pageIndex;

          //计算分页按钮数据
          if (this.cashPagingData.pageCount > this.cashPagingData.showPages) {
            if (pageIndex <= (this.cashPagingData.showPages - 1) / 2) {
              this.cashPagingData.showPagesStart = 1;
              this.cashPagingData.showPageEnd = this.cashPagingData.showPages - 1;
            }
            else if (pageIndex >= this.cashPagingData.pageCount - (this.cashPagingData.showPages - 3) / 2) {
              this.cashPagingData.showPagesStart = this.cashPagingData.pageCount - this.cashPagingData.showPages + 2;
              this.cashPagingData.showPageEnd = this.cashPagingData.pageCount;
            }
            else {
              this.cashPagingData.showPagesStart = pageIndex - (this.cashPagingData.showPages - 3) / 2;
              this.cashPagingData.showPageEnd = parseInt(pageIndex) + (this.cashPagingData.showPages - 3) / 2;
            }
          }

          if (pageIndex <= 0) {
            pageIndex = 1;
          }

          var requestUrl = '';
          requestUrl = api.agentCusConsume + this.cusId +'?page=' + pageIndex + '&limit=' + this.cashPagingData.pagesize;

          //搜索结束
          var _this = this;
          this.$ajax.get(requestUrl)
            .then(function (response) {
              _this.cashList = response.data.data;
              _this.cashPagingInfo = response.data.meta.pagination;
              _this.cashPagingData.begin_date = '';
              _this.cashPagingData.end_date = '';
              _this.cashPagingData.parms = '';
              _this.cashPagingData.totalCount = _this.cashPagingInfo.total;
              _this.cashPagingData.pageCount = _this.cashPagingInfo.total_pages;
              _this.cashPagingData.pageCurrent = _this.cashPagingInfo.current_page;
              _this.cashPagingData.pagesize = _this.cashPagingInfo.per_page;

            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },

      //        获取客户limit
      getPage: function () {
        var _this = this;
        this.$ajax.get(api.agentCustomersList + '/' + this.$store.state.showCustomers.agentData.agentId + '?page=' + _this.page + '&limit=' + _this.selected)
          .then(function (response) {
            _this.customersTable = response.data.data;
            _this.pagingInfo = response.data.meta.pagination;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      // 消费记录limit
      getPage1: function () {
        var _this = this;
        this.$ajax.get(api.agentCusConsume + _this.cusId + '?page=' + _this.page1 + '&limit=' + _this.selected1)
          .then(function (response) {
            _this.cashList = response.data.data;
            _this.cashPaging = response.data.meta.pagination;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
//      查看消费记录
      showCash: function (value) {
        this.cusId = value;
        this.isShowCash = !this.isShowCash;
        this.getLogInfo1(1,null,false)
      },
//      整体缩小
      scale: function () {
        if (this.isSmall == true) {
          this.$store.dispatch('showFlag', {'showAgent': false, 'showCustomer': true, 'smallCustomer': false});
        } else {
          this.$store.dispatch('showFlag', {'showAgent': true, 'showCustomer': true, 'smallCustomer': true});
        }
        this.isFull = !this.isFull;
      },
//      返回代理界面
      returnIndex: function () {
        this.$store.dispatch('showFlag', {'showAgent': true, 'showCustomer': false, 'smallCustomer': false});
      },

//      获取列表
      getCustomersTable: function () {
        var _this = this;
        this.$ajax.get(api.agentCustomersList + '/' + this.$store.state.showCustomers.agentData.agentId)
          .then(function (response) {
            _this.customersTable = response.data.data;
            _this.pagingInfo = response.data.meta.pagination;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    destroyed: function () {

    }
  }
</script>

<style scoped>
  .btn.btn-info {
    padding: 2px 6px 3px;
  }

  .inline {
    display: inline-block;
  }

  .small {
    position: absolute;
    top: 25%;
    left: 10%;
    width: 80%;
    z-index: 100;
  }

  .smallTop {
    position: absolute;
    top: 25%;
    left: 10%;
    width: 80%;
    z-index: 102;
  }
</style>
