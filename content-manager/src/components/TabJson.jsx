import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';

function TabJson({ handleSaveSubscription }) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const defaultValue = JSON.stringify(currentStore.subscriptionToOpenInModal, null, 2)

  const [subscription, setSubscription] = useState(defaultValue)
  const [hasError, setHasError] = useState(false)

  function verify() {
    try {
      JSON.parse(subscription)
      setHasError(false)
    } catch(err) {
      setHasError(true)
    }
  }

  function handleReset() {
    setSubscription(defaultValue)
    verify()
  }

  function handleSave() {
    try {
      const parsedSubscription = JSON.parse(subscription)

      handleSaveSubscription(parsedSubscription)
    } catch(err) {
      console.log(err.message)
    }
  }

  function handleChange(event) {
    setSubscription(event.target.value)
    verify()
  }

  return (
    <div className='tab tab-json'>
      <div className='tab-content'>
        <textarea className={`tab-json__text ${hasError ? 'has-error' : ''}`} value={subscription} onChange={handleChange}></textarea>
      </div>
      <div className="tab-footer">
        <button onClick={handleReset}>Reset</button>
        <button onClick={verify}>Verify</button>
        <button disabled={hasError} onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

export default TabJson