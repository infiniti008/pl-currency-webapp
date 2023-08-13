import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { ToastContainer, toast } from 'react-toastify';
import { saveSubscription, deleteSubscription, createSubscription } from '../api/services';
import { EventBusContext } from './../contexsts/eventBus';

import '../assets/css/Modal.scss'
import '../assets/css/ModalSubscription.scss'
import SubscriptionTabs from './SubscriptionTabs';

function ModalSubscription() {
  const { emit } = useContext(EventBusContext)

  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  let cachedSubscription = currentStore.subscriptionToOpenInModal

  const [inProgrees, setInProgrees] = useState(false)

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
    document.body.style.marginRight = 'unset'
  }

  async function onClickDelete() {
    let text = "Are You Sure?\nEither OK or Cancel."
    if (confirm(text) == true) {
      try {
        const result = await deleteSubscription(cachedSubscription)
        if (result.status) {
          toast.success("Subscription succesful deleted", {
            position: toast.POSITION.BOTTOM_RIGHT
          });

          onClickClose()
          emit('FETCH_ALL_SUBSCRIPTIONS', true)
        } else {
          toast.error("Something went wrong! Please try again later!", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
      } catch(err) {
        console.log(err)
      }
    } else {
      console.log('You canceled!')
    }
  }

  async function handleSaveSubscription(newSubscription) {
    if (JSON.stringify(cachedSubscription) === JSON.stringify(newSubscription)) {
      toast.warn("Same Subscription! Nothing to Save", {
        position: toast.POSITION.BOTTOM_RIGHT
      });

      return
    }

    try {
      const isNewSubscription = newSubscription._id == false 
      setInProgrees(true)
      let response = {status: false}
      if (isNewSubscription) {
        response = await createSubscription(newSubscription)
      } else {
        response = await saveSubscription(newSubscription)
      }
      
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
    } catch(err) {
      toast.error("GENERAL ERROR", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } finally {
      setInProgrees(false)
    }
  }

  return (
    <div className='modal modal-subscription'>
      <div className='modal-overlay'></div>
      <div className='modal-container'>
        <div className="modal-header">
          Subscription
          <button onClick={onClickDelete} className='modal-subscription__btn-delete'>
            Delete
          </button>
          <button onClick={onClickClose} className='modal-close'>X</button>
        </div>
        <div className="modal-body">
          <SubscriptionTabs handleSaveSubscription={handleSaveSubscription}/>
        </div>
        {inProgrees && <div className='modal-subscription__in-progress' />}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ModalSubscription
