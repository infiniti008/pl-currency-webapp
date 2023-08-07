import { useState } from 'react';
import './assets/css/App.scss'
import Sheet from './components/Sheet.jsx';
import TopBar from './components/TopBar.jsx';
import ModalSettings from './components/ModalSettings'
import ModalSubscription from './components/ModalSubscription'
import CurrentStoreContext from './store';

function App() {
  const initialStore = {
    isSettingsOpen: false,
    isModalSubscriptionOpen: false,
    subscriptionToOpenInModal: null,
    country: 'all',
    generatedPhotoName: null
  }
  const [currentStore, setCurrentStore] = useState(initialStore)

  return (
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
    </CurrentStoreContext.Provider>
  )
}

export default App
