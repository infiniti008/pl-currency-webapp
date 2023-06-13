import Vuex from 'vuex';
import Vue from 'vue';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {
      defaultCountry: config.defaultCountry,
      isStartWithFavorite: config.isStartWithFavorite,
      isPremium: false,
      limitFreeKeysInOneSubscription: config.limitFreeKeysInOneSubscription,
      intervals: [],
      countries: config.countries,
      countryFlags: []
    },
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
    },
    curentSubscriptionToManage: null
  },
  mutations: {
    setCountry(state, payload) {
      state.config.defaultCountry = payload;
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
    },
    setCurentSubscriptionToManage(state, payload) {
      state.curentSubscriptionToManage = payload;
    },
    setConfig(state, payload) {
      state.config = payload;
    },
  }
});