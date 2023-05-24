const buttons = {
  PageSettings: {
    init(store) {
      store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: true,
        action: 'clearSettingsChanges'
      });
  
      store.commit('setSecondNavButton', {
        component: 'ConfirmSVG',
        isDisabled: true,
        action: 'clearSettingsChanges'
      });
  
      store.commit('setThirdNavButton', {
        component: 'BackSVG',
        isDisabled: false,
        action: 'handleReturnBack'
      });
    },
    hasSettintsChanges(store, value) {
      store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: value,
        action: 'clearSettingsChanges'
      });

      store.commit('setSecondNavButton', {
        component: 'ConfirmSVG',
        isDisabled: value,
        action: 'saveSettingsChanges'
      });
    }
  },
  PageMenu: {
    init(store) {
      store.commit('setThirdNavButton', {
        component: 'BackSVG',
        isDisabled: false,
        action: 'handleReturnBack'
      });
    }
  },
  PageContact: {
    init(store) {
      store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: true,
        action: 'clearMessageChanges'
      });
  
      store.commit('setSecondNavButton', {
        component: 'ConfirmSVG',
        isDisabled: true,
        action: 'saveMessageChanges'
      });
  
      store.commit('setThirdNavButton', {
        component: 'BackSVG',
        isDisabled: false,
        action: 'handleReturnBack'
      });
    },
    message(store, value) {
      store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: value,
        action: 'clearMessageChanges'
      });

      store.commit('setSecondNavButton', {
        component: 'ConfirmSVG',
        isDisabled: value,
        action: 'saveMessageChanges'
      });
    }
  }
};

function initButtons(page, store) {
  buttons[page].init(store);
}

function updateButtonsByKey(page, store, key, value) {
  buttons[page][key](store, value);
}

export default {
  initButtons,
  updateButtonsByKey
};