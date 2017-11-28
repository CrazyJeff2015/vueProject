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
    unread:0
  },
  actions: actions,
  mutations: mutations,
  getters:{
    getNum(state){
      return state.msg;
    }
  }
};
