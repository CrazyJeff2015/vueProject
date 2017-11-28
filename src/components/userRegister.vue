<template>
  <div  v-show="permissions.view_userbackregist">
    <div  class="row">
      <div class="col-md-12">
        <div class="panel">
          <div class="panel-heading">
            <h3 class="panel-title">
              <i class="livicon" data-name="bell" data-size="16" data-loop="true" data-c="#fff"
                 data-hc="white"></i> 注册流程
                            </h3>
            <span class="pull-right">
                                    <i class="fa fa-fw ti-angle-up clickable"></i>
                                </span>
          </div>
          <div class="panel-body">
            <form id="commentForm" method="post" action="#">
              <div id="rootwizard">
                <ul>
                  <li>
                    <a href="#tab1" data-toggle="tab">第一步</a>
                  </li>
                  <li>
                    <a href="#tab2" data-toggle="tab">第二步</a>
                  </li>
                  <li>
                    <a href="#tab3" data-toggle="tab">完成</a>
                  </li>
                </ul>

                <div class="tab-content">
                  <div class="tab-pane" id="tab1">
                    <h2 class="hidden">&nbsp;</h2>
                    <div class="form-group">
                      <label for="userName" class="control-label">登录名 *</label>
                      <input id="userName" name="username" type="text" placeholder="必须以字母开头，3-10位字母或数字的组合" class="form-control required" v-model="userInfo.login_name">
                    </div>
                    <div class="form-group">
                      <label for="password" class="control-label">登录密码 *</label>
                      <input id="password" name="password" type="password" placeholder="请输入6-16位字母或数字的组合" class="form-control required" v-model="userInfo.password">
                    </div>
                    <div class="form-group">
                      <label for="confirm" class="control-label">确认密码 *</label>
                      <input id="confirm" name="confirm" type="password" placeholder="必须与登录密码相同 " class="form-control required">
                    </div>
                  </div>
                  <div class="tab-pane" id="tab2">
                    <div class="form-group">
                      <label class="control-label">选择用户权限角色 *</label>
                      <table  class="table table-bordred table-striped">
                        <thead>
                        <tr>
                          <th></th>
                          <th>选择</th>
                          <th>角色名称</th>
                          <th>角色描述</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in roleList">
                          <td v-text="index+1"></td>
                          <td><input type="checkbox"  :value="item.id" v-model="userRole.role_id"></td>
                          <td v-text="item.name"></td>
                          <td v-text="item.description"></td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane" id="tab3">
                   用户注册完成
                  </div>
                  <ul class="pager wizard">
                    <li class="next">
                      <a>下一步</a>
                    </li>
                    <li class="next finish" style="display:none;">
                      <a>完成</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div id="myModal" class="modal fade" role="dialog">
                <div class="modal-dialog">
                  <!-- Modal content-->
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">用户注册</h4>
                    </div>
                    <div class="modal-body">
                      <p>用户注册已完成</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">确定
                                            </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../request/api';
  import select2 from "../vendors/select2/dist/js/select2.min.js"
  import iCheck from "../vendors/iCheck/icheck.min.js"
  import validator from "../vendors/bootstrapvalidator/dist/js/bootstrapValidator.min.js"
  import wizard from "../vendors/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js"
  import ElCard from "../../node_modules/element-ui/packages/card/src/main";
  export default {
    components: {ElCard},
    name: "userRegister",
    data:function () {
      return{
          userInfo:{
            login_name:'',
            password:''
          },
          userRole:{
            user_id:"",
            role_id:[]
          },
          roleList:[]
      }
    },
    computed:{
      permissions:function () {
        return this.$store.state.permissions.permissionsData;
      },
    },
    mounted: function() {
      "use strict";
      this.getRoleList();

    },
    methods: {

      //注册用户
      setUser:function () {
        var _this = this;
        this.$ajax({
          url:api.userRegister,
          method:"post",
          data:_this.userInfo
        }).then(function (response) {
          _this.userRole.user_id = response.data.data;
        }).catch(function (error) {
          console.log(error)
        })
      },
      init:function () {
        var _this = this;
        $(document).ready(function() {

          // bootstrap wizard//
          $("#gender, #gender1").select2({
            theme: "bootstrap",
            placeholder: "",
            width: '100%'
          });
          $("#commentForm").bootstrapValidator({
            fields: {
              username: {
                validators: {
                  notEmpty: {
                    message: '登录名不能为空'
                  },regexp: {
                    regexp: /[a-zA-Z][a-zA-Z0-9]{2,10}/,
                    message: '必须以字母开头，3-10位字母或数字的组合'
                  },
                },
                required: true,
              },
              password: {
                validators: {
                  notEmpty: {
                    message: '登录密码不能为空'
                  },
                  regexp: {
                    regexp: /[a-zA-Z0-9]{6,16}/,
                    message: '请输入6-16位字母或数字的组合'
                  }
                }
              },
              confirm: {
                validators: {
                  notEmpty: {
                    message: '确认密码不能为空'
                  },
                  identical: {
                    field: 'password',
                    message: '确认密码必须与登录密码一致'
                  }
                }
              }
            }
          });

          $('#rootwizard').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'onNext': function(tab, navigation, index) {
              var $validator = $('#commentForm').data('bootstrapValidator').validate();
              return $validator.isValid();
            },
            onTabClick: function(tab, navigation, index) {
              return false;
            },
            onTabShow: function(tab, navigation, index) {
              var $total = navigation.find('li').length;
              var $current = index + 1;
              if($current == 2){
                _this.setUser();
              }
              if($current == 3){
                _this.userBanRole();
              }
              var $percent = ($current / $total) * 100;

              // If it's the last tab then hide the last button and show the finish instead
              var root_wizard = $('#rootwizard');
              if ($current >= $total) {
                root_wizard.find('.pager .next').hide();
                root_wizard.find('.pager .finish').show();
                root_wizard.find('.pager .finish').removeClass('disabled');
              } else {
                root_wizard.find('.pager .next').show();
                root_wizard.find('.pager .finish').hide();
              }
              root_wizard.find('.finish').click(function() {
                var $validator = $('#commentForm').data('bootstrapValidator').validate();
                if ($validator.isValid()) {
                  $('#myModal').modal('show');
                  return $validator.isValid();
                  root_wizard.find("a[href='#tab1']").tab('show');
                }
              });

            }
          });
          $('#myModal').on('hide.bs.modal', function(e) {
            location.reload();
          });

          $('input[type="checkbox"].custom-checkbox, input[type="radio"].custom-radio').iCheck({
            checkboxClass: 'icheckbox_minimal-blue',
            radioClass: 'iradio_minimal-blue',
            increaseArea: '20%'
          });
          // bootstrap wizard 2


          var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn'),
            allPrevBtn = $('.prevBtn');

          allWells.hide();

          navListItems.click(function(e) {
            e.preventDefault();
            var $target = $($(this).attr('href')),
              $item = $(this);

            if (!$item.hasClass('disabled')) {
              navListItems.removeClass('btn-primary').addClass('btn-default');
              $item.addClass('btn-primary');
              allWells.hide();
              $target.show();
              $target.find('input:eq(0)').focus();
            }
          });

          allNextBtn.click(function() {
            var curStep = $(this).closest(".setup-content"),
              curStepBtn = curStep.attr("id"),
              nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
              curInputs = curStep.find("input[type='text'],input[type='url']"),
              isValid = true;

            $(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
              if (!curInputs[i].validity.valid) {
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
              }
            }

            if (isValid)
              nextStepWizard.removeAttr('disabled').trigger('click');
          });

          allPrevBtn.click(function() {
            var curStep = $(this).closest(".setup-content"),
              curStepBtn = curStep.attr("id"),
              prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a");

            $(".form-group").removeClass("has-error");
            prevStepWizard.removeAttr('disabled').trigger('click');
          });

          $('div.setup-panel div a.btn-primary').trigger('click');


          $("a[disabled='disabled']").removeAttr("disabled");
        });
      },
      //角色列表
      getRoleList: function () {
        var _this = this;
        this.$ajax.get(api.roleList)
          .then(function (response) {
            _this.roleList = response.data.data;
            _this.init()
//            _this.userRole.role_id = _this.roleList[0].id;
          }).catch(function (error) {
          console.log(error)
        })
      },
      //用户绑定角色
      userBanRole:function () {
        var _this = this;
        this.$ajax({
          url:api.userBindRole,
          method:"post",
          data:_this.userRole
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    destroyed: function() {

    }
  }
</script>
<style src="../vendors/iCheck/skins/all.css" scoped></style>
<style src="../vendors/select2/dist/css/select2.min.css"></style>
<style src="../vendors/select2-bootstrap-theme/dist/select2-bootstrap.min.css"></style>
<style src="../vendors/bootstrapvalidator/dist/css/bootstrapValidator.min.css"></style>
<style src="../assets/css/custom_css/wizard.css"></style>
