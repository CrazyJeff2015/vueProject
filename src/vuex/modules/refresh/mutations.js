/**
 * Created by zhoutao on 2017/4/11.
 */

import * as types from './mutation_type';

export default {
  [types.REFRESH_DATA] (state , refreshData) {
    state.ifRefresh = refreshData;
  }
};
