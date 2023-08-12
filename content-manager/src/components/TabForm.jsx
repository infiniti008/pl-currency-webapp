import { useContext, useState } from 'react';
import CurrentStoreContext from '../store';

import 'react-toastify/dist/ReactToastify.css';

import storiesModel from '../models/storiesModel';
import Input from './ui/Input';

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

    // const clonedStore = {...currentStore}
    // clonedStore.subscriptionToOpenInModal = newSubscription
    // setCurrentStore(clonedStore)

    handleSaveSubscription(newSubscription)
  }

  function handleUpdateOption(key, value) {
    const clonedSubscription = {...subscription}
    clonedSubscription[key] = value
    setSubscription(clonedSubscription)
  }

  const inputs = Object.keys(subscription).filter(key => descriptor[key]?.editable).map(key => {
    const subscriptionPropperty = subscription[key] ?? model[key]

    return (
      <Input 
        key={key}
        value={subscriptionPropperty}
        itemKey={key}
        handleUpdateOption={handleUpdateOption.bind(null, key)}
        descriptor={descriptor}
      />
    )
  })

  return (
    <div className='tab tab-form'>
      <div className='tab-content'>
        {inputs}
      </div>
      <div className="tab-footer">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave}>Save</button>
      </div>
      
    </div>
  )
}

export default ModalSettings
