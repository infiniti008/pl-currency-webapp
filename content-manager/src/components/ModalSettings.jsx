import { useContext, useEffect } from 'react';
import CurrentStoreContext from '../store';

import '../assets/css/Modal.scss'
// import '../assets/css/ModalSettings.scss'

function ModalSettings() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'
  }, [])

  function onClickClose() {
    const clonedStore = {...currentStore}
    clonedStore.isSettingsOpen = !currentStore?.isSettingsOpen
    setCurrentStore(clonedStore)
    document.body.style.overflow = ''
  }

  return (
    <div className='modal'>
      <div className='modal-overlay'></div>
      <div className='modal-container'>
        <div className="modal-header">
          Settings
          <button onClick={onClickClose} className='modal-close'>X</button>
        </div>
        <div className="modal-body">
          {/* <label htmlFor="">
            <input type="checkbox" name="skip" id="" />
          </label> */}
        </div>
      </div>
    </div>
  )
}

export default ModalSettings
