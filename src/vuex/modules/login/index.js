/**
 * Created by zhoutao on 2017/4/11.
 */
/**
 * Created by admin on 2017/1/12.
 */

import actions from './actions';
import mutations from './mutations';
export default {
  state: {
    loginData:{
      loginId:'',
      loginAgentName:'',
      loginName:'',
      loginScore:0,
      loginScale:0,
      loginIsOn:1,
      loginPerfect:0,
      loginIsAdmin:0,
      loginBankScore:'',
      isChild:0,
      isOperate:-1,
      pid:0,
      isSole:0,
      soleScore:0,
      createdAt:'',
      lastLoginTime:'',
      is_agent:0,
      sole_scale:0,
      qq:'',
      cell:'',
      email:'',
      default_scale:0,
      default_sole_scale:0,
      updateTime:''
    },
    token:''
  },
  actions: actions,
  mutations: mutations,
  getters:{
    getLoginData(state){
      return state.msg;
    }
  }
};
