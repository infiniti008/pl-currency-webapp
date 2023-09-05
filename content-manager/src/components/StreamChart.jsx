import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import ChartElement from './Charts/Chart';
import { getKeyData } from '../api/services';
import { toast } from 'react-toastify';
import { format, addMinutes, parse, sub } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let itemsToChart = {}
const LABELS_DIFF_IN_MINUTES = 5

function ModalStream({ chart, handleRemoveChart, isAllHidden, handleSelectTimeZone, handleStartChart, model, index }) {
  const { currentStore } = useContext(CurrentStoreContext)
  const nowDate = new Date()
  const initialEndTime = format(nowDate, 'HH:mm')
  const initialStartTime =  format(sub(nowDate, { hours: 3 }), 'HH:mm');


  const [selectedCountry, setSelectedCountry] = useState('by')
  const [selectedKey, setSelectedKey] = useState('by-moex-usd-tod')
  const [startTime, setStartTime] = useState(initialStartTime)
  const [endTime, setEndTime] = useState(initialEndTime)
  const [isStarted, setIsStarted] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)
  const [dataSet, setDataSet] = useState([])
  const [labels, setLabels] = useState([])
  const [title, setTitle] = useState('')
  const [timeZone, setTimeZone] = useState('')
  const [lastPoint, setLastPoint] = useState({})
  const [prevLastPoint, setPrevLastPoint] = useState({})
  const [color, setColor] = useState('#84c8ff')
  const [colorRGB, setColorRGB] = useState('0, 0, 0')
  const [datasetMin, setDatasetMin] = useState(0)
  const [datasetMax, setDatasetMax] = useState(0)

  useEffect(() => {
    if (model.selectedKey) {
      setSelectedCountry(model.selectedCountry)
      setSelectedKey(model.selectedKey)
      setStartTime(model.startTime)
      setEndTime(model.endTime)
      setColor(model.color)
      if (model.isAutoRun) {
        setIsStarted(true)
      }
    }
  }, [])

  useEffect(() => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };

    setColorRGB(`${result.r}, ${result.g}, ${result.b}`)
  }, [color])

  useEffect(() => {
    switch (selectedCountry) {
      case 'by':
        setTimeZone('Europe/Minsk')
        handleSelectTimeZone('Europe/Minsk')
        break;
      case 'pl':
        setTimeZone('Europe/Warsaw')
        handleSelectTimeZone('Europe/Warsaw')
        break;
      default:
        setTimeZone('Europe/Warsaw')
        handleSelectTimeZone('Europe/Warsaw')
        break;
    }
  }, [selectedCountry])

  useEffect(() => {
    if (isStarted && selectedCountry && selectedKey && startTime && endTime) {
      fetchData(true)
      const startedChart = {
        selectedCountry,
        selectedKey,
        startTime,
        endTime,
        color
      }

      handleStartChart(chart, startedChart)
    } else if (isStarted) {
      toast.error("Please fill all fields", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      setIsDataReady(false)
    }
  }, [isStarted])

  useEffect(() => {
    if (isStarted && dataSet.length > 0 && itemsToChart[selectedKey]?.length >= 0) {
      setTimeout(() => {
        const clonedDataSet = [...dataSet]
        const firstEmptyItem = clonedDataSet.find(item => item.y === null)
        if (firstEmptyItem) {
          const itemToFillByTime = itemsToChart[selectedKey]?.find(item => item.x === firstEmptyItem.x && item.y !== null)
          if (itemToFillByTime) {
            firstEmptyItem.y = itemToFillByTime.y
            const nextAfterEmpty = clonedDataSet.indexOf(firstEmptyItem)
            if (clonedDataSet[nextAfterEmpty + 1]) {
              clonedDataSet[nextAfterEmpty + 1].y = null
            } else {
              clonedDataSet[0].y = null
            }
            setDataSet(clonedDataSet)
          } else {
            clonedDataSet[0].y = null
            // clonedDataSet[1].y = null
            setDataSet(clonedDataSet)

            fetchData(false)
          }
        } else {
          console.log(3)
        }
      }, 800)
    }
  }, [dataSet])

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
    setIsStarted(false)
    setIsDataReady(false)
  }

  function handleToggleStarted() {
    setIsStarted(!isStarted)
  }

  function getTimeStamp(time) {
    let timeStamp = parse(`${time}`, "HH:mm", new Date())
    timeStamp = zonedTimeToUtc(timeStamp, timeZone);
    timeStamp = utcToZonedTime(timeStamp, currentTimeZone);
    timeStamp = timeStamp.valueOf()

    return timeStamp
  }

  async function fetchData(initialRun) {
    itemsToChart[selectedKey] = []

    try {
      const startTimeStamp = getTimeStamp(startTime)
      const endTimeStamp = getTimeStamp(endTime) + 10000

      const request = {
        country: selectedCountry,
        key: selectedKey,
        startTime,
        endTime,
        startTimeStamp,
        endTimeStamp
      }
      const data = await getKeyData(request)

      if (data.length) {
        const newLabels = labels.length > 0 ? labels : prepareLabels()
        
        if (initialRun) {
          setLabels(newLabels)

          const name = prepareNameToChart()
          setTitle(name)
        }
        
        const preparedDataSet = prepareDataToChart(data, newLabels)

        const item = preparedDataSet[0]
        itemsToChart[selectedKey] = preparedDataSet

        const lastOne = preparedDataSet.findLast(item => item.y ? true : false) || item
        const prevLastOne = preparedDataSet.findLast(item => item.y && item.y !== lastOne.y ? true : false) || item
        const datasetMin = Math.min(...preparedDataSet.filter(item => item.y !== null).map(item => item.y))
        const datasetMax = Math.max(...preparedDataSet.filter(item => item.y !== null).map(item => item.y))

        setLastPoint(lastOne)
        setPrevLastPoint(prevLastOne)
        setDatasetMax(datasetMax)
        setDatasetMin(datasetMin)

        if (initialRun) {
          const clonedDataSet = preparedDataSet.map(item => {
            return {
              x: item.x,
              y: null
            }
          })

          setDataSet(clonedDataSet)
          
          setIsDataReady(true)
        }

      } else (
        handleToggleStarted()
      )
    } catch(err) {
      console.log(err)
      setIsStarted(false)
    }
  }

  const actionButtonText = isStarted ? 'Stop' : 'Start'

  const config = {
    selectedCountry,
    selectedKey,
    startTime,
    endTime
  }

  function getIntFromTime(time) {
    return parseInt(time.split(':').join(''))
  }

  function prepareLabels() {
    const newLabels = [startTime]
    let count = 0
    const countLimit = 100

    const intOfEndTime = getIntFromTime(endTime)
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

  function prepareDataToChart(data, newLabels) {
    const newDataSet = []

    data.forEach(item => {
      let time = new Date(item.timestamp)
      time = formatInTimeZone(time, timeZone, 'HH:mm')
      newDataSet.push({ x: time, y: item.value })
    })

    const lastDataSetItem = newDataSet[newDataSet.length - 1]
    const intOfLastDataSetItem = getIntFromTime(lastDataSetItem.x)
    const intOfEndTime = getIntFromTime(endTime)

    newLabels.forEach(labelItem => {
      const intOfLabelItem = getIntFromTime(labelItem)
      if (intOfLabelItem > intOfLastDataSetItem && intOfLastDataSetItem <= intOfEndTime) {
        newDataSet.push({
          x: labelItem,
          y: null
        })
      }
    })

    return newDataSet
  }

  function prepareNameToChart() {
    let name = keysArr.find(item => item.key === selectedKey) || {}
    name = name.currency + ' - ' + name.name
    
    return name
  }

  const chartClasses = [
    'chart',
    isAllHidden ? 'chart--full' : ''
  ].join(' ')

  return (
    <div className={chartClasses}>
      {
        !isAllHidden &&
        <div className='chart__config'>
          <div className='chart__config-group'>
            <select className='chart__config-select' value={selectedCountry} onChange={onChange.bind(null, setSelectedCountry)}>
              <option value="" disabled>Country</option>
              <option value="pl">PL</option>
              <option value="by">BY</option>
            </select>
          </div>
          <div className='chart__config-group'>
            <select className='chart__config-select' value={selectedKey} onChange={onChange.bind(null, setSelectedKey)}>
              <option value="" disabled>Key</option>
              {keys}
            </select>
          </div>
          <div className='chart__config-group'>
            <label htmlFor="">
              Start Time
            </label>
            <input type="time" value={startTime} onChange={onChange.bind(null, setStartTime)} />
          </div>
          <div className='chart__config-group'>
            <label htmlFor="">
              End Time
            </label>
            <input type="time" value={endTime} onChange={onChange.bind(null, setEndTime)} />
          </div>
          <div className='chart__config-group'>
            <input className={'color-chart-' + index} type="color" value={color} style={{ ['--after-color-chart-' + index]: color }} onChange={onChange.bind(null, setColor)} />
          </div>
          <button onClick={handleToggleStarted}>
            {actionButtonText}
          </button>
          <button onClick={handleRemoveChart}>Remove</button>
        </div>
      }
      <div className='chart__view'>
        {
          isDataReady && 
          <ChartElement
            key={chart + 'chartElement-' + selectedKey}
            config={config}
            title={title}
            dataSet={dataSet}
            labels={labels}
            lastPoint={lastPoint}
            prevLastPoint={prevLastPoint}
            colorRGB={colorRGB}
            datasetMin={datasetMin}
            datasetMax={datasetMax}
            selectedKey={chart + selectedKey}
          />
        }
      </div>
    </div>
  )
}

export default ModalStream