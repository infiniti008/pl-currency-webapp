import Vuex from 'vuex';
import Vue from 'vue';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    country: config.DEFAULT_COUNTRY,
    isConfirmAvailable: false,
    isCancelAvailable: false,
    currentConfirmOperation: '',
    currentCancelOperation: '',
    isExpanded: window.Telegram?.WebApp?.isExpanded,
  },
  mutations: {
    setCountry(state, payload) {
      state.country = payload;
    },
    toggleConfirmButtonAvailability(state, payload) {
      state.isConfirmAvailable = payload;
    },
    toggleCancelButtonAvailability(state, payload) {
      state.isCancelAvailable = payload;
    },
    setCurrentConfirmOperation(state, payload) {
      state.currentConfirmOperation = payload;
    },
    setCurrentCancelOperation(state, payload) {
      state.currentCancelOperation = payload;
    },
    startObserveExpanded(state) {
      setInterval(() => {
        state.isExpanded = window.Telegram?.WebApp?.isExpanded;

        // console.log('window.Telegram?.WebApp', window.Telegram?.WebApp);
        // console.log('state.isExpanded', state.isExpanded);
      }, 1000);
    }
  }
});