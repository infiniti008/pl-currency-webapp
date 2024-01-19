import { useContext, useRef } from 'react';
import CurrentStoreContext from '../contexsts/store';

import IconStories from './icons/Stories';
import IconVideo from './icons/Video';
import IconTelegram from './icons/Telegram';
import IconInfo from './icons/Info';
import IconFlagBelarus from './icons/IconFlagBelarus';
import IconFlagPoland from './icons/IconFlagPoland';

import '../assets/css/Subscription.scss'


function Subscription({subscription}) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const subscriptionRef = useRef(null);
  
  const isActive = currentStore.lastSelectedSubscription && currentStore.lastSelectedSubscription._id === subscription._id

  function handleClickInfo() {
    const clonedStore = {...currentStore}
    clonedStore.subscriptionToOpenInModal = subscription
    clonedStore.isModalSubscriptionOpen = !currentStore.isModalSubscriptionOpen
    clonedStore.lastSelectedSubscription = subscription
    clonedStore.lastSelectedElement = subscriptionRef.current
    setCurrentStore(clonedStore)
  }

  const subscriptionClassName = [
    isActive ? 'subscription subscription--active' : 'subscription'
  ].join(' ')

  const getSubscriptionIcon = () => {
    if (subscription.platform === 'subscriptions-telegram') {
      return <IconTelegram />
    }

    if (subscription.platform === 'subscriptions-stories') {
      return <IconStories />
    }

    if (subscription.platform === 'subscriptions-video') {
      return <IconVideo />
    }
  }

  return (<div className={subscriptionClassName} ref={subscriptionRef} style={{boxShadow: 'inset 0px 0px 10px -6px' + subscription.color}}>
    {subscription.country === 'by' ? <IconFlagBelarus /> : <IconFlagPoland />}
    { getSubscriptionIcon() }
    <IconInfo className="subscription__info" onClick={handleClickInfo} />
  </div>)
}

export default Subscription