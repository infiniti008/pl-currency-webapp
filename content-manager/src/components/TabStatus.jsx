import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';

function TabStatus() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const subscription = currentStore.subscriptionToOpenInModal
  console.log(subscription)
  const results = subscription?.postingResults || []
  const logs = results.logs?.map(logItem => {
    return (
      <li>{logItem}</li>
    )
  })

  return (
    <div className='tab tab-json'>
      <div className='tab-content'>
        <p>LOGS:</p>
        <ul>
          {logs}
        </ul>
      </div>
    </div>
  )
}

export default TabStatus