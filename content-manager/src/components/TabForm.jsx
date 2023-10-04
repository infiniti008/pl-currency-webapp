import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import storiesModel from '../models/storiesModel';
import Inputs from './ui/Inputs';

const { descriptor, model } = storiesModel;
let cachedSubscription = model

function TabForm({ handleSaveSubscription }) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const defaultValue = currentStore.subscriptionToOpenInModal
  cachedSubscription = defaultValue

  const [subscription, setSubscription] = useState(defaultValue)
  const isNewSubscription = subscription._id == false

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
    const clonedSubscription = {...subscription}
    clonedSubscription[key] = value
    setSubscription(clonedSubscription)
  }

  const confirmButtonText = isNewSubscription ? 'Create' : 'Save'

  return (
    <div className='tab tab-form'>
      <div className='tab-content'>
        <Inputs descriptorModel={descriptor} handleUpdateOption={handleUpdateOption} object={subscription} model={model} optionsObj={currentStore?.appSettings?.appSettings} />
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
