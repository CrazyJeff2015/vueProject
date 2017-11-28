<template>
  <div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          注册筛选
         </h3>
      </div>
      <div class="panel-body">
        <form class="form-horizontal" role="form" @submit.prevent="setRegisterFn()">
          <div class="form-group">
            <div class="col-sm-6">
              <label class="col-sm-6">限制规则</label>
              <select class="col-sm-6" v-model="setRegisterInfo.type">
                <option value="1">限制ip</option>
                <option value="2">限制机器码</option>
                <option value="3">限制姓名</option>
                <option value="4">限制地区</option>
              </select>
            </div>
            <div class="col-sm-6">
              <input type="number" class="form-control" id="input-text" placeholder="输入数量,0表示禁止注册"
                     v-model="setRegisterInfo.num">
            </div>
          </div>

          <div class="form-group text-right">
            <div class="col-sm-12">
              <input type="checkbox" :value="0" v-model="setRegisterInfo.status">禁止注册
              <input type="checkbox" :value="1" v-model="setRegisterInfo.status">设为可疑账号
              <input type="checkbox" :value="2" v-model="setRegisterInfo.status">不送金币
            </div>
          </div>
          <div class="form-group text-right col-sm-12">
            <button class="btn btn-primary"><i class="fa fa-fw fa-check"></i> 提交
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          限制规则列表
         </h3>
      </div>
      <div class="panel-body">
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead>
            <tr>
              <th>限制名称</th>
              <th>限制数量</th>
              <th>限制规则</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in setRegisterList">
              <td v-text="typeFilter(item.type)"></td>
              <td><input type="number" v-model="item.num"></td>
              <td>
                <input type="checkbox" :value="'0'" v-model="item.status">禁止注册
              <input type="checkbox" :value="'1'" v-model="item.status">设为可疑账号
              <input type="checkbox" :value="'2'" v-model="item.status">不送金币

              </td>
              <td>
                <button data-toggle="modal" data-target="#editSetRegistor" data-placement="center"
                        class="btn btn-primary btn-xs" @click="editSetRegister(item.id,item.num,item.status)"><i
                  class="fa fa-fw fa-check"></i>提交
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          注册禁止
         </h3>
      </div>
      <div class="panel-body">
        <form class="form-horizontal" role="form" @submit.prevent="banRegisterFn()">
          <div class="form-group">
            <div class="col-sm-6">
              <label class="col-sm-6">禁止规则</label>
              <select class="col-sm-6" v-model="banRegisterInfo.type">
                <option value="1">禁止ip</option>
                <option value="2">禁止机器码</option>
                <option value="3">禁止姓名</option>
                <option value="4">禁止地区</option>
              </select>
            </div>
            <div class="col-sm-6">
              <input type="text" class="form-control" placeholder="多个值请使用半角逗号&quot;,&quot;分隔"
                     v-model="banRegisterInfo.content">
            </div>
          </div>

          <div class="form-group text-right">
            <div class="col-sm-12">
              &nbsp;
            </div>
          </div>
          <div class="form-group text-right col-sm-12">
            <button class="btn btn-primary"><i class="fa fa-fw fa-check"></i> 提交

            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          禁止注册列表
         </h3>
      </div>
      <div class="panel-body">
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead>
            <tr>
              <th>限制名称</th>
              <th>限制内容</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in banRegisterList">
              <td v-text="typeFilter(item.type)"></td>
              <td v-text="arrFilter(item.content)"></td>
              <td>
                <button  class="btn btn-primary btn-xs btn-danger" data-toggle="modal"
                        data-target="#delete" data-placement="top" @click="deleteBanId = item.id"><i
                  class="fa fa-fw fa-trash-o"></i> 删除
            </button>
              </td>
            </tr>
            </tbody>
          </table>
          <!--分页开始-->
          <div class="pagination" id="pager">
                    <span class="form-inline">
                        <select class="form-control" v-model="pagesize" v-on:change="getBanRegisterList(pageCurrent,$event,true)"
                                number>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
            <template v-for="item in pageCount+1">
                        <span v-if="item==1" class="btn btn-default" v-on:click="getBanRegisterList(1,$event)">
                            首页
                        </span>
              <span v-if="item==1" class="btn btn-default" v-on:click="getBanRegisterList(pageCurrent-1,$event)">
                            上一页
                        </span>
              <span v-if="item==1" class="btn btn-default" v-on:click="getBanRegisterList(item,$event)">
                            {{item}}
                        </span>
              <span v-if="item==1&&item<showPagesStart-1" class="btn btn-default disabled">
                            ...
                        </span>
              <span v-if="item>1&&item<=pageCount-1&&item>=showPagesStart&&item<=showPageEnd&&item<=pageCount"
                    class="btn btn-default" v-on:click="getBanRegisterList(item,$event)">
                            {{item}}
                        </span>
              <span v-if="item==pageCount&&item>showPageEnd+1" class="btn btn-default disabled">
                            ...
                        </span>
              <span v-if="item==pageCount&&pageCount!==1" class="btn btn-default" v-on:click="getBanRegisterList(item,$event)"
                    v-text="item">

                        </span>
              <span v-if="item==pageCount" class="btn btn-default" v-on:click="getBanRegisterList(pageCurrent+1,$event)">
                            下一页
                        </span>
              <span v-if="item==pageCount" class="btn btn-default" v-on:click="getBanRegisterList(pageCount,$event)">
                            尾页
                        </span>
            </template>
            <span class="form-inline">
                        <input class="pageIndex form-control" style="width:60px;text-align:center" type="text"
                               v-model="pageCurrent" v-on:keyup.enter="getBanRegisterList(pageCurrent,$event,true)"/>
                    </span>
            <span>{{pageCurrent}}/{{pageCount}}</span>
          </div>
          <!--分页结束-->
        </div>
      </div>
    </div>
    <!-- 编辑 -->
    <div class="modal fade" id="editSetRegistor" tabindex="-1" role="dialog" aria-labelledby="delete" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h4 class="modal-title custom_align" id="Heading5">更改注册筛选</h4>
          </div>
          <div class="modal-body">
            <div class="alert alert-info">
              <span class="glyphicon glyphicon-info-sign"></span>&nbsp; 你确定更改该条规则吗？

            </div>
          </div>
          <div class="modal-footer ">
            <button class="btn btn-danger" data-dismiss="modal" type="submit" @click="sentSet()">
              <span class="glyphicon glyphicon-ok-sign"></span> 确定

            </button>
            <button type="button" class="btn btn-success" data-dismiss="modal">
              <span class="glyphicon glyphicon-remove"></span> 取消

            </button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>

      <!-- /.modal-dialog -->
    </div>
    <div class="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="delete" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h4 class="modal-title custom_align">删除禁止注册</h4>
          </div>
          <div class="modal-body">
            <div class="alert alert-info">
              <span class="glyphicon glyphicon-info-sign"></span>&nbsp; 你确定更改该条规则吗？

            </div>
          </div>
          <div class="modal-footer ">
            <button class="btn btn-danger" data-dismiss="modal" type="submit" @click="deleteBanFn()">
              <span class="glyphicon glyphicon-ok-sign"></span> 确定

            </button>
            <button type="button" class="btn btn-success" data-dismiss="modal">
              <span class="glyphicon glyphicon-remove"></span> 取消

            </button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>

      <!-- /.modal-dialog -->
    </div>
  </div>
