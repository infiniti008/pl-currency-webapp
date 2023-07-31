import { useState } from 'react'
import '../assets/css/ModalSettings.scss'

function ModalSettings({store, updateStore}) {
  function onClickClose() {
    updateStore(['isSettingsOpen', !store.isSettingsOpen])
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
          <label htmlFor="">
            <input type="checkbox" name="skip" id="" />

          </label>
        </div>
      </div>
    </div>
  )
}

export default ModalSettings
