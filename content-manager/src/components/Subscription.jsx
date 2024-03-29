import { useContext, useRef } from 'react';
import CurrentStoreContext from '../contexsts/store';

import IconStories from './icons/Stories';
import IconInfo from './icons/Info';
import IconFlagBelarus from './icons/IconFlagBelarus';
import IconFlagPoland from './icons/IconFlagPoland';
import IconSuccess from './icons/IconSuccess';
import IconError from './icons/IconError';

import '../assets/css/Subscription.scss'


function Subscription({subscription}) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const subscriptionRef = useRef(null);
  
  const isActive = currentStore.lastSelectedSubscription && currentStore.lastSelectedSubscription._id === subscription._id
  const postedStatus = subscription?.postingResults?.completed || false

  function handleClickInfo() {
    const clonedStore = {...currentStore}
    clonedStore.subscriptionToOpenInModal = subscription
    clonedStore.isModalSubscriptionOpen = !currentStore.isModalSubscriptionOpen
    clonedStore.lastSelectedSubscription = subscription
    clonedStore.lastSelectedElement = subscriptionRef.current
    setCurrentStore(clonedStore)
  }

  const subscriptionClassName = [
    isActive ? 'subscription subscription--active' : 'subscription',
    postedStatus ? 'subscription--posted-success' : 'subscription--posted-failed',
  ].join(' ')

  return (<div className={subscriptionClassName} ref={subscriptionRef} style={{boxShadow: 'inset 0px 0px 10px -6px' + subscription.color}}>
    {subscription.country === 'by' ? <IconFlagBelarus /> : <IconFlagPoland />}
    {postedStatus ? <IconSuccess /> : <IconError />}
    <IconStories />
    <IconInfo className="subscription__info" onClick={handleClickInfo} />
  </div>)
}

export default Subscription