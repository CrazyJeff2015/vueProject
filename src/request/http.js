/**
 * Created by zhoutao on 2017/4/14.
 */

import axios from 'axios'
import store from '../vuex/store'
import api from '../request/api'
import Vue from 'vue';
import VueRouter from 'vue-router';

let instance = new Vue;
// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.baseURL = api.apiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.login.token) {
      config.headers.Authorization = `Bearer ${store.state.login.token}`;
  }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code == 400) {
      instance.$notify.error({
        title: '错误',
        message: response.data.message,
        offset: 100
      });

    } else if(response.data.code == 422){
      instance.$notify.error({
        title: '错误',
        message: response.data.message,
        offset: 100
      });
    }else if(response.data.code == 500){
      instance.$notify.error({
        title: '错误',
        message: '',
        offset: 100
      });
    }
    else{
      return response;
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 422:
          if (error.response.data.errors) {
            var obj = error.response.data.errors;
            var str = '';
            if (obj.length > 1) {
              for (var k in obj) {
                str = str + obj[k];
              }
              instance.$notify.error({
                title: '错误',
                message: str,
                offset: 100
              });
            } else {
              for (var k in obj) {
                str = str + '\n' + obj[k];
              }
              instance.$notify.error({
                title: '错误',
                message: str,
                offset: 100
              });
            }

          } else {
            instance.$notify.error({
              title: '错误',
              message: error.response.data.message,
              offset: 100
            });
          }
          break;
        case 400:
          if (error.response.data.errors) {
            var obj = error.response.data.errors;
            var str = '';
            if (obj.length > 1) {
              for (var k in obj) {
                str = str + obj[k];
              }
              instance.$notify.error({
                title: '错误',
                message: str,
                offset: 100
              });
            } else {
              for (var k in obj) {
                str = str + '\n' + obj[k];
              }
              instance.$notify.error({
                title: '错误',
                message: str,
                offset: 100
              });
            }

          } else {
            instance.$notify.error({
              title: '错误',
              message: error.response.data.message,
              offset: 100
            });
          }
          break;
        case 429:
          instance.$notify.error({
            title: '服务器繁忙',
            message: '请稍等，先喝杯茶吧 :)',
            offset: 100
          });
          if(error.response.data.message=='Unauthenticated.'){
            // instance.$router.push('/user/form_editors');
          }
          break;

        case 500:
          instance.$notify.error({
            title: '错误',
            message: '服务器出错',
            offset: 100
          });
          if(error.response.data.message=='Unauthenticated.'){
            instance.removeCookie;
            window.location.href = '/';
          }
          break;
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  });

export default axios;
