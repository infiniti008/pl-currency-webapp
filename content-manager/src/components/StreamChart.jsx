import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import ChartElement from './Charts/Chart';
import { getKeyData } from '../api/services';
import { toast } from 'react-toastify';
import { format, addMinutes, parse, differenceInMinutes, sub, setMilliseconds, setSeconds } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let itemsToChart = {}

function ModalStream({ chart, handleRemoveChart, isAllHidden, handleSelectTimeZone, handleStartChart, model, index }) {
  const { currentStore } = useContext(CurrentStoreContext)
  const nowDate = new Date()
  const todayDate = format(nowDate, 'yyyy-MM-dd')
  const initialEndTime = format(nowDate, 'HH:mm')
  const initialStartTime =  format(sub(nowDate, { hours: 3 }), 'HH:mm');


  const [selectedCountry, setSelectedCountry] = useState('by')
  const [selectedKey, setSelectedKey] = useState('by-moex-usd-tod')
  const [startTime, setStartTime] = useState(initialStartTime)
  const [endTime, setEndTime] = useState(initialEndTime)
  const [startDate, setStartDate] = useState(todayDate)
  const [endDate, setEndDate] = useState(todayDate)
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

  function getTimeStamp(time, date) {
    let timeStamp = parse(`${date}, ${time}`, "yyyy-MM-dd, HH:mm", new Date())
    timeStamp = zonedTimeToUtc(timeStamp, timeZone);
    timeStamp = utcToZonedTime(timeStamp, currentTimeZone);
    timeStamp = timeStamp.valueOf()

    return timeStamp
  }

  async function fetchData(resetDataSet) {
    itemsToChart[selectedKey] = []

    try {
      const startTimeStamp = getTimeStamp(startTime, startDate)
      const endTimeStamp = getTimeStamp(endTime, endDate)

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
        prepareNameToChart()
        const [preparedDataSet, labels] = prepareDataToChart(data)

        setLabels(labels)       

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

        if (resetDataSet) {
          const clonedDataSet = preparedDataSet.map(item => {
            return {
              x: item.x,
              y: null
            }
          })
          setDataSet(clonedDataSet)
        }

        setIsDataReady(true)
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

  function prepareDataToChart(data) {
    const newDataSet = []
    const newLabels = []

    data.forEach(item => {
      let time = new Date(item.timestamp)
      time = formatInTimeZone(time, timeZone, 'yyyy-MM-dd, HH:mm')
      newDataSet.push({ x: time, y: item.value })
      newLabels.push(time)
    })

    const firstTime = setMilliseconds(setSeconds(new Date(data?.[0]?.timestamp), 0), 0)
    const secondTime = setMilliseconds(setSeconds(new Date(data?.[1]?.timestamp), 0), 0)
    const diffMins = differenceInMinutes(secondTime, firstTime)

    const lastLebelTime = newDataSet[newDataSet.length - 1]?.x || ''
    const lastLebelTimeInt = getIntTimeFromLabel(lastLebelTime)
    const endTimeInt = getIntTimeFromLabel(`${endDate}, ${endTime}`)
    const parsedDate = parse(lastLebelTime, "yyyy-MM-dd, HH:mm", new Date())

    if (lastLebelTimeInt < endTimeInt) {
      const newDate = addMinutes(parsedDate, diffMins)
      const newTimeString = format(newDate, "yyyy-MM-dd, HH:mm")
      let newTimeStringInt = getIntTimeFromLabel(newTimeString)
      newDataSet.push({ x: newTimeString, y: null })
      newLabels.push(newTimeString)

      while(newTimeStringInt < endTimeInt) {
        const lastLebelTime = newDataSet[newDataSet.length - 1].x
        const parsedDate = parse(lastLebelTime, "yyyy-MM-dd, HH:mm", new Date())
        const newDate = addMinutes(parsedDate, diffMins)
        const newTimeString = format(newDate, "yyyy-MM-dd, HH:mm")
        newTimeStringInt = getIntTimeFromLabel(newTimeString)
        newDataSet.push({ x: newTimeString, y: null })
        newLabels.push(newTimeString)
      }
    }

    return [newDataSet, newLabels]
  }

  function getIntTimeFromLabel(dateTime) {
    const value = parseInt(
      format(
        parse(
          dateTime,
          'yyyy-MM-dd, HH:mm',
          new Date()
        ),
        'HHmm'
      )
    )

    return value
  }

  function prepareNameToChart() {
    let name = keysArr.find(item => item.key === selectedKey) || {}
    name = name.currency + ' - ' + name.name
    setTitle(name)
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
            <input type="date" value={startDate} onChange={onChange.bind(null, setStartDate)} />
            <input type="time" value={startTime} onChange={onChange.bind(null, setStartTime)} />
          </div>
          <div className='chart__config-group'>
            <input type="date" value={endDate} onChange={onChange.bind(null, setEndDate)} />
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