// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './router';
import App from './App.vue';
import axios from './request/http';
import store from './vuex/store';
import tool from './tool/tool.js';
import VueQuillEditor from 'vue-quill-editor';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'


Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.use(tool);
Vue.prototype.$ajax = axios;
Vue.use(VueRouter);


const RouterConfig = {
  routes: Routers,
  linkActiveClass: "active"
};


const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
  if(!$.cookie('87info') && to.path !== '/login') {

    next('/login');
  } else {
    if($.cookie('87info') && to.path === '/login') {
      next('/');
    } else {

      next();
    }
  }
});

router.afterEach((to, from) => {
    document.title = to.meta.title;
    // setTimeout(function() {
    //     $("#menu").find("li.active").parents("li").addClass("active");
    //     $("#menu").metisMenu();
    // }, 0);
    if($(window).width()<=992){
      $('.row-offcanvas').toggleClass('active').toggleClass("relative");
      $('.left-side').removeClass("collapse-left");
    }
});

new Vue({
    router,
    store,
    template: '<App/>',
    components: { App }
}).$mount('#app');
