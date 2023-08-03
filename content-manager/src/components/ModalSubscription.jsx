import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../store';

import '../assets/css/Modal.scss'
import '../assets/css/ModalSubscription.scss'

function ModalSubscription() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'
  }, [])

  const defaultValue = JSON.stringify(currentStore.subscriptionToOpenInModal, null, 2)

  const [subscription, setSubscription] = useState(defaultValue)
  const [hasError, setHasError] = useState(false)

  function onClickClose() {
    const clonedStore = {...currentStore}
    clonedStore.isModalSubscriptionOpen = !currentStore?.isModalSubscriptionOpen
    clonedStore.subscriptionToOpenInModal = null
    setCurrentStore(clonedStore)
    document.body.style.overflow = ''
  }

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
      console.log(parsedSubscription)
    } catch(err) {
      console.log(err.message)
    }
  }

  function handleChange(event) {
    setSubscription(event.target.value)
    verify()

    console.log(hasError)
  }

  return (
    <div className='modal modal-subscription'>
      <div className='modal-overlay'></div>
      <div className='modal-container'>
        <div className="modal-header">
          Subscription
          <button onClick={onClickClose} className='modal-close'>X</button>
        </div>
        <div className="modal-body">
          <textarea className='modal-subscription__text ' value={subscription} onChange={handleChange}></textarea>
        </div>
        <div className="modal-footer">
          <button onClick={handleReset}>Reset</button>
          <button onClick={verify}>Verify</button>
          <button disabled={hasError} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default ModalSubscription
