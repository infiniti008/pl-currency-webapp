import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import storiesModel from '../models/storiesModel';
import telegramModel from '../models/telegramModel';
import videoModel from '../models/videoModel';

import Inputs from './ui/Inputs';

let cachedSubscription = storiesModel.model

function TabForm({ handleSaveSubscription }) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);
  const defaultPlatform = currentStore.subscriptionToOpenInModal.platform
  const { descriptor, model } = getModel(defaultPlatform);

  const defaultValue = Object.assign({}, model, currentStore.subscriptionToOpenInModal)
  cachedSubscription = defaultValue

  const [subscription, setSubscription] = useState(defaultValue)
  const isNewSubscription = subscription._id == false

  function getModel(platform) {
    if (platform === 'subscriptions-stories') {
      return storiesModel
    } else if (platform === 'subscriptions-telegram') {
      return telegramModel
    } else if (platform === 'subscriptions-video') {
      return videoModel
    }
  }

  function handleReset() {
    setSubscription(cachedSubscription)
  }

  function isModelValid(model) {
    for(let key in model) {
      if (descriptor[key]?.isRequired) {
        if (descriptor[key].valueType.includes('[]') && !model[key].length) {
          return false
        } else if (!model[key]) {
          return false
        }
      }
    }
    
    return true
  }

  async function handleSave() {
    const newSubscription = {...cachedSubscription}

    Object.assign(newSubscription, subscription)
    for (const key in newSubscription) {
      if (descriptor[key]?.valueType === 'number' && newSubscription[key]) {
        newSubscription[key] = parseFloat(newSubscription[key])
      } else if (descriptor[key]?.valueType === 'string' && newSubscription[key]) {
        newSubscription[key] = newSubscription[key].trim()
      }
    }

    if (isModelValid(newSubscription)) {
      handleSaveSubscription(newSubscription)
    } else {
      toast.error("Model is NOT VALID!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  function handleUpdateOption(key, value) {
    if (key === 'platform') {
      const clonedStore = {...currentStore}
      const newModel = getModel(value).model
      clonedStore.subscriptionToOpenInModal = { ...newModel }
      cachedSubscription = { ...newModel }
      setCurrentStore(clonedStore)
      
      const clonedSubscription = { ...newModel }
      setSubscription(clonedSubscription)

      return
    }

    const clonedSubscription = {...subscription}
    clonedSubscription[key] = value
    setSubscription(clonedSubscription)
  }

  const confirmButtonText = isNewSubscription ? 'Create' : 'Save'
  const optionsObj = currentStore?.appSettings?.appSettings || {}
  optionsObj.templates = currentStore?.renderSettings.templates

  return (
    <div className='tab tab-form'>
      <div className='tab-content'>
        <Inputs descriptorModel={descriptor} handleUpdateOption={handleUpdateOption} object={subscription} model={model} optionsObj={optionsObj} />
      </div>
      <div className="tab-footer">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave}>
          {confirmButtonText}
        </button>
      </div>
      
    </div>
  )
}

export default TabForm
