import { useState } from 'react'
import './assets/css/App.css'
import Sheet from './components/Sheet.jsx';
import TopBar from './components/TopBar.jsx';
import ModalSettings from './components/ModalSettings'

function App() {
  const initialStore = {
    isSettingsOpen: false
  }
  const [store, setStore] = useState(initialStore)

  function updateStore([key, value]) {
    const clonedStore = {...store};
    clonedStore[key] = value;

    setStore(clonedStore);
  }

  return (
    <>
      <TopBar store={store} updateStore={updateStore} />
      <Sheet />
      {store.isSettingsOpen && <ModalSettings store={store} updateStore={updateStore} />}
    </>
  )
}

export default App
