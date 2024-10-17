import { useContext, useState, useEffect, useRef } from 'react';
import CurrentStoreContext from '../../../contexsts/store';
import ChartElement from './Chart';
import CustomTooltip from './CustomTooltip';
import { getKeyData } from '../../../api/services';
import { toast } from 'react-toastify';
import { format, addMinutes, parse, sub, addDays } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import $s from './StreamChart.module.scss';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const LABELS_DIFF_IN_MINUTES = 5

const getLocationParams = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params;
};

const params = getLocationParams();
const startDaysAgoParam = parseInt(params.get('startDaysAgo')) || 0;
const groupByMinsParam =  parseInt(params.get('groupByMins')) || 1;

function StaticHorizontalPanelChart({ chart, handleRemoveChart, isAllHidden, handleSelectTimeZone, handleStartChart, model, index }) {
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
    startDaysAgo: startDaysAgoParam,
    groupByMins: groupByMinsParam,
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
  const [startDaysAgo, set_startDaysAgo] = useState(startDaysAgoParam)
  const [groupByMins, set_groupByMins] = useState(groupByMinsParam)
  const [endTime, set_endTime] = useState(initialEndTime)
  const [color, set_color] = useState('#84c8ff')
  const [selectedPointSize, set_selectedPointSize] = useState(1)
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
    let interval = null;

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
      if (model.startDaysAgo) {
        set_startDaysAgo(model.startDaysAgo)
      }
      if (model.groupByMins) {
        set_groupByMins(model.groupByMins)
      }
    }

    if(!model.isStaticImage) {
      interval = setInterval(drawNextPoint, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      setTimeout(() => {
        drawFullChart()
      }, 3000);
    }
  }, [])

  useEffect(() => {
    if (isAutoRun && !isStarted) {
      startDrawing()
    }
  }, [isAutoRun])

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
      const newTimeZone = getTimeZone(selectedCountry)
      const newColorRGB = parseHexColor(color)

      newConfig.selectedCountry = selectedCountry
      newConfig.selectedKey = selectedKey
      newConfig.selectedPointSize = selectedPointSize
      newConfig.startTime = startTime
      newConfig.startDaysAgo = startDaysAgo
      newConfig.groupByMins = groupByMins
      newConfig.endTime = endTime
      newConfig.timeZone = newTimeZone
      newConfig.color = color
      newConfig.colorRGB = newColorRGB
      newConfig.currencyKeyObj = definedKeyObj

      set_config(newConfig)
      ref_config.current = newConfig

      fetchData()

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
      const startTimeStamp = getTimeStamp(_config.startTime, _config.startDaysAgo)
      const endTimeStamp = getTimeStamp(_config.endTime) + 10000

      const request = {
        country: _config.selectedCountry,
        key: _config.selectedKey,
        startTime: _config.startTime,
        endTime: _config.endTime,
        startTimeStamp,
        endTimeStamp,
        groupByMins: _config.groupByMins
      }

      const data = await getKeyData(request)

      if (data.length) {
        setDataToDrawing(data)
      } else {
        setTimeout(fetchData, 10000)
      }
    } catch(err) {
      console.log(err)
      setTimeout(fetchData, 10000)
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

  function drawFullChart() {
    console.log('Draw Full Chart')
    const _draw = ref_draw.current
    
    if (_draw.isDataReady) {      
      setCurrentSettedPoint(_draw.preparedDataFromBase[_draw.preparedDataFromBase.length - 1])

      set_currentPointIndex(_draw.preparedDataFromBase.length - 1)
      set_dataSet(_draw.preparedDataFromBase)
    }
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
      const format = ref_config.current.startDaysAgo > 0 ? 'yyyy-MM-dd HH:mm' : 'HH:mm'
      time = formatInTimeZone(time, newTimeZone, format)
      newDataSet.push({ x: time, y: item.value })
    })

    return newDataSet
  }

  function getTimeStamp(time, daysAgo = 0) {
    const newTimeZone = ref_config.current.timeZone
    let timeStamp = parse(`${time}`, "HH:mm", new Date())
    if (daysAgo > 0) {
      timeStamp = addDays(timeStamp, -(daysAgo))
    }
    timeStamp = zonedTimeToUtc(timeStamp, newTimeZone);
    timeStamp = utcToZonedTime(timeStamp, currentTimeZone);
    timeStamp = timeStamp.valueOf()

    return timeStamp
  }

  function getIntFromTime(time) {
    return parseInt(time.split(':').join(''))
  }

  function parseHexColor(color) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };

    return `${result.r}, ${result.g}, ${result.b}`
  }

  function getTimeZone(country) {
    if (country === 'by') {
      const tz = 'Europe/Minsk'
      handleSelectTimeZone(tz)
      return tz
    }
  
    const tz = 'Europe/Warsaw'
      handleSelectTimeZone(tz)
      return tz
  }

  const actionButtonText = isStarted ? 'Stop' : 'Start'

  const chartClasses = [
    $s.chart,
    isAllHidden ? $s['chart--full'] : '',
    $s['chart--color-' + index]
  ].join(' ')
  
  const formatToLastPointTime = startDaysAgo > 0 ? 'yyyy-MM-dd HH:mm' : 'HH:mm'
  const lastPointTime = {...draw.lastPoint}
  if (lastPointTime.x) {
    const lastPointTimeParsed = parse(lastPointTime.x, formatToLastPointTime, new Date())
    lastPointTime.x = format(lastPointTimeParsed,  'HH:mm')
  }

  return (
    <div className={chartClasses} style={{ ['--chart-main-color-' + index]: config.colorRGB }} >
      <div className={$s['chart__view']} id={chart + config.selectedKey}>
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
            startDaysAgo={startDaysAgo}
          />
        }
      </div>
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
      {draw.isDataReady && 
        <CustomTooltip 
          key={chart + 'chartElementTooltip-' + config.selectedKey}
          config={config}
          currencyKey={config.currencyKeyObj}
          dataSet={dataSet}
          firstPoint={draw.firstPoint}
          labels={draw.labels}
          lastPoint={lastPointTime}
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

export default StaticHorizontalPanelChart