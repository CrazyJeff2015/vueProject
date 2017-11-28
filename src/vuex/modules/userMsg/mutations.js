/**
 * Created by zhoutao on 2017/4/11.
 */

import * as types from './mutation_type';

export default {
  [types.USER_MSG] (state , userMsg) {
    state.userMsg.uid = userMsg.uid;
    state.userMsg.ip = userMsg.ip;
    state.userMsg.is_on = userMsg.is_on;
    state.userMsg.login_num = userMsg.login_num;
    state.userMsg.no_login_days = userMsg.no_login_days;
    state.userMsg.location = userMsg.location;
    state.userMsg.gaccount = userMsg.gaccount;
  },

};
