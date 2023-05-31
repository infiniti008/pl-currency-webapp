import Vue from 'vue';
import './style.scss';
import App from './App.vue';

import store from './models/store';

import './plugins/bus';

new Vue({
  render: (h) => h(App),
  store: store,
}).$mount('#app');
