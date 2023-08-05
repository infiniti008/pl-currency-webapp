import { useContext, useState } from 'react';
import CurrentStoreContext from '../store';

import TabJson from './TabJson';

import '../assets/css/Tabs.scss'
import TabPhoto from './TabPhoto';

function SubscriptionTabs() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const [currentTab, setCurrentTab] = useState('JSON')

  return (
    <div className='tabs'>
      <div className='tabs-header'>
        <div className={`tab-name ${currentTab === 'JSON' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'JSON')}>
          JSON
        </div>
        <div className={`tab-name ${currentTab === 'CONFIG' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'CONFIG')}>
          CONFIG
        </div>
        <div className={`tab-name ${currentTab === 'PHOTO' ? 'active' : ''}`} onClick={setCurrentTab.bind(null, 'PHOTO')}>
          PHOTO
        </div>
      </div>
      {currentTab === 'JSON' && <TabJson />}
      {currentTab === 'PHOTO' && <TabPhoto />}
    </div>
  )
}

export default SubscriptionTabs