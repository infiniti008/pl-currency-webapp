import { useState } from 'react'
import '../assets/css/TopBar.css'


function TopBar({store, updateStore}) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  function onClickMenu() {
    console.log('onClickMenu')
  }

  function onClickSettings() {
    document.body.style.overflow = 'hidden'
    updateStore(['isSettingsOpen', !store.isSettingsOpen])
  }

  return (
    <div className='top-bar'>
      <button onClick={onClickMenu}>
        Menu
      </button>
      <button onClick={onClickSettings}>
        Settings
      </button>
    </div>
  )
}

export default TopBar
