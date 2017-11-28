/**
 * Created by zhoutao on 2017/4/11.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login/index.js';
import permissions from './modules/permissions/index';
import userMsg from './modules/userMsg/index';
import unread from './modules/unread/index';
import fresh from './modules/refresh/index';



Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login:login,
    permissions:permissions,
    userMsg:userMsg,
    unread:unread,
    fresh:fresh
  },
});
