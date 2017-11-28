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
    ifRefresh:true
  },
  actions: actions,
  mutations: mutations,
  getters:{
    getRefreshData(state){
      return state.msg;
    }
  }
};
