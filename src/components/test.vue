<template>
    <div>
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
</template>
<script>

    export default {
        name: "",
        mounted: function () {

        },
        methods: {
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
                  _this.customersTable = response.data.data;
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
        },
        destroyed: function () {


        },
        data: function () {
            return {}
        }
    }
</script>
<style type="text/css" scoped>

</style>


