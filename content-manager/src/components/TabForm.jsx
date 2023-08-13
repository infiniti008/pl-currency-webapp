import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';

import 'react-toastify/dist/ReactToastify.css';

import storiesModel from '../models/storiesModel';
import Inputs from './ui/Inputs';

const { descriptor, model } = storiesModel;
let cachedSubscription = model

function ModalSettings({ handleSaveSubscription }) {
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

    handleSaveSubscription(newSubscription)
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
        <Inputs descriptorModel={descriptor} handleUpdateOption={handleUpdateOption} object={subscription} model={model}/>
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

export default ModalSettings
