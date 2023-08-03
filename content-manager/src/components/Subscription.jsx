import { useContext } from 'react';
import CurrentStoreContext from '../store';

import IconStories from './icons/Stories';
import IconInfo from './icons/Info';
import IconFlagBelarus from './icons/IconFlagBelarus';
import IconFlagPoland from './icons/IconFlagPoland';

import '../assets/css/Subscription.scss'

function Subscription({subscription}) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  function handleClickInfo() {
    const clonedStore = {...currentStore}
    clonedStore.subscriptionToOpenInModal = subscription
    clonedStore.isModalSubscriptionOpen = !currentStore.isModalSubscriptionOpen
    setCurrentStore(clonedStore)
  }

  return (<div className='subscription' style={{boxShadow: 'inset 0px 0px 6px 0px' + subscription.color}}>
    {subscription.country === 'by' ? <IconFlagBelarus /> : <IconFlagPoland />}
    <IconStories />
    <IconInfo className="subscription__info" onClick={handleClickInfo} />
  </div>)
}

export default Subscription