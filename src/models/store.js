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
    currentCancelOperation: ''
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
    }
  }
});