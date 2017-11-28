/**
 * Created by zhoutao on 2017/4/11.
 */

import * as types from './mutation_type';
export default {
  /**
   * 增加todo
   * @param commit
   * @param mobile
   */
  getLoginData({ commit } , loginData){
    commit(types.LOGIN_DATA , loginData);
  },
  getToken({ commit } , loginToken){
    commit(types.LOGIN_TOKEN , loginToken);
  }
};
