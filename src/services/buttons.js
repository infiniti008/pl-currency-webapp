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
        action: 'saveSettingsChanges'
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
  },
  PageHello: {
    init(store) {
      store.commit('setThirdNavButton', {
        component: 'CurrencySVG',
        isDisabled: false,
        action: 'handleOpenCurrencyPage'
      });
    }
  },
  PageSubscriptions: {
    init(store) {
      store.commit('setThirdNavButton', {
        component: 'AddSVG',
        isDisabled: false,
        action: 'addSubscription'
      });
    },
    hasSelectedItem(store, value) {
      store.commit('setFirstNavButton', {
        component: 'DeleteSVG',
        isDisabled: value,
        action: 'deleteSubscription'
      });

      store.commit('setSecondNavButton', {
        component: 'UpdateSVG',
        isDisabled: value,
        action: 'manageSubscription'
      });
    }
  },
  PageManageSubscription: {
    init(store) {
      store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: true,
        action: 'clearSubscriptionChanges'
      });
  
      store.commit('setSecondNavButton', {
        component: 'ConfirmSVG',
        isDisabled: true,
        action: 'saveSubscriptionChanges'
      });

      store.commit('setThirdNavButton', {
        component: 'BackSVG',
        isDisabled: false,
        action: 'handleReturnBack'
      });
    },
    hasChangesToSave(store, value) {
      store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: value,
        action: 'clearSubscriptionChanges'
      });

      store.commit('setSecondNavButton', {
        component: 'ConfirmSVG',
        isDisabled: value,
        action: 'saveSubscriptionChanges'
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