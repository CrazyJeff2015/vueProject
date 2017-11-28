/**
 * Created by zhoutao on 2017/4/14.
 */
export default {
  //后端域名
  apiUrl:"https://87.yiyefei.com/",

  //验证码
  imgUrl:"/v1/account/captcha/",

  // 登陆
  login:'/v1/account/loginByName',

  //退出登陆
  logout:'/v1/account/logout',


  //客户管理列表
  customersList:'/v1/customers',

  //超级管理客户列表
  sAdminCusList:'/v1/customers/admin',

  //赠送佣金
  giveMoney:'/v1/customers/donationAmount',

  //赠送佣金
  sysGiveMoney:'/v1/account/giveScore',

  //消费记录
  consume:'/v1/customers/consume/',

  //佣金分成记录
  commissions:'/v1/commissions',

  //管理员佣金分成记录
  AdminCommissions:'/v1/commissions/admin',

  //代理分成统计总计
  commissionsCount:'/v1/commissions/agentAllCount',

  //代理分成统计
  agentCount:'/v1/commissions/agentCount',

  //修改代理密码
  editPwd:'/v1/agent/editpwd',

  //完善代理密码
  addPwd:'/v1/agent/addpwd',

  //修改一级安全密码
  editPwd1:'/v1/agent/editpwd1',

  //修改二级安全密码
  editPwd2:'/v1/agent/editpwd2',

  //修改安全验证信息
  editSafeMsg:'/v1/agent/editsafemsg',

  //会员列表
  agentCustomersList:'/v1/agenttocustomer/index/',

  //下级代理管理列表
  indexAgent:'/v1/agenttocustomer/indexagent',

  //赠送代理客户佣金
  giveAgentCusMoney:'/v1/agenttocustomer/donationAmount',

  //代理客户消费记录
  agentCusConsume:'/v1/agenttocustomer/consume/',

  //我的佣金变化
  myChange:'/v1/mychange/money',

  //余额状态，代理状态
  agentStatus:'/v1/mychange/agentstadus',

  //佣金操作
  sentMoney:'/v1/nextAgent/updateScore/',

  //超级管理员新增链接
  createLink:'/v1/mychange/creadlink',

  //代理链接修改
  editLink:'/v1/mychange/editlink',

  //代理连接表
  agentLinkList:'/v1/mychange/show',

  //非100%代理连接表
  secLinkList:'/v1/mychange/shownext',

  //删除代理链接
  delAgentLink:'/v1/mychange/dellink',

  //文档编辑
  agentContent:'/v1/mychange/update',

  //文档编辑
  createContent:'/v1/mychange/creatcontent',

  //获取文档内容
  showAgentContent:'/v1/mychange/showcontent',

  //产品类型
  productType:'/v1/type/product',

  //综合统计
  totalAgent:'/v1/allstatistical/totalagent',

  //财务类型
  moneyType:'/v1/type/record',

  //日志管理
  log:'/v1/log',

  //日志类型
  logType:'/v1/type/log',

  //获取代理公告
  getAgentContent:'/v1/notice',

  //获取超级管理员公告
  getAdminContent:'/v1/notice/getAdminNotice',

  //创建公告
  addContent:'/v1/notice/store',

  //更新公告
  updateContent:'/v1/notice/update',


  //获取域名
  getUrlList:'/v1/name/MemberInfoTransformer',

  // 添加域名
  addUrl:'/v1/name/adddomain',

  // 修改域名
  updateUrl:'/v1/name/editdomain',

  //删除域名
  deleteUrl:'/v1/name/deldomain',

  // 开始下级代理
  setAgent:'/v1/account/setAgent',

  // 代理、统计
  statistics: '/v1/allstatistical/totalagent',

  // 域名统计
  urlList:'/v1/allstatistical/totalagent',

  //获取普通管理员下级代理信息
  adminNextAgent:'/v1/nextAgent',

  //获取管理员下级代理
  sAdminNextAgent:'/v1/nextAgent/adminIndex',

  //获取管理员客户管理列表
  adminCusList:'/v1/nextAgent/customers',


  //获取管理员客户消费记录
  adminCusConsume:'/v1/nextAgent/consume',

  //管理员设置代理状态
  adminSetAgentStatus:'/v1/nextAgent/activation',

  //管理员更新代理佣金比例
  adminSetAgentScale:'/v1/nextAgent',

  //管理员更新代理信息
  adminUpdateAgentInfo:'/v1/nextAgent/agentInfo',

  //管理员更新代理密码
  adminUpdateAgentSafe:'/v1/nextAgent/adminSetPwd',

  //99重置密码
  agentUpdateSafe:'/v1/nextAgent/agentSetPwd',

  //禁用用户
  stopLogin:'/v1/allstatistical/showagent',

  //登陆用户
  todayLogin:'/v1/allstatistical/logagent',

  //开始下级代理温馨提示
  warmNot:'/v1/agenttocustomer/showprompt/0',

  //代理分成统计温馨提示
  warmNot1:'/v1/agenttocustomer/showprompt/1',

  //编辑温馨提示
  editWarm:'/v1/agenttocustomer/update',

  //新增温馨提示
  addWarm:'/v1/agenttocustomer/createprompt',

  //查询uid
  getUid:"/v1/account/findUid",

  // 82
  //获取登陆用户信息
  updateUserInfo:"/v1/users/userInfo",
  //获取注册用户列表
  getRegisterList:"/v1/gameUser/registerList",

  //用户基本信息
  getUserBinfo:"/v1/gameUser/userInfo/",

  //用户游戏记录
  getGameInfo:"/v1/gameUser/gameLogInfo/",

  //用户登录信息列表
  getUserLoginList:"/v1/gameUser/loginLog/",

  //用户游戏列表
  getGameList:"/v1/gameUser/gameLogList/",

  //银行记录列表
  getBankList:"/v1/gameUser/bankLog/",

  //充值记录
  getDespositList:"/v1/gameUser/payLog/",

  //金币兑换记录
  getExchangeList:"/v1/gameUser/exLog/",

  //营销货币记录
  getMarketList:"/v1/gameUser/freeScoreLog/",

  //用户日志
  getUserLog:"/v1/gameUser/userLog/",

  //在线用户管理
  getOnlineUserList:"/v1/gameUser/onlineUser",

  //创建角色
  createRole:"/v1/permissions/createRole",

  //角色列表
  roleList:"/v1/permissions/roleList",

  //编辑角色
  editRole:"/v1/permissions/editRole/",

  //删除角色
  deleteRole:"/v1/permissions/delRole/",

  //角色绑定权限
  roleBindPermission:"/v1/permissions/roleBindPermission",

  //用户绑定角色
  userBindRole:"/v1/permissions/userBindRole",

  //获取权限列表
  getPermissionsList:"/v1/permissions/permissionsList",

  //获取注册限制列表
  getSetRegisterList:"/v1/systems/setRegisterList",

  //获取禁止列表
  getBanRegisterList:"/v1/systems/banRegisterList",

  //设置注册筛选
  setRegister:"/v1/systems/setRegister",

  //设置禁止注册
  banRegister:"/v1/systems/banRegister",

  //更新注册筛选
  editSetRegister:"/v1/systems/editRegisterRule/",

  //更新禁止注册
  editBanRegister:"/v1/systems/editBanRegisterRule/",

  //删除筛选注册
  deleteSetRegister:"/v1/systems/delRegisterRule/",

  //删除禁止注册
  deleteBanRegister:"/v1/systems/delBanRegisterRule/",

  //开设用户
  userRegister:"/v1/users/setUser",

  //获取用户列表
  getUsersList:"/v1/users/userList",

  //商城日换管理
  getExInfo:"/v1/finance/showExchange",

  //财务报表
  getFinList:"/v1/finance/financialStatements",

  //财务订单
  getFinOrders:"/v1/finance/financialOrder",

  //会计订单
  getAccountOrders:"/v1/finance/accountsOrder",

  //更新用户信息
  saveUserInfo:"/v1/gameUser/saveUserInfo/",

  //复位密保问题
  resetPwdQ:"/v1/gameUser/resetSecretQuestion/",

  //修改密码
  resetPwd:"/v1/gameUser/resetpwd/",

  //冻结游戏用户
  freezeGUser:"/v1/users/freezeUser",

  //解冻游戏用户
  unfreezeGUser:"/v1/users/thawUser",

  //导出文件
  portFile:"/v1/finance/exportExcel",

  //操作财务订单
  updateFinanceOrder:"/v1/finance/financialOrderstatus",

  //会计订单操作
  updateFinanceAcc:"/v1/finance/orderstatus",

  //赠送
  sentScore:'/v1/gameUser/giveFreeScore',

  //系数操作
  numChange:"/v1/gameUser/changeUserAi",

  //充值密码
  resetUserPwd:"/v1/account/resetPassword",

  //删除用户
  delUser:"/v1/account/delUser",

  //修改密码
  setPwd:"/v1/account/changePassword",

  //捕鱼列表
  getFishList:"/v1/gameManage/fishList",

  //捕鱼详情
  getFishInfo:"/v1/gameManage/fishInfo/",

  //修改捕鱼参数
  updateFishInfo:"/v1/gameManage/updateFish/",

  //重置捕鱼参数
  resetFishInfo:"/v1/gameManage/resetFish/",

  //查询订单
  queryOrder:"/v1/finance/queryOrder",

  //充值订单
  payOrder:"/v1/finance/payOrder",


  // 8118

  //代理转账日志
  giveMoneyLog:'/v1/account/giveScoreLog',

  adminGiveLog:'/v1/account/adminGiveScoreLog',

  //单个用户日志

  userMoneyLog:"/v1/account/userGiveLog",

  //赠送
  sent:"/v1/childAdmin/updateScore",

  //赠送日志
  sentLog:"/v1/childAdmin/scoreLog",

  //单月累计充值
  agentMouthCount:"/v1/account/monthCount",

  //admin单月累计充值
  adminMouthCount:"/v1/account/adminMonthCount",

  //全局管理概况
  userSurvey:'/v1/users/userSurvey',

  //代运营账号list
  getOperationList:"/v1/operation/operationList",

  //取消代运营
  cancelOp:"/v1/operation/removeOperation/",

  //金币列表
  getBankMoneyList:'/v1/operation/bankList',

  //编辑金币
  editBankScore:"/v1/operation/changeBankScore/",

  //代运营自身
  operUserList:"/v1/users/operateUserList",

  //金币记录
  bankScoreLog:'/v1/operation/bankScoreLog',

  //转代运营
  setOperate:'/v1/nextAgent/setOperate/',

  //快速新增
  fastAddAccount:'/v1/account/fastRegisterUser',

  //清空金币
  zero:'/v1/gameUser/resetUserScore',

  //棋牌列表
  getPokerList:'/v1/gameManage/pokerList',

  //修改棋牌
  updatePoker:'/v1/gameManage/updatePoker/',

  //所有游戏日志
  allGameLog:'/v1/log/gameLog',

  //营销领取记录
  allMarketLog:'/v1/log/marketLog',

  //下分
  sysGet:'/v1/account/postReduceScore',

  //大厅活动管理
  lobbyList:'/v1/marketing/lobbyActivity',

  //下载编程
  getDownList:'/v1/webManage/downloadList',

  //修改下载
  editDownload:'/v1/webManage/editDownload/',

  //获取公告列表
  getNotice:'/v1/webManage/noticeList',

  //编辑游戏公告
  editGameNotice:'/v1/webManage/saveNotice',

  //客服列表
  serviceList:'/v1/webManage/serviceList',

  //admin客服列表
  adminServiceList:'/v1/webManage/adminServiceList',

  //先建客服
  addService:'/v1/webManage/createService',

  //编辑客服
  editService:'/v1/webManage/editService/',

  //删除客服
  delService:'/v1/webManage/deleteService/',

  //游戏统计
  gameCount:'/v1/gameManage/gameCount',

  //修改限额
  changeLimit:'/v1/operation/updateBankScoreLimit/',

  //8118金币转换
  changeMarket:'/v1/operation/scoreTransform',

  //公告消息
  AdminMes:'/v1/notice/messageList',

  //编辑消息
  addAdminMes:'/v1/notice/createMessage',

  //删除
  delAdminMes:'/v1/notice/delMessage/',

  //更新问答
  editAAndQ:'/v1/notice/updateAAndQ/',

  //是否已读
  ifRead:'/v1/notice/setRead',

  //显示未读
  unreadNum:'/v1/notice/unRead',

  //非顶层message
  agentMQ:'/v1/notice/getMessage',

  //代运营MES
  operMessage:'/v1/notice/operationMessage',

  //带运营上线
  upOper:'/v1/nextAgent/onlineOperate/',

  //代运营查询状态
  checkOperStatus:'/v1/nextAgent/queryOperate',

  //修改工单
  editOperNote:'/v1/nextAgent/updateNoteOperate/',

  //测试用户
  addTestUser:'/v1/nextAgent/addTestUid/',

  //修改网站公告
  editNotice:'/v1/notice/updateMessage/',

  //代理限额记录
  limitLog:'/v1/operation/limitScoreLog/',

  //代运营客户
  operCustomers:'/v1/customers/operation',

  //佣金变化总计
  commissionCount:'/v1/mychange/moneyCount',

  //游戏用户信息
  gUserInfo:'/v1/account/gameUserInfo',

  //新权限列表
  newPermissionList:'/v1/permissions/newPermissionsList',

  //设置消息状态
  setOperMssUnActive:'/v1/notice/setUnActive/',

  //代运营金币列表自我统计
  operMyBankList:'/v1/operation/operationBank',

  //顶层看单用户上分记录
  adminUserMonthCount:"/v1/account/adminUserMonthCount",

  //代运营看单用户上分记录
  operUserMonthCount:"/v1/account/userMonthCount",

  //独家收益列表
  soloMoneyList:'/v1/sole/profit/profitList/',

  //独家收益总计
  soloInCount:'/v1/sole/profit/profitCount',

  //独家收益提取
  getSoloMoney:'/v1/sole/profit/updateProfit/',

  //独家日报
  getSoleDay:'/v1/sole/commissions/soleCount',

  //独家总计
  getSoleDayCount:'/v1/sole/commissions/soleAllCount',

  //顶层独家代理管理
  adminSIndex:'/v1/nextAgent/adminSoleIndex',

  //独家结算管理
  adminMoneyList:'/v1/sole/profit/adminProfitList',

  //顶层收益总计
  adminMoneyCount:'/v1/sole/profit/adminProfitCount',

  //财务日报list
  adminMoneyDay:'/v1/sole/commissions/adminSoleCount',

  //财务日报总计
  adminMoneyDayC:'/v1/sole/commissions/adminSoleAllCount',

  //运营号list
  operList:'/v1/gameUser/onlineUserAgent',

  //独家提款
  solo_sent:'/v1/customers/soleDonationAmount',

  //独家下级代理
  solo_index_agent:'/v1/nextAgent/soleIndex',

  //顶层独家
  adminDaySCount:'/v1/sole/profit/dayScoreCount',

  //独家分成统计
  solo_commission:'/v1/sole/commissions/soleScoreLog',

  //推水记录
  cash_log:'/v1/log/pushGameLog',

  //代理号只能提示
  showAname:'/v1/operation/findOperation',

  //无限制接口
  addGaccount:'/v1/account/unLimitRegisterUser',

  //sole 分成统计
  soleCommissions:'/v1/commissions/sole',

  //代运营 充值订单
  operWithList:'/v1/finance/operationPayOrder',

  //自身分成统计
  myCommissions:'/v1/commissions/myCount',

  //快速审批独家
  fastJudge:'/v1/sole/profit/fastJudgeSoleWork',

  //独家报表
  soleWorkData:'/v1/sole/profit/soleWorkData',

  //顶层代充账号列表
  aPayList:'/v1/agentPay/adminAgentPaylist',

  //代运营代充账号列表
  oPayList:'/v1/agentPay/operAgentPaylist',

  //代充金币操作
  sentBankScore:'/v1/agentPay/changeBankScore/',

  //代充接口
  giveScore:'/v1/agentPay/giveScore',

  //代充登录
  aPayLogin:'/v1/account/agentPayLogin',

  //admin代充日志
  aPayLog:'/v1/agentPay/adminPayLog',

  //oper代充日志
  oPayLog:'/v1/agentPay/operPayLog',

  //代理赠送记录
  aSentLog:'/v1/gameUser/agentGiveScoreLog/',

  //代理充值总计
  aLogCount:'/v1/gameUser/agentGiveScoreCount/',

  //我的代理链接
  myLink:'/v1/mychange/myAgentLink',

  //代运营独家结算
  operSoleJudge:'/v1/sole/profit/operProfitList',

  //代运营快速审批
  operFastJudge:'/v1/sole/profit/operFastJudgeSoleWork',

  //占成日志
  soleLog:'/v1/log/soleLog',

  //推广代理详情
  aNumInfo:"/v1/nextAgent/agentNumInfo/",

  //代理面板图表
  aEchat:"/v1/data/agentScoreStat",

  //代运营8118金币变化
  bankStat:'/v1/data/bankStat',

  //代运营代理用户总计
  agentAndUserStat:'/v1/data/agentAndUserStat',

  //顶层近7天新增代理用户
  addAgentAndUserStat:'/v1/data/addAgentAndUserStat',

  //顶层在线用户列表
  onlineStat:'/v1/data/onlineStat',

  //结算上周
  batchJudgeSoleWork:'/v1/sole/profit/batchJudgeSoleWork'

}
