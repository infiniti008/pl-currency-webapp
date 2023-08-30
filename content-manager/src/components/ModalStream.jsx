import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { EventBusContext } from './../contexsts/eventBus';
import StreamChart from './StreamChart';
import { ToastContainer } from 'react-toastify';

import '../assets/css/ModalStream.scss'

function ModalStream() {
  const { emit } = useContext(EventBusContext)
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'
  }, [])

  const [charts, setCharts] = useState([])
  const [isAllHidden, setIsAllHidden] = useState(false)

  function onClickClose() {
    const clonedStore = {...currentStore}
    clonedStore.isStreamModalOpened = !currentStore?.isStreamModalOpened

    setCurrentStore(clonedStore)
    document.body.style.overflow = ''
    document.body.style.marginRight = 'unset'
    emit('FETCH_ALL_SUBSCRIPTIONS', true)
  }

  function onClickAddKey() {
    const clonedCharts = [...charts]
    clonedCharts.push('-chart-' + new Date().valueOf())

    setCharts(clonedCharts)
  }

  function handleRemoveChart(indexToRemove) {
    const filteredCharts = charts.filter((_, index) => indexToRemove !== index)
    setCharts(filteredCharts)
  }

  const chartItems = charts.map((chart, index) => {
    return (
      <StreamChart chart={index + chart} key={index + chart} handleRemoveChart={handleRemoveChart.bind(null, index)} isAllHidden={isAllHidden} />
    )
  })

  const hideText = isAllHidden ? '>' : '<'

  return (
    <div className='stream'>
      <div className='stream__container'>
        <div className='stream__header'>
          <button onClick={setIsAllHidden.bind(null, !isAllHidden)} className='stream__close'>
            {hideText}
          </button>
          {
            !isAllHidden && 
            <button onClick={onClickAddKey} className='stream__close'>
              Add Chart
            </button>
          }
          <button onClick={onClickClose} className='stream__close'>X</button>
        </div>
        <div className='stream__body'>
          {chartItems}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ModalStream