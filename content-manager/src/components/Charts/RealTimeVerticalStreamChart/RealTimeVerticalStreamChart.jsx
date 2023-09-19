import { useContext, useState, useEffect, useRef } from 'react';
import CurrentStoreContext from '../../../contexsts/store';
import ChartElement from './Chart';
import CustomTooltip from './CustomTooltip';
import { getKeyData } from '../../../api/services';
import { toast } from 'react-toastify';
import { format, addMinutes, parse, sub } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import $s from './StreamChart.module.scss';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const LABELS_DIFF_IN_MINUTES = 5

function RealTimeVerticalStreamChart({ chart, handleRemoveChart, isAllHidden, handleSelectTimeZone, handleStartChart, model, index }) {
  const { currentStore } = useContext(CurrentStoreContext)
  const nowDate = new Date()
  const initialEndTime = format(nowDate, 'HH:mm')
  const initialStartTime =  format(sub(nowDate, { hours: 3 }), 'HH:mm');
  const initialDraw = {
    isDataReady: false,
    labels: [],
    firstPoint: {},
    lastPoint: {},
    prevLastPoint: {},
    datasetMin: 0,
    datasetMax: 0,
    preparedDataFromBase: []
  }
  const initialConfig = {
    selectedCountry: '',
    selectedKey: '',
    selectedPointSize: 0,
    startTime: '',
    endTime: '',
    timeZone: '',
    color: '',
    colorRGB: '',
    currencyKeyObj: {}
  }

  const [isAutoRun, set_isAutoRun] = useState(false)
  const [isStarted, set_isStarted] = useState(false)
  const [selectedCountry, set_selectedCountry] = useState('')
  const [selectedKey, set_selectedKey] = useState('')
  const [startTime, set_startTime] = useState(initialStartTime)
  const [endTime, set_endTime] = useState(initialEndTime)
  const [color, set_color] = useState('#84c8ff')
  const [selectedPointSize, set_selectedPointSize] = useState(1)
  const [timeZone, set_timeZone] = useState('')
  const [colorRGB, set_colorRGB] = useState('0, 0, 0')
  const [currentSettedPoint, setCurrentSettedPoint] = useState({})

  const [config, set_config] = useState(initialConfig)
  const ref_config = useRef(config);

  const [dataSet, set_dataSet] = useState([])
  const ref_dataSet = useRef(dataSet);

  const [draw, set_draw] = useState(initialDraw)
  const ref_draw = useRef(draw);

  const [currentPointIndex, set_currentPointIndex] = useState(0)
  const ref_currentPointIndex = useRef(currentPointIndex);

  useEffect(() => {
    const interval = setInterval(drawNextPoint, 1000);

    if (model.selectedKey) {
      console.log('Select data from Model', model)
      set_selectedCountry(model.selectedCountry)
      set_selectedKey(model.selectedKey)
      set_startTime(model.startTime)
      set_endTime(model.endTime)
      set_color(model.color)
      set_selectedPointSize(model.selectedPointSize)
      if (model.isAutoRun) {
        set_isAutoRun(true)
      }
    }
      
    return () => {
      clearInterval(interval);
    };
  }, [])

  useEffect(() => {
    if (isAutoRun && !isStarted) {
      startDrawing()
    }
  }, [isAutoRun])

  useEffect(() => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };

    set_colorRGB(`${result.r}, ${result.g}, ${result.b}`)
  }, [color])

  useEffect(() => {
    switch (selectedCountry) {
      case 'by':
        set_timeZone('Europe/Minsk')
        handleSelectTimeZone('Europe/Minsk')
        break;
      case 'pl':
        set_timeZone('Europe/Warsaw')
        handleSelectTimeZone('Europe/Warsaw')
        break;
      default:
        set_timeZone('Europe/Warsaw')
        handleSelectTimeZone('Europe/Warsaw')
        break;
    }
  }, [selectedCountry])

  useEffect(() => {
    ref_draw.current = draw;
  }, [draw])

  useEffect(() => {
    ref_config.current = config;
  }, [config])

  useEffect(() => {
    ref_dataSet.current = dataSet;
  }, [dataSet])

  useEffect(() => {
    ref_currentPointIndex.current = currentPointIndex;
  }, [currentPointIndex])

  const settings = currentStore?.appSettings || {}
  const keysArr = settings['keys_' + selectedCountry] || []

  const keys = keysArr.map(key => {
    return (
      <option key={key.key} value={key.key}>
        {key.currency} - {key.name}
      </option>
    )
  })

  function onChange(setter, event) {
    setter(event.target.value)
  }

  function handleToggleStarted() {
    if (!isStarted) {
      startDrawing()
    } else {
      endDrawing()
    }
  }

  function startDrawing() {
    const isAllFieldsFilled = selectedCountry && selectedKey && startTime && endTime && color && selectedPointSize
    if (isAllFieldsFilled) {
      console.log('isAllFieldsFilled')
      const startedChart = {
        selectedCountry,
        selectedKey,
        startTime,
        endTime,
        color,
        selectedPointSize
      }

      handleStartChart(chart, startedChart)

      const newConfig = Object.assign({}, initialConfig)

      const definedKeyObj = keysArr.find(item => item.key === selectedKey) || {}

      newConfig.selectedCountry = selectedCountry
      newConfig.selectedKey = selectedKey
      newConfig.selectedPointSize = selectedPointSize
      newConfig.startTime = startTime
      newConfig.endTime = endTime
      newConfig.timeZone = timeZone
      newConfig.color = color
      newConfig.colorRGB = colorRGB
      newConfig.currencyKeyObj = definedKeyObj

      set_config(newConfig)
      ref_config.current = newConfig

      fetchData(true)

      set_isStarted(true)
    } else {
      toast.error("Please fill all fields", {
        position: toast.POSITION.BOTTOM_RIGHT
      });

      set_isStarted(false)
    }
  }

  function endDrawing() {
    console.log('endDrawing')
    set_draw(initialDraw)
    set_config(initialConfig)
    set_dataSet([])
    set_isStarted(false)
  }

  async function fetchData() {
    console.log('fetchData')
    const _config = ref_config.current
    try {
      const startTimeStamp = getTimeStamp(_config.startTime)
      const endTimeStamp = getTimeStamp(_config.endTime) + 10000

      const request = {
        country: _config.selectedCountry,
        key: _config.selectedKey,
        startTime: _config.startTime,
        endTime: _config.endTime,
        startTimeStamp,
        endTimeStamp
      }

      const data = await getKeyData(request)

      if (data.length) {
        setDataToDrawing(data)
      } else (
        endDrawing()
      )
    } catch(err) {
      console.log(err)
      endDrawing()
    }
  }

  function setDataToDrawing(data) {
    console.log('setDataToDrawing')
    const newDraw = Object.assign({}, initialDraw)
    
    const preparedDataSet = prepareDataToChart(data)

    const firstOne = preparedDataSet[0]
    const lastOne = preparedDataSet.findLast(item => item.y ? true : false) || firstOne
    const prevLastOne = preparedDataSet.findLast(item => item.y && item.y !== lastOne.y ? true : false) || firstOne
    const datasetMin = Math.min(...preparedDataSet.filter(item => item.y !== null).map(item => item.y))
    const datasetMax = Math.max(...preparedDataSet.filter(item => item.y !== null).map(item => item.y))

    newDraw.isDataReady = true
    newDraw.preparedDataFromBase = preparedDataSet
    newDraw.firstPoint = firstOne
    newDraw.lastPoint = lastOne
    newDraw.prevLastPoint = prevLastOne
    newDraw.datasetMax = datasetMax
    newDraw.datasetMin = datasetMin
    newDraw.firstPoint = firstOne
    newDraw.labels = prepareLabels()

    set_draw(newDraw)

    set_currentPointIndex(0)
  }

  function drawNextPoint() {
    const _draw = ref_draw.current
    
    if (_draw.isDataReady) {
      console.log('Draw Next Point')
      const _dataSet = ref_dataSet.current
      const _currentPointIndex = ref_currentPointIndex.current

      const clonedDataSet = [..._dataSet]
      const itemToFillByTime = _draw.preparedDataFromBase[_currentPointIndex]
      if (itemToFillByTime) {
        const nextItemIndex = _currentPointIndex + 1
        const nextItemToFillByTime = _draw.preparedDataFromBase[nextItemIndex]
        clonedDataSet[_currentPointIndex] = Object.assign({}, itemToFillByTime)
        
        if (nextItemToFillByTime) {
          clonedDataSet[nextItemIndex] = { x: nextItemToFillByTime.x, y: null }
        }

        setCurrentSettedPoint(clonedDataSet[_currentPointIndex])
        set_dataSet(clonedDataSet)

        set_currentPointIndex(nextItemIndex)
      }
      else {
        console.log('Need to fetch new data')
        set_currentPointIndex(0)
        fetchData()
      }
    }
  }  

  function prepareLabels() {
    const _config = ref_config.current
    const newLabels = [_config.startTime]
    let count = 0
    const countLimit = 100

    const intOfEndTime = getIntFromTime(_config.endTime)
    let previousTime = parse(newLabels[newLabels.length - 1], "HH:mm", new Date())
    let nextTime = format(addMinutes(previousTime, LABELS_DIFF_IN_MINUTES), 'HH:mm')
    let intOfNextTime = getIntFromTime(nextTime)

    while(count < countLimit && intOfNextTime < intOfEndTime) {
      previousTime = parse(newLabels[newLabels.length - 1], "HH:mm", new Date())
      nextTime = format(addMinutes(previousTime, LABELS_DIFF_IN_MINUTES), 'HH:mm')
      intOfNextTime = getIntFromTime(nextTime)

      newLabels.push(nextTime)
      count += 1
    }

    return newLabels
  }

  function prepareDataToChart(data) {
    const newDataSet = []

    data.forEach(item => {
      const newTimeZone = ref_config.current.timeZone
      let time = new Date(item.timestamp)
      time = formatInTimeZone(time, newTimeZone, 'HH:mm')
      newDataSet.push({ x: time, y: item.value })
    })

    return newDataSet
  }

  function getTimeStamp(time) {
    const newTimeZone = ref_config.current.timeZone
    let timeStamp = parse(`${time}`, "HH:mm", new Date())
    timeStamp = zonedTimeToUtc(timeStamp, newTimeZone);
    timeStamp = utcToZonedTime(timeStamp, currentTimeZone);
    timeStamp = timeStamp.valueOf()

    return timeStamp
  }

  function getIntFromTime(time) {
    return parseInt(time.split(':').join(''))
  }

  const actionButtonText = isStarted ? 'Stop' : 'Start'

  const chartClasses = [
    $s.chart,
    isAllHidden ? $s['chart--full'] : ''
  ].join(' ')

  return (
    <div className={chartClasses}>
      {
        !isAllHidden &&
        <div className={$s['chart__config']}>
          <div className={$s['chart__config-group']}>
            <select className={$s['chart__config-select']} value={selectedCountry} onChange={onChange.bind(null, set_selectedCountry)}>
              <option value="" disabled>Country</option>
              <option value="pl">PL</option>
              <option value="by">BY</option>
            </select>
            <select className={$s['chart__config-select']} value={selectedPointSize} onChange={onChange.bind(null, set_selectedPointSize)}>
              <option value="" disabled>Point</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className={$s['chart__config-group']}>
            <select className={$s['chart__config-select']} value={selectedKey} onChange={onChange.bind(null, set_selectedKey)}>
              <option value="" disabled>Key</option>
              {keys}
            </select>
          </div>
          <div className={$s['chart__config-group']}>
            <label htmlFor="">
              Start Time
            </label>
            <input type="time" value={startTime} onChange={onChange.bind(null, set_startTime)} />
          </div>
          <div className={$s['chart__config-group']}>
            <label htmlFor="">
              End Time
            </label>
            <input type="time" value={endTime} onChange={onChange.bind(null, set_endTime)} />
          </div>
          <div className={$s['chart__config-group']}>
            <input className={$s['color-chart-' + index]} type="color" value={color} style={{ ['--after-color-chart-' + index]: color }} onChange={onChange.bind(null, set_color)} />
          </div>
          <button onClick={handleToggleStarted}>
            {actionButtonText}
          </button>
          <button onClick={handleRemoveChart}>Remove</button>
        </div>
      }
      <div className={$s['chart__view']}>
        {
          draw.isDataReady && 
          <ChartElement
            key={chart + 'chartElement-' + config.selectedKey}
            dataSet={dataSet}
            labels={draw.labels}
            colorRGB={config.colorRGB}
            datasetMin={draw.datasetMin}
            datasetMax={draw.datasetMax}
            selectedKey={chart + config.selectedKey}
            selectedPointSize={config.selectedPointSize}
          />
        }
      </div>
      {draw.isDataReady && 
        <CustomTooltip 
          key={chart + 'chartElementTooltip-' + config.selectedKey}
          config={config}
          currencyKey={config.currencyKeyObj}
          dataSet={dataSet}
          firstPoint={draw.firstPoint}
          labels={draw.labels}
          lastPoint={draw.lastPoint}
          prevLastPoint={draw.prevLastPoint}
          colorRGB={config.colorRGB}
          datasetMin={draw.datasetMin}
          datasetMax={draw.datasetMax}
          selectedKey={chart + config.selectedKey}
          selectedPointSize={config.selectedPointSize}
          currentSettedPoint={currentSettedPoint}
        />
      }
    </div>
  )
}

export default RealTimeVerticalStreamChart