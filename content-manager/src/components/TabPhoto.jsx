import { useContext, useState } from 'react';
import CurrentStoreContext from '../store';
import { getGenerateImage } from '../api/services';

import IconSpinner from './icons/IconSpinner';

function TabPhoto() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const subscriptionToOpenInModal = currentStore.subscriptionToOpenInModal

  let lastPublishedDay = getLastPublishedDay(subscriptionToOpenInModal);

  const [time, setTime] = useState(subscriptionToOpenInModal.time)
  const [selectedDate, setDate] = useState(lastPublishedDay)
  const [renderingInProgress, setRenderingInProgress] = useState(false)

  async function handleClickGenerate() {
    console.log('handleClickGenerate')
    try {
      setRenderingInProgress(true)
      const subscription = subscriptionToOpenInModal
      const fileName = await getGenerateImage({subscription, time, selectedDate});

      const clonedStore = {...currentStore}
      clonedStore.generatedPhotoName = fileName
      setCurrentStore(clonedStore)
      
      setRenderingInProgress(false)
    } catch(err) {
      console.log(err);
    }
  }

  function handleChangeTime(event) {
    setTime(event.target.value)
  }

  function handleChangeDate(event) {
    setDate(event.target.value)
  }

  return (
    <div className="tab tab-photo">
      <div className='tab-content'>
        {
          currentStore.generatedPhotoName && !renderingInProgress && 
          <img src={currentStore.generatedPhotoName} crossOrigin="anonymous" className='tab-photo__image' />
        }
        {
          renderingInProgress && 
          <div className="tab-photo__spinner" >
            <IconSpinner />
          </div>
        }
      </div>
      <div className="tab-footer">
        <button onClick={handleClickGenerate}>
          Generate
        </button>
        <input type="time" value={time} onChange={handleChangeTime} />
        <input type="date" value={selectedDate} onChange={handleChangeDate} />
      </div>
    </div>
  )
}

function getLastPublishedDay(subscription) {
  let lastPublishedDay = ''
  const now = new Date()

  const initialAvailability = subscription.weekAvailability || '*******'
  let availability = initialAvailability.split('')

  let dayOfWeek = now.getDay() - 1;
  if (dayOfWeek === -1) {
    dayOfWeek = 6;
  }

  dayOfWeek = 4

  availability = availability.slice(0, dayOfWeek);
  availability = availability.join('')
  availability = initialAvailability + availability
  availability = availability.split('')
  const lastDayIndex = availability.lastIndexOf('*')
  const diff = (availability.length - lastDayIndex) + 1
  const date = new Date(now.setDate(now.getDate() - diff))

  lastPublishedDay = date.toISOString().split('T')[0]

  return lastPublishedDay
}

export default TabPhoto