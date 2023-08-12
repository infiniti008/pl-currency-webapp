import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../store';
import { ToastContainer, toast } from 'react-toastify';
import { saveSubscription } from '../api/services';

import '../assets/css/Modal.scss'
import '../assets/css/ModalSubscription.scss'
import SubscriptionTabs from './SubscriptionTabs';

function ModalSubscription() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  let cachedSubscription = currentStore.subscriptionToOpenInModal

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

  async function handleSaveSubscription(newSubscription) {
    if (JSON.stringify(cachedSubscription) === JSON.stringify(newSubscription)) {
      toast.warn("Same Subscription! Nothing to Save", {
        position: toast.POSITION.BOTTOM_RIGHT
      });

      return
    }

    const response = await saveSubscription(newSubscription)
    if (response.status) {
      toast.success("Subscription has been saved", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      
      const clonedStore = {...currentStore}
      clonedStore.subscriptionToOpenInModal = newSubscription
      setCurrentStore(clonedStore)

      cachedSubscription = newSubscription
    } else {
      toast.error("Subscription has NOT been saved", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
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
          <SubscriptionTabs handleSaveSubscription={handleSaveSubscription}/>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  )
}

export default ModalSubscription
