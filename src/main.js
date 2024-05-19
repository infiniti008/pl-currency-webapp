import Vue from 'vue';
import './style.scss';
import App from './App.vue';
import Render from './Render.vue';
import Feed from './Feed.vue';

import store from './models/store';

import './plugins/bus';
import './plugins/toast';

const routes = {
  '/': App,
  '/render': Render,
  '/feed': Feed
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || App
    }
  },
  render (h) { return h(this.ViewComponent) },
  store: store,
});
