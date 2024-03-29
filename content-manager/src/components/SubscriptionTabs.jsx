import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';

import TabJson from './TabJson';
import TabPhoto from './TabPhoto';
import TabForm from './TabForm';
import TabStatus from './TabStatus';

import '../assets/css/Tabs.scss'

function SubscriptionTabs({ handleSaveSubscription }) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const [currentTab, setCurrentTab] = useState('FORM')

  return (
    <div className='tabs'>
      <div className='tabs-header'>
        <div className={`tab-name ${currentTab === 'JSON' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'JSON')}>
          JSON
        </div>
        <div className={`tab-name ${currentTab === 'FORM' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'FORM')}>
          FORM
        </div>
        <div className={`tab-name ${currentTab === 'PHOTO' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'PHOTO')}>
          PHOTO
        </div>
        <div className={`tab-name ${currentTab === 'STATUS' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'STATUS')}>
          STATUS
        </div>
      </div>
      {currentTab === 'JSON' && <TabJson handleSaveSubscription={ handleSaveSubscription } />}
      {currentTab === 'PHOTO' && <TabPhoto handleSaveSubscription={ handleSaveSubscription } />}
      {currentTab === 'FORM' && <TabForm handleSaveSubscription={ handleSaveSubscription } />}
      {currentTab === 'STATUS' && <TabStatus />}
    </div>
  )
}

export default SubscriptionTabs