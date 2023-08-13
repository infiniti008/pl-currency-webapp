import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../assets/css/Modal.scss'
import { getRenderSettings, saveRenderSettings } from '../api/services';
import renderSettingsModel from '../models/renderSettingsModel';
import Inputs from './ui/Inputs';

const { descriptor, model } = renderSettingsModel;
let cachedSettings = model

function ModalSettings() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const [renderSettings, setRenderSettings] = useState(model)

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'
    document.body.style.marginRight = '15px'

    async function getSettings() {
      const settings = await getRenderSettings()
      cachedSettings = settings

      setRenderSettings(settings)
    }

    getSettings()
  }, [])

  function onClickClose() {
    const clonedStore = {...currentStore}
    clonedStore.isSettingsOpen = !currentStore?.isSettingsOpen
    setCurrentStore(clonedStore)
    document.body.style.overflow = ''
    document.body.style.marginRight = 'unset'
  }

  function handleReset() {
    setRenderSettings(cachedSettings)
  }

  async function handleSave() {
    const newSettings = {...cachedSettings}
    Object.assign(newSettings, renderSettings)
    for (const key in newSettings) {
      if (descriptor[key]?.valueType === 'number') {
        newSettings[key] = parseFloat(newSettings[key])
      } else if (descriptor[key]?.valueType === 'string') {
        newSettings[key] = newSettings[key].trim()
      }
    }
    const response = await saveRenderSettings(newSettings)
    if (response.status) {
      toast.success("Render Settings has been saved", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      cachedSettings = newSettings
    } else {
      toast.error("Render Settings has NOT been saved", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  function handleUpdateOption(key, value) {
    const clonedSettings = {...renderSettings}
    clonedSettings[key] = value
    setRenderSettings(clonedSettings)
  }

  return (
    <div className='modal'>
      <div className='modal-overlay'></div>
      <div className='modal-container'>
        <div className="modal-header">
          Render Settings
          <button onClick={onClickClose} className='modal-close'>X</button>
        </div>
        <div className="modal-body">
          <div className="render-settings">
            <Inputs descriptorModel={descriptor} handleUpdateOption={handleUpdateOption} object={renderSettings} model={model}/>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ModalSettings
