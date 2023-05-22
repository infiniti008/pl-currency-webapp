import Vue from 'vue';
import './style.scss';
import App from './App.vue';

import store from './models/store';

import './plugins/bus';

const IS_DEV_MODE = window.location.search.indexOf('isDevMode=true') >= -1;
Vue.use({
  install() {
    Vue.IS_DEV_MODE = IS_DEV_MODE;
    Vue.prototype.$IS_DEV_MODE = IS_DEV_MODE;
  }
});

new Vue({
  render: (h) => h(App),
  store: store,
}).$mount('#app');
