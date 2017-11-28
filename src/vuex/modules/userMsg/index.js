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
    userMsg:{
      uid:'',
      ip:'',
      is_on:'',
      login_num:'',
      no_login_days:'',
      location:'',
      gaccount:'',
    },
  },
  actions: actions,
  mutations: mutations,
  getters:{
    getUserData(state){
      return state.msg;
    }
  }
};
