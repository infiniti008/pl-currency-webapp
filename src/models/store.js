import Vuex from 'vuex';
import Vue from 'vue';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    country: config.DEFAULT_COUNTRY,
    isExpanded: window.Telegram?.WebApp?.isExpanded || false,
    firstNavButton: {
      component: '',
      isDisabled: false,
      action: ''
    },
    secondNavButton: {
      component: '',
      isDisabled: false,
      action: ''
    },
    thirdNavButton: {
      component: '',
      isDisabled: false,
      action: ''
    }
  },
  mutations: {
    setCountry(state, payload) {
      state.country = payload;
    },
    startObserveExpanded(state) {
      setInterval(() => {
        state.isExpanded = window.Telegram?.WebApp?.isExpanded;
      }, 500);
    },
    setFirstNavButton(state, payload) {
      state.firstNavButton = payload;
    },
    setSecondNavButton(state, payload) {
      state.secondNavButton = payload;
    },
    setThirdNavButton(state, payload) {
      state.thirdNavButton = payload;
    }
  }
});