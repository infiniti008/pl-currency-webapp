import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';

import TabJson from './TabJson';
import TabPhoto from './TabPhoto';
import TabForm from './TabForm';
import TabFrames from './TabFrames';

import '../assets/css/Tabs.scss'

function SubscriptionTabs({ handleSaveSubscription }) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)
  const subscription = currentStore.subscriptionToOpenInModal

  const [currentTab, setCurrentTab] = useState('FORM')

  const isPhotoTabAvailable = subscription.platform !== 'subscriptions-video'
  const isFramesTabAvailable = subscription.platform === 'subscriptions-video'

  return (
    <div className='tabs'>
      <div className='tabs-header'>
        <div className={`tab-name ${currentTab === 'JSON' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'JSON')}>
          JSON
        </div>
        <div className={`tab-name ${currentTab === 'FORM' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'FORM')}>
          FORM
        </div>
        {isPhotoTabAvailable && <div className={`tab-name ${currentTab === 'PHOTO' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'PHOTO')}>
          PHOTO
        </div>}
        {isFramesTabAvailable && <div className={`tab-name ${currentTab === 'FRAMES' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'FRAMES')}>
          FRAMES
        </div>}
      </div>
      {currentTab === 'JSON' && <TabJson handleSaveSubscription={ handleSaveSubscription } />}
      {currentTab === 'PHOTO' && <TabPhoto handleSaveSubscription={ handleSaveSubscription } />}
      {currentTab === 'FORM' && <TabForm handleSaveSubscription={ handleSaveSubscription } />}
      {currentTab === 'FRAMES' && <TabFrames />}
    </div>
  )
}

export default SubscriptionTabs