</template>
<script>
  import api from '../request/api';
  import trumbowyg from "../vendors/trumbowyg/dist/trumbowyg.min.js"
  export default {
    name: "registrationManagement",
    data: function () {
      return {
        setRegisterInfo: {
          type: 1,
          num: '',
          status: []
        },
        banRegisterInfo: {
          type: 1,
          content: []
        },
        editSetId:'',
        editSet:{
            num:'',
            status:[]
        },
        setRegisterList: [],
        banRegisterList: [],
        deleteBanId:'',
        //获取分页数据
        pagingInfo: [],
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

      }
    },
    mounted: function () {
      this.getSetRegisterList();
      this.getBanRegisterList(1,null,false);
    },
    methods: {
      //注册筛选
      setRegisterFn: function () {
        var _this = this;
        this.$ajax({
          url: api.setRegister,
          method: "post",
          data: _this.setRegisterInfo
        }).then(function (response) {
          if (response.status == 200) {
            _this.subSuccess()
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //筛选规则列表
      getSetRegisterList: function () {
        var _this = this;
        this.$ajax.get(api.getSetRegisterList).then(function (response) {
          _this.setRegisterList = response.data.data;
          for (var i = 0; i < _this.setRegisterList.length; i++) {
            if (_this.setRegisterList[i].status == "") {
              _this.setRegisterList[i].status = [];
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //禁止注册
      banRegisterFn: function () {
        if (this.banRegisterInfo.content.indexOf(',') > 0) {
          var arr = this.banRegisterInfo.content.split(",");
          this.banRegisterInfo.content = arr;
        } else {
          var arr = [];
          arr.push(this.banRegisterInfo.content);
          this.banRegisterInfo.content = arr;
        }
        var _this = this;
        this.$ajax({
          url: api.banRegister,
          method: "post",
          data: _this.banRegisterInfo
        }).then(function (response) {
          if (response.status == 200) {
              _this.banRegisterInfo.content=[];
            _this.getBanRegisterList(1,null,false);
            _this.subSuccess()
          }
        }).catch(function (error) {
          console.log(error)
        })
      },

      getBanRegisterList: function (pageIndex, $event, forceRefresh) {

        if (pageIndex > 0) {

          if (pageIndex > this.pageCount) {
            pageIndex = this.pageCount;
          }

          //判断数据是否需要更新
          var currentPageCount = Math.ceil(this.totalCount / this.pagesize);
          if (currentPageCount != this.pageCount) {
            pageIndex = 1;
            this.pageCount = currentPageCount;
          }
          else if (this.pageCurrent == pageIndex && currentPageCount == this.pageCount && typeof (forceRefresh) == "undefined") {

            return;
          }

          //处理分页点中样式
          var buttons = $("#pager").find("span");
          for (var i = 0; i < buttons.length; i++) {
            if (buttons.eq(i).html() != pageIndex) {
              buttons.eq(i).removeClass("active");
            }
            else {
              buttons.eq(i).addClass("active");
            }
          }

          this.pageCurrent = pageIndex;

          //计算分页按钮数据
          if (this.pageCount > this.showPages) {
            if (pageIndex <= (this.showPages - 1) / 2) {
              this.showPagesStart = 1;
              this.showPageEnd = this.showPages - 1;

            }
            else if (pageIndex >= this.pageCount - (this.showPages - 3) / 2) {
              this.showPagesStart = this.pageCount - this.showPages + 2;
              this.showPageEnd = this.pageCount;
            }
            else {
              this.showPagesStart = pageIndex - (this.showPages - 3) / 2;
              this.showPageEnd = parseInt(pageIndex) + (this.showPages - 3) / 2;
            }
          }


          if (pageIndex <= 0) {
            pageIndex = 1;
          }

          var requestUrl = api.getBanRegisterList + '?page=' + pageIndex + '&limit=' + this.pagesize;


          var _this = this;
          this.$ajax.get(requestUrl)
            .then(function (response) {
            _this.banRegisterList = response.data.data;
              _this.pagingInfo = response.data.meta.pagination;
              _this.totalCount = _this.pagingInfo.total;
              _this.pageCount = _this.pagingInfo.total_pages;
              _this.pageCurrent = _this.pagingInfo.current_page;
              _this.pagesize = _this.pagingInfo.per_page;
          }).catch(function (error) {
            console.log(error)
          })

        }

      },
      editSetRegister: function (id, num, status) {
        this.editSetId = id;
        this.editSet.num = num;
        this.editSet.status = status;
      },
      deleteBanFn:function () {
        var _this = this;
        this.$ajax({
          url:api.deleteBanRegister+_this.deleteBanId,
          method:"DELETE"
        }).then(function (response) {
          if(response.data.code==200){
            _this.getBanRegisterList(1,null,false);
            _this.subSuccess()
          }
        })
      },
      sentSet:function () {
        var _this = this;
        this.$ajax({
          url:api.editSetRegister+_this.editSetId,
          method:"put",
          data:_this.editSet
        }).then(function (response) {
          if(response.data.code==200){
            _this.getSetRegisterList();
              _this.subSuccess()
          }
        })

      },
      typeFilter: function (type) {
        switch (type) {
          case 1:
            return "限制ip";
            break;
          case 2:
            return "限制机器码";
            break;
          case 3:
            return "限制姓名";
            break;
          case 4:
            return "限制地区";
            break;
        }
      },
      arrFilter: function (str) {
        var lenght = str.length;
        var txt ='';
          for(var i=0;i<lenght;i++){
              txt = txt + str[i] + ' ';
          }
        return txt;
      },
      subSuccess: function () {
        this.showTex = false;
        swal({
          title: "操作成功",
          text: "",
          type: "success",
          confirmButtonColor: "#66cc99",
          confirmButtonText: "关闭"
        });
      },
    },
    destroyed: function () {

    },

  }
</script>
<style type="text/css" scoped>

</style>


