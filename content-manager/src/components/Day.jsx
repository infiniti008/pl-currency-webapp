import { useContext } from 'react';
import CurrentStoreContext from '../contexsts/store';

import Subscription from './Subscription'

import '../assets/css/Day.scss'


function Day({day}) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const filteredByCountrySubscriptions = day.subscriptions?.filter(item => currentStore.country === 'all' || item.country === currentStore.country)
  
  return <div className='day' key={ day.index }>
    { filteredByCountrySubscriptions.map(subscription => <Subscription subscription={subscription} key={subscription._id} />) }
  </div>
}

export default Day