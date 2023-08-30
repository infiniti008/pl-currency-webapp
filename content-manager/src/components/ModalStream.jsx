import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { EventBusContext } from './../contexsts/eventBus';
import StreamChart from './StreamChart';
import { ToastContainer } from 'react-toastify';

import '../assets/css/ModalStream.scss'
import Clock from './ui/Clock';
import { saveChartsView, getChartsView } from '../api/services';
import displaySaveChartViewsPrompt from './ui/ToastSaveChartsView';

const initialChartsView = {
  charts: [],
  chartsViewName:'',
  isAllHidden: false,
  isAutoRun: true,
  url: ''
}

function ModalStream({ chartsViewNameFromPath }) {
  const { emit } = useContext(EventBusContext)
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const [charts, setCharts] = useState([])
  const [isAllHidden, setIsAllHidden] = useState(false)
  const [timeZone, setTimeZone] = useState('')
  const [selectedChartsView, setSelectedChartsView] = useState(chartsViewNameFromPath)
  const [loadedChartsView, setLoadedChartsView] = useState(initialChartsView)
  const [availableChartsView, setAvailableChartsView] = useState([])

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'

    async function fetchAvailableChartsViews() {
      try {
        const chartsViews = await getChartsView('all')
        if (chartsViews) {
          setAvailableChartsView(chartsViews)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchAvailableChartsViews()
  }, [])

  useEffect(() => {
    if (loadedChartsView.chartsViewName) {
      const newCharts = loadedChartsView.charts.map((item, i) => {
        item.isAutoRun = loadedChartsView.isAutoRun
        return {name: i + '-chart-' + new Date().valueOf(), model: item}
      })
      setSelectedChartsView(loadedChartsView.chartsViewName)
      setIsAllHidden(loadedChartsView.isAllHidden)

      setCharts(newCharts)
    }
  }, [loadedChartsView])

  useEffect(() => {
    async function fetchChartView() {
      try {
        const newChartsView = await getChartsView(selectedChartsView)
        if (!newChartsView) return
        setLoadedChartsView(newChartsView)
      } catch (err) {
        console.log(err)
      }
    }
    if (selectedChartsView) {
      fetchChartView()
    }
  }, [selectedChartsView])

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
    clonedCharts.push({name: 'chart-' + new Date().valueOf(), model: {}})

    setCharts(clonedCharts)
  }

  function handleRemoveChart(indexToRemove) {
    const filteredCharts = charts.filter((_, index) => indexToRemove !== index)
    setCharts(filteredCharts)
  }

  function handleSelectTimeZone(timeZone) {
    setTimeZone(timeZone)
  }

  function handleStartChart(name, model) {
    const startedChart = charts.find(item => item.name === name)
    startedChart.model = model
  }

  function handleSelectChartsView(event) {
    setSelectedChartsView(event.target.value)
  }

  async function onClickSaveAll() {
    console.log('onClickSaveAll')
    if (charts.length > 0) {
      const data = {
        charts: charts.map(item => item.model)
      }

      const promtData = await displaySaveChartViewsPrompt(loadedChartsView)

      if (!promtData) {
        return
      }

      Object.assign(data, promtData)

      const href = window.location.href
      const isHrefWithQuestion = href.includes('?')
      const delimiter = isHrefWithQuestion ? '&' : '?'
      data.url = `${href}${delimiter}chartsViewName=${promtData.chartsViewName}`

      const response = await saveChartsView(data)
    }
  }

  const chartItems = charts.map((chart, index) => {
    return (
      <StreamChart
        chart={chart.name}
        key={chart.name}
        model={chart.model}
        handleRemoveChart={handleRemoveChart.bind(null, index)}
        isAllHidden={isAllHidden}
        handleSelectTimeZone={handleSelectTimeZone}
        handleStartChart={handleStartChart}
      />
    )
  })

  const chartsViewOptions = availableChartsView.map(item => {
    return (
      <option key={item.chartsViewName} value={item.chartsViewName}>{item.chartsViewName}</option>
    )
  })

  const hideText = isAllHidden ? '+' : '<'

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
          {
            !isAllHidden && 
            <button onClick={onClickSaveAll} className='stream__close'>
              Save All
            </button>
          }
          {
            !isAllHidden && 
            <select value={selectedChartsView} onChange={handleSelectChartsView}>
              <option disabled value="">Select Charts View</option>
              {chartsViewOptions}
            </select>
          }
          { isAllHidden && <Clock timeZone={timeZone} /> }
          <button onClick={onClickClose} className='stream__close'>-</button>
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