/**
 * Created by zhoutao on 2017/4/11.
 */

import * as types from './mutation_type';

export default {
  [types.LOGIN_DATA] (state , loginData) {
    state.loginData.loginId = loginData.loginId;
    state.loginData.loginAgentName = loginData.loginAgentName;
    state.loginData.loginName = loginData.loginName;
    state.loginData.loginScore = loginData.loginScore;
    state.loginData.loginScale = loginData.loginScale;
    state.loginData.loginIsOn = loginData.loginIsOn;
    state.loginData.loginPerfect = loginData.loginPerfect;
    state.loginData.loginIsAdmin = loginData.loginIsAdmin;
    state.loginData.loginBankScore = loginData.loginBankScore;
    state.loginData.isChild = loginData.isChild;
    state.loginData.isOperate = loginData.isOperate;
    state.loginData.pid = loginData.pid;
    state.loginData.isSole = loginData.isSole;
    state.loginData.soleScore = loginData.soleScore;
    state.loginData.createdAt = loginData.createdAt;
    state.loginData.lastLoginTime = loginData.lastLoginTime;
    state.loginData.is_agent = loginData.is_agent;
    state.loginData.qq = loginData.qq;
    state.loginData.email = loginData.email;
    state.loginData.cell = loginData.cell;
    state.loginData.sole_scale = loginData.sole_scale;
    state.loginData.default_scale = loginData.default_scale;
    state.loginData.default_sole_scale = loginData.default_sole_scale;
    state.loginData.updateTime = loginData.updateTime;

  },
  [types.LOGIN_TOKEN] (state , loginToken) {
    state.token = loginToken;
  }
};
