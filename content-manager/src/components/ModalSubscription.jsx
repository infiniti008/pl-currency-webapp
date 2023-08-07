import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../store';

import '../assets/css/Modal.scss'
import '../assets/css/ModalSubscription.scss'
import SubscriptionTabs from './SubscriptionTabs';

function ModalSubscription() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'
    document.body.style.marginRight = '15px';
  }, [])

  function onClickClose() {
    const clonedStore = {...currentStore}
    clonedStore.isModalSubscriptionOpen = !currentStore?.isModalSubscriptionOpen
    clonedStore.generatedPhotoName = null
    clonedStore.subscriptionToOpenInModal = null
    setCurrentStore(clonedStore)
    document.body.style.overflow = ''
    document.body.style.marginRight = 'unset';
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
          <SubscriptionTabs />
        </div>
      </div>
    </div>
  )
}

export default ModalSubscription
