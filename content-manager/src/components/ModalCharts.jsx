import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import { EventBusContext } from '../contexsts/eventBus';
import RealTimeHorizontalStreamChart from './Charts/RealTimeHorizontalStreamChart/RealTimeHorizontalStreamChart';
import { ToastContainer, toast } from 'react-toastify';

import '../assets/css/ModalStream.scss'
import Clock from './ui/Clock';
import { saveChartsView, getChartsView, removeChartsView } from '../api/services';
import displaySaveChartViewsPrompt from './ui/ToastSaveChartsView';
import Copyright from './ui/Copyright';
import Logo from './ui/Logo';

const initialChartsView = {
  charts: [],
  chartsViewName:'',
  isAllHidden: false,
  isAutoRun: true,
  url: '',
  selectedChartTemplate: ''
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
  const [selectedChartTemplate, setSelectedChartTemplate] = useState('')

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

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'

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
      setSelectedChartTemplate(loadedChartsView.selectedChartTemplate)

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
    clonedStore.isModalChartsOpened = !currentStore?.isModalChartsOpened

    setCurrentStore(clonedStore)

    document.body.style.overflow = ''
    document.body.style.marginRight = 'unset'
    emit('FETCH_ALL_SUBSCRIPTIONS', true)
  }

  function onClickAddKey() {
    if (selectedChartTemplate) {
      const clonedCharts = [...charts]
      clonedCharts.push({name: 'chart-' + new Date().valueOf(), model: {}})

      setCharts(clonedCharts)
    } else {
      toast.error('Please select Chart Template First')
    }
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

  function handleSelectedChartTemplate(event) {
    setSelectedChartTemplate(event.target.value)
  }

  async function handleOnclickRemove() {
    try {
      const response = await removeChartsView(selectedChartsView)
      if (response) {
        toast.success(`Chatrs View ${selectedChartsView} Removed`)
        setSelectedChartsView('')
        fetchAvailableChartsViews()
      }
      console.log(response)
    } catch(err) {
      console.log(err)
    }
  }

  async function handleOnclickUrl() {
    try {
      await navigator.clipboard.writeText(loadedChartsView.url);
      toast.info('URL copied to clipboard: ' + loadedChartsView.url)
    } catch (err) {
      console.error('Error in copying URL: ', err);
    }
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
      data.selectedChartTemplate = selectedChartTemplate

      const response = await saveChartsView(data)
    }
  }

  const chartItems = charts.map((chart, index) => {
    switch (selectedChartTemplate) {
      case 'RealTimeHorizontalStreamChart':
        return (
          <RealTimeHorizontalStreamChart
            chart={chart.name}
            key={chart.name}
            model={chart.model}
            handleRemoveChart={handleRemoveChart.bind(null, index)}
            isAllHidden={isAllHidden}
            handleSelectTimeZone={handleSelectTimeZone}
            handleStartChart={handleStartChart}
            index={index}
          />
        )    
      default:
        return ''
    }
  })

  const chartsViewOptions = availableChartsView.map(item => {
    return (
      <option key={item.chartsViewName} value={item.chartsViewName}>{item.chartsViewName}</option>
    )
  })

  const hideText = isAllHidden ? 'Expand' : 'Collapse'

  return (
    <div className='stream'>
      <div className='stream__container'>
        { isAllHidden &&
          <div className='stream__header'>
            <Logo />
            <Clock timeZone={timeZone} setIsAllHidden={setIsAllHidden.bind(null, false)} />
            <Copyright />
          </div>
        }
        {!isAllHidden && 
          <div className='stream__header'>
            <button onClick={setIsAllHidden.bind(null, !isAllHidden)} className='stream__close'>
              {hideText}
            </button>
            <button onClick={onClickAddKey} className='stream__close'>
              Add Chart
            </button>
            <button onClick={onClickSaveAll} className='stream__close'>
              Save All
            </button>
            <select className='stream__select' value={selectedChartTemplate} onChange={handleSelectedChartTemplate}>
              <option disabled value="">Select Charts Template</option>
              <option value="RealTimeHorizontalStreamChart">Real Time Horizontal Stream Chart</option>
            </select>
            <select className='stream__select' value={selectedChartsView} onChange={handleSelectChartsView}>
              <option disabled value="">Select Charts View</option>
              {chartsViewOptions}
            </select>
            <button onClick={handleOnclickUrl} className='stream__close'>URL</button>
            <button onClick={handleOnclickRemove} className='stream__close'>Remove</button>
            <button onClick={onClickClose} className='stream__close'>Close</button>
          </div>
        }
        <div className='stream__body'>
          {chartItems}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ModalStream