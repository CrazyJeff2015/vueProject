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
  getRefreshData({ commit } , refreshData){
    commit(types.REFRESH_DATA , refreshData);
  }
};
