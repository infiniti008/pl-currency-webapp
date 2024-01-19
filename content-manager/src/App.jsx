import { useState, useEffect } from 'react';
import './assets/css/App.scss'
import Sheet from './components/Sheet.jsx';
import TopBar from './components/TopBar.jsx';
import ModalSettings from './components/ModalSettings'
import ModalSubscription from './components/ModalSubscription'
import ModalStream from './components/ModalCharts'
import ModalKeys from './components/modals/ModalKeys'
import CurrentStoreContext from './contexsts/store';

import { EventBusProvider } from './contexsts/eventBus';
import { getAppSettings, getRenderSettings } from './api/services';

const keysToDisableDisplayingSheet = ['chartsViewName']

function App() {
  const initialStore = {
    isSettingsOpen: false,
    isModalSubscriptionOpen: false,
    subscriptionToOpenInModal: null,
    country: 'all',
    platform: 'all',
    generatedPhotoName: null,
    isEmptyRowsCollapsed: true,
    isModalChartsOpened: false,
    isModalKeysOpened: false,
    lastSelectedSubscription: null,
    lastSelectedElement: null,
    appSettings: {
      appSettings: {}
    },
    keys: []
  }

  const [currentStore, setCurrentStore] = useState(initialStore)
  const [chartsViewNameFromPath, setChartsViewNameFromPath] = useState('')
  const [showSheet, setShowSheet] = useState(false)

  async function fetchAppSettings(extendingToStore) {
    try {
      const appSettings = await getAppSettings()
      const renderSettings = await getRenderSettings()
      const clonedStore = {...currentStore}
      clonedStore.appSettings = appSettings
      clonedStore.renderSettings = renderSettings
      Object.assign(clonedStore, extendingToStore)
      let keys = []
      for(const key in appSettings) {
        if (key.startsWith('keys_')) {
          const country = key.split('keys_')[1]
          const keysFromCountry = appSettings[key].map(keyItem=> {
            keyItem.country = country
            return keyItem
          })
          keys = [...keys, ...keysFromCountry]
        }
      }

      clonedStore.keys = keys
      setCurrentStore(clonedStore)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const search = window.location.search || ''
    const searchWithoutQuestion = search.split('?')[1] || ''
    const splittedSearch = searchWithoutQuestion.split('&')
    const searchMap = splittedSearch.reduce((acc, item) => {
      const splittedItem = item.split('=')
      if (splittedItem.length === 2) {
        acc[splittedItem[0]] = splittedItem[1]
      }
      return acc
    }, {})

    let isModalChartsOpened = false

    if (searchMap.chartsViewName) {
      setChartsViewNameFromPath(searchMap.chartsViewName)
      isModalChartsOpened = true
    }

    fetchAppSettings({isModalChartsOpened})

    if (!Object.keys(searchMap).some(searchKey => keysToDisableDisplayingSheet.includes(searchKey))) {
      setShowSheet(true)
    }
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
        {showSheet && <Sheet /> }
        {currentStore.isSettingsOpen && <ModalSettings />}
        {currentStore.isModalSubscriptionOpen && <ModalSubscription />}
        {currentStore.isModalChartsOpened && <ModalStream chartsViewNameFromPath={chartsViewNameFromPath} />}
        {currentStore.isModalKeysOpened && <ModalKeys />}
      </CurrentStoreContext.Provider>
    </EventBusProvider>
  )
}

export default App
