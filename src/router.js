/**
 * Created by zhoutao on 2017/8/23.
 */
import store from './vuex/store';
const routers = [{
  path: '/',
  component: resolve => require(['./layout1.vue'], resolve),
  meta: {
    title: "首页",
    breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
    permission:true
  },
  children: [{
    path: '',
    component: resolve => require(['./components/index.vue'], resolve),
    meta: {
      title: "",
      breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
      permission:true
    }
  }]
}, {
  path: '/dIndex',
  component: resolve => require(['./layout1.vue'], resolve),
  meta: {
    title: "首页",
    breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
    permission:true
  },
  children: [{
    path: '',
    component: resolve => require(['./components/layout/dIndex.vue'], resolve),
    meta: {
      title: "首页",
      breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
      permission:true
    }
  }]
},
  {
    path: '/oIndex',
    component: resolve => require(['./layout1.vue'], resolve),
    meta: {
      title: "首页",
      breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
      permission:true
    },
    children: [{
      path: '',
      component: resolve => require(['./components/layout/oIndex.vue'], resolve),
      meta: {
        title: "首页",
        breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
        permission:true
      }
    }]
  },
  {
    path: '/aIndex',
    component: resolve => require(['./layout1.vue'], resolve),
    meta: {
      title: "首页",
      breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
      permission:true
    },
    children: [{
      path: '',
      component: resolve => require(['./components/layout/aIndex.vue'], resolve),
      meta: {
        title: "首页",
        breadcrumb: `<li><a href="/"><i class="ti-home"></i> 首页 </a></li>`,
        permission:true
      }
    }]
  },

  {
  path: '/user',
  component: resolve => require(['./layout1.vue'], resolve),
  children: [{
    path: 'agent_detail',
    component: resolve => require(['./components/agent_detail.vue'], resolve),
    meta: {
      title: "个人信息",
      permission:store.state.permissions.permissionsData.agent,
      breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>个人信息</li>`
    }
  }, {
    path: 'withdrawals',
    component: resolve => require(['./components/withdrawals.vue'], resolve),
    meta: {
      title: "代理提款",
      permission:store.state.permissions.permissionsData.agent,
      breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>代理提款</li>`
    }
  }, {
    path: 'commission_change',
    component: resolve => require(['./components/commission_change.vue'], resolve),
    meta: {
      title: "财务变动",
      permission:store.state.permissions.permissionsData.agent,
      breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>财务变动</li>`
    }
  }, {
    path: 'secure_code',
    component: resolve => require(['./components/secure_code.vue'], resolve),
    meta: {
      title: "修改资料",
      permission:store.state.permissions.permissionsData.agent,
      breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>修改资料</li>`
    }
  },
    {
      path: 'set_agent',
      component: resolve => require(['./components/set_agent.vue'], resolve),
      meta: {
        title: "开设账号",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>开设账号</li>`
      }
    },
    {
      path: 'setAgent',
      component: resolve => require(['./components/setAgent.vue'], resolve),
      meta: {
        title: "新增代理",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>新增下级代理</li>`
      }
    }, {
      path: 'commissions',
      component: resolve => require(['./components/commissions.vue'], resolve),
      meta: {
        title: "分成记录",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>分成记录</li>`
      }
    }, {
      path: 'index_agent',
      component: resolve => require(['./components/index_agent.vue'], resolve),
      meta: {
        title: "下级代理管理",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>下级代理管理</li>`
      }
    },
    {
      path: 'customers',
      component: resolve => require(['./components/customers.vue'], resolve),
      meta: {
        title: "直属玩家管理",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>直属玩家管理</li>`
      }
    },
    {
      path: 'admin_customers',
      component: resolve => require(['./components/admin_customers.vue'], resolve),
      meta: {
        title: "代理关联用户",
        permission:store.state.permissions.permissionsData.admin,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>代理关联用户</li>`
      }
    },
    {
      path: 'oper_details',
      component: resolve => require(['./components/solo/oper_details.vue'], resolve),
      meta: {
        title: "占成报表",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>代理关联用户</li>`
      }
    },
    {
      path: 'statistics',
      component: resolve => require(['./components/statistics.vue'], resolve),
      meta: {
        title: "代理综合统计",
        permission:store.state.permissions.permissionsData.admin,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>统计报表</a></li><li>代理综合统计</li>`
      }
    },
    {
      path: 'admin_commissions',
      component: resolve => require(['./components/admin_commissions.vue'], resolve),
      meta: {
        title: "代理分成统计",
        permission:store.state.permissions.permissionsData.admin||store.state.permissions.permissionsData.operation,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>统计报表</a></li><li>代理分成统计</li>`
      }
    }, {
      path: 'name_charge',
      component: resolve => require(['./components/name_charge.vue'], resolve),
      meta: {
        title: "域名管理",
        permission:store.state.permissions.permissionsData.admin||store.state.permissions.permissionsData.operation,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>域名管理</li>`
      }
    }, {
      path: 'log',
      component: resolve => require(['./components/log.vue'], resolve),
      meta: {
        title: "操作日志",
        permission:store.state.permissions.permissionsData.admin,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>操作日志</li>`
      }
    }, {
      path: 'admin_index_agent',
      component: resolve => require(['./components/admin_index_agent.vue'], resolve),
      meta: {
        title: "代理列表",
        permission:store.state.permissions.permissionsData.admin||store.state.permissions.permissionsData.operation,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>代理列表</li>`
      }
    },
    {
      path: 'agent_statistics',
      component: resolve => require(['./components/agent_statistics.vue'], resolve),
      meta: {
        title: "代理分成统计",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>代理分成统计</li>`
      }
    }, {
      path: 'admin_statistics',
      component: resolve => require(['./components/admin_statistics.vue'], resolve),
      meta: {
        title: "佣金统计",
        permission:store.state.permissions.permissionsData.give_score,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>佣金统计</li>`
      }
    }, {
      path: 'super_statistics',
      component: resolve => require(['./components/super_statistics.vue'], resolve),
      meta: {
        title: "佣金统计",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>代理分成统计</li>`
      }
    }
    , {
      path: 'sys_sent',
      component: resolve => require(['./components/sysSent.vue'], resolve),
      meta: {
        title: "上分",
        permission:store.state.permissions.permissionsData.post_reduce_score||store.state.permissions.permissionsData.operation,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>上分</li>`
      },
    },
    {
      path: 'sys_get',
      component: resolve => require(['./components/sysGet.vue'], resolve),
      meta: {
        title: "下分",
        permission:store.state.permissions.permissionsData.post_reduce_score,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>下分</li>`
      }
    },
    {
      path: 'registrationManagement',
      component: resolve => require(['./components/registrationManagement.vue'], resolve),
      meta: {
        title: "注册管理",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>注册管理</a></li><li>注册管理</li>`
      }
    },
    {
      path: 'registeredUsersList',
      component: resolve => require(['./components/registeredUsersList.vue'], resolve),
      meta: {
        title: "注册用户",
        permission:store.state.permissions.permissionsData.retrieve_reguser,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>注册用户</li>`
      }
    },
    {
      path: 'onlineUsersList',
      component: resolve => require(['./components/onlineUsersList.vue'], resolve),
      meta: {
        title: "在线用户",
        permission:store.state.permissions.permissionsData.view_onlineuser,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>在线用户</li>`
      }
    },
    {
      path: 'roleManagement',
      component: resolve => require(['./components/roleManagement.vue'], resolve),
      meta: {
        title: "角色管理",
        permission:store.state.permissions.permissionsData.view_rolelist,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>管理员管理</a></li><li>角色管理</li>`
      }
    },
    {
      path: 'usersList',
      component: resolve => require(['./components/usersList.vue'], resolve),
      meta: {
        title: "管理员列表",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>管理员管理</a></li><li>管理员列表</li>`
      }
    },
    {
      path: 'noticeManager',
      component: resolve => require(['./components/smallCom/noticeManager.vue'], resolve),
      meta: {
        title: "说明文字管理",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>说明文字管理</li>`
      }
    },
    {
      path: 'account',
      component: resolve => require(['./components/smallCom/account.vue'], resolve),
      meta: {
        title: "子账号管理",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>管理员管理</a></li><li>子账号管理</li>`
      }
    },
    {
      path: 'cashLog',
      component: resolve => require(['./components/smallCom/cashLog.vue'], resolve),
      meta: {
        title: "推水日志",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>推水日志</li>`
      }
    },
    {
      path: 'financeManagement',
      component: resolve => require(['./components/financeManagement.vue'], resolve),
      meta: {
        title: "财务设置",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>财务设置</li>`
      }
    },
    {
      path: 'financialStatements',
      component: resolve => require(['./components/financialStatements.vue'], resolve),
      meta: {
        title: "财务报表",
        permission:store.state.permissions.permissionsData.view_goldblack,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>财务报表</li>`
      }
    },
    {
      path: 'fishManagement',
      component: resolve => require(['./components/fishManagement.vue'], resolve),
      meta: {
        title: "捕鱼管理",
        permission:store.state.permissions.permissionsData.fishManagement,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>游戏管理</a></li><li>捕鱼管理</li>`
      }
    },

    {
      path: 'pokerManagement',
      component: resolve => require(['./components/pokerManagement.vue'], resolve),
      meta: {
        title: "棋牌管理",
        permission:store.state.permissions.permissionsData.pokerManagement,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>游戏管理</a></li><li>棋牌管理</li>`
      }
    },
    {
      path: 'operationList',
      component: resolve => require(['./components/operationList.vue'], resolve),
      meta: {
        title: "代运营列表",
        permission:store.state.permissions.permissionsData.view_operation_list,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li>运营者管理</li><li>代运营列表</li>`
      }
    },
    {
      path: 'bankScore',
      component: resolve => require(['./components/bank_score.vue'], resolve),
      meta: {
        title: "运营金币管理",
        permission:store.state.permissions.permissionsData.view_bank_list,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li>财务管理</li><li>运营金币管理</li>`
      }
    },
    {
      path: 'operUserList',
      component: resolve => require(['./components/operUserList.vue'], resolve),
      meta: {
        title: "子账号管理",
        permission:store.state.permissions.permissionsData.view_operation_childaccount,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>管理员管理</a></li><li>子账号管理</li>`
      }
    }, {
      path: 'scoreList',
      component: resolve => require(['./components/scoreList.vue'], resolve),
      meta: {
        title: "运营金币日志",
        permission:store.state.permissions.permissionsData.view_bank_list,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>运营金币日志</li>`
      }
    }, {
      path: 'userMsg',
      component: resolve => require(['./components/userMsg.vue'], resolve),
      meta: {
        title: "用户详情",
        permission:store.state.permissions.permissionsData.viewmsg_user,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>用户详情</li>`
      }
    },
    {
      path: 'allGameLog',
      component: resolve => require(['./components/allGameLog.vue'], resolve),
      meta: {
        title: "游戏日志",
        permission:store.state.permissions.permissionsData.view_game_log,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>游戏日志</li>`
      }
    },
    {
      path: 'allMarketLog',
      component: resolve => require(['./components/allMarketLog.vue'], resolve),
      meta: {
        title: "营销领取日志",
        permission:store.state.permissions.permissionsData.view_market_log,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>营销领取日志</li>`
      }
    },
    {
      path: 'lobbyManagement',
      component: resolve => require(['./components/lobbyManagement.vue'], resolve),
      meta: {
        title: "大厅活动管理",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>营销管理</a></li><li>大厅活动管理</li>`
      }
    },
    {
      path: 'download',
      component: resolve => require(['./components/download.vue'], resolve),
      meta: {
        title: "下载链接管理",
        permission:store.state.permissions.permissionsData.view_download,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>下载链接管理</li>`
      }
    },
    {
      path: 'noticeManagement',
      component: resolve => require(['./components/noticeManagement.vue'], resolve),
      meta: {
        title: "网站公告管理",
        permission:store.state.permissions.permissionsData.view_notice,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>网站公告管理</li>`
      }
    },
    {
      path: 'service',
      component: resolve => require(['./components/service.vue'], resolve),
      meta: {
        title: "客服管理",
        permission:store.state.permissions.permissionsData.view_service_list,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>网站管理</a></li><li>客服管理</li>`
      }
    },
    {
      path: 'adminService',
      component: resolve => require(['./components/adminService.vue'], resolve),
      meta: {
        title: "网站客服管理",
        permission:store.state.permissions.permissionsData.view_all_service_list,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>网站客服管理</li>`
      }
    },
    {
      path: 'gameStatistics',
      component: resolve => require(['./components/gameStatistics.vue'], resolve),
      meta: {
        title: "游戏统计",
        permission:store.state.permissions.permissionsData.view_game_count,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>游戏管理</a></li><li>游戏统计</li>`
      }
    },
    {
      path: 'sysMessage',
      component: resolve => require(['./components/sysMessage.vue'], resolve),
      meta: {
        title: "公告消息管理",
        permission:store.state.permissions.permissionsData.admin,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>公告消息管理</li>`
      }
    },

    {
      path: 'soleLog',
      component: resolve => require(['./components/solo/soleLog.vue'], resolve),
      meta: {
        title: "占成日志",
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>公告消息管理</li>`
      }
    },
    {
      path: 'operMessage',
      component: resolve => require(['./components/operMessage.vue'], resolve),
      meta: {
        title: "系统公告",
        permission:store.state.permissions.permissionsData.operation,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>系统公告</li>`
      }
    },
    {
      path: 'chat',
      component: resolve => require(['./components/chat.vue'], resolve),
      meta: {
        title: "系统问答",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>代理管理</a></li><li>系统问答</li>`
      }
    },
    {
      path: 'mesManage',
      component: resolve => require(['./components/mesManage.vue'], resolve),
      meta: {
        title: "系统消息",
        permission:store.state.permissions.permissionsData.agent,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li>信息管理</li><li>系统消息</li>`
      }
    },
    {
      path: 'notice',
      component: resolve => require(['./components/notice.vue'], resolve),
      meta: {
        title: "系统公告",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>系统公告</li>`
      }
    },
    {
      path: 'aPayList',
      component: resolve => require(['./components/aPayList.vue'], resolve),
      meta: {
        title: "代充账号列表",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>代充账号列表</li>`
      }
    },
    {
      path: 'aPayLog',
      component: resolve => require(['./components/aPayLog.vue'], resolve),
      meta: {
        title: "代充日志",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>代充日志</li>`
      }
    },
    {
      path: 'oPayLog',
      component: resolve => require(['./components/oPayLog.vue'], resolve),
      meta: {
        title: "代充日志",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>日志管理</a></li><li>代充日志</li>`
      }
    },
    {
      path: 'oPayList',
      component: resolve => require(['./components/oPayList.vue'], resolve),
      meta: {
        title: "代充账号列表",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>代充账号列表</li>`
      }
    },
    {
      path: 'oper_index_agent',
      component: resolve => require(['./components/oper_index_agent.vue'], resolve),
      meta: {
        title: "代理管理",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>代理管理</li>`
      }
    },
    {
      path: 'oper_customers',
      component: resolve => require(['./components/oper_customers.vue'], resolve),
      meta: {
        title: "代理关联用户",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>代理关联用户</li>`
      }
    },
    {
      path: 'solo_url',
      component: resolve => require(['./components/solo/solo_url.vue'], resolve),
      meta: {
        title: "域名管理",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>域名管理</li>`
      }
    },
    {
      path: 'solo_notice',
      component: resolve => require(['./components/solo/solo_notice.vue'], resolve),
      meta: {
        title: "系统公告",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>系统公告</li>`
      }
    },
    {
      path: 'solo_detail',
      component: resolve => require(['./components/solo/solo_detail.vue'], resolve),
      meta: {
        title: "个人信息",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>个人信息</li>`
      }
    },
    {
      path: 'solo_index_agent',
      component: resolve => require(['./components/solo/solo_index_agent.vue'], resolve),
      meta: {
        title: "代理管理",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>代理管理</li>`
      }
    },
    {
      path: 'solo_set_agent',
      component: resolve => require(['./components/solo/solo_set_agent.vue'], resolve),
      meta: {
        title: "新增代理",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>新增代理</li>`
      }
    },
    {
      path: 'solo_customers',
      component: resolve => require(['./components/solo/solo_customer.vue'], resolve),
      meta: {
        title: "客户管理",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>用户管理</a></li><li>客户管理</li>`
      }
    },
    {
      path: 'solo_withdrawals',
      component: resolve => require(['./components/solo/solo_withdrawals.vue'], resolve),
      meta: {
        title: "独家提款",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>独家提款</li>`
      }
    },
    {
      path: 'solo_commissions',
      component: resolve => require(['./components/solo/solo_commissions.vue'], resolve),
      meta: {
        title: "分成记录",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>分成记录</li>`
      }
    },
    {
      path: 'solo_day_report',
      component: resolve => require(['./components/solo/solo_day_report.vue'], resolve),
      meta: {
        title: "占成日报",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>占成日报</li>`
      }
    },
    {
      path: 'adminS_day_report',
      component: resolve => require(['./components/solo/adminS_day_report.vue'], resolve),
      meta: {
        title: "占成日报",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>统计报表</a></li><li>占成日报</li>`
      }
    },
    {
      path: 'adminS_index_agent',
      component: resolve => require(['./components/solo/adminS_index_agent.vue'], resolve),
      meta: {
        title: "独家列表",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>运营者管理</a></li><li>独家列表</li>`
      }
    },
    {
      path: 'adminS_detail',
      component: resolve => require(['./components/solo/adminS_detail.vue'], resolve),
      meta: {
        title: "占成报表",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>占成报表</li>`
      }
    },
    {
      path: 'sole_commission_change',
      component: resolve => require(['./components/solo/sole_commission_change.vue'], resolve),
      meta: {
        title: "分成变化",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>分成变化</li>`
      }
    },
    {
      path: 'sole_balance',
      component: resolve => require(['./components/solo/sole_balance.vue'], resolve),
      meta: {
        title: "占成结算",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>占成结算</li>`
      }
    },
    {
      path: 'solo_withdrawals',
      component: resolve => require(['./components/solo/solo_withdrawals.vue'], resolve),
      meta: {
        title: "独家提款",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>财务管理</a></li><li>独家提款</li>`
      }
    },
    {
      path: 'solo_code',
      component: resolve => require(['./components/solo/solo_code.vue'], resolve),
      meta: {
        title: "修改资料",
        permission:true,
        breadcrumb: `<li><a href="index.html"><i class="ti-home"></i> 首页</a></li><li><a>信息管理</a></li><li>修改资料</li>`
      }
    },
  ]
}, {
  path: '/login',
  component: resolve => require(['./components/login.vue'], resolve),
  meta: {
    title: "Login",
    breadcrumb: ``
  }
}];
export default routers;
