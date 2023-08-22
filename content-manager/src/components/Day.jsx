import { useContext } from 'react';
import CurrentStoreContext from '../contexsts/store';

import Subscription from './Subscription'

import '../assets/css/Day.scss'


function Day({day, isSameDay}) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const filteredByCountrySubscriptions = day.subscriptions?.filter(item => currentStore.country === 'all' || item.country === currentStore.country)
  const sameDayClass = isSameDay ? 'day--current' : ''
  const dayClasses = `day ${sameDayClass}`
  
  return <div className={dayClasses} key={ day.index }>
    { filteredByCountrySubscriptions.map(subscription => <Subscription subscription={subscription} key={subscription._id} />) }
  </div>
}

export default Day