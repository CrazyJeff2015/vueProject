/**
 * Created by zhoutao on 2017/4/11.
 */

import * as types from './mutation_type';

export default {
  [types.READ_MSG] (state , unread) {
    state.unread = unread;
  },

};
