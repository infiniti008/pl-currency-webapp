import { useState, useEffect } from 'react';
import './assets/css/App.scss'
import Sheet from './components/Sheet.jsx';
import TopBar from './components/TopBar.jsx';
import ModalSettings from './components/ModalSettings'
import ModalSubscription from './components/ModalSubscription'
import ModalStream from './components/ModalStream'
import CurrentStoreContext from './contexsts/store';

import { EventBusProvider } from './contexsts/eventBus';
import { getAppSettings } from './api/services';

function App() {
  const initialStore = {
    isSettingsOpen: false,
    isModalSubscriptionOpen: false,
    subscriptionToOpenInModal: null,
    country: 'all',
    generatedPhotoName: null,
    isEmptyRowsCollapsed: false,
    isStreamModalOpened: false,
    appSettings: {
      appSettings: {}
    }
  }
  const [currentStore, setCurrentStore] = useState(initialStore)

  async function fetchAppSettings() {
    try {
      const appSettings = await getAppSettings()
      const clonedStore = {...currentStore}
      clonedStore.appSettings = appSettings
      setCurrentStore(clonedStore)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAppSettings()
  }, []);

  return (
    <EventBusProvider>
      <CurrentStoreContext.Provider
        value={{
          currentStore,
          setCurrentStore
        }}
      >
        <TopBar />
        <Sheet />
        {currentStore.isSettingsOpen && <ModalSettings />}
        {currentStore.isModalSubscriptionOpen && <ModalSubscription />}
        {currentStore.isStreamModalOpened && <ModalStream />}
      </CurrentStoreContext.Provider>
    </EventBusProvider>
  )
}

export default App